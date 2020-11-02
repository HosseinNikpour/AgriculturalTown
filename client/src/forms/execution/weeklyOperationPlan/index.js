import React, { Component } from 'react';
import { getPrevItems, getAllItem, removeItem, saveItem, updateItem, getItem } from '../../../api/index';
import { message, Select } from 'antd';
import moment from 'moment-jalaali';
import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage, errorDuration, selectDefaultProp } from '../../../components/statics'


class WeeklyOperationPlan extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, rows: [], periods: [], contracts: [], errors: {}, obj: { ...emptyItem },
            //contract_id: 0, period_id: 0, parent_id: 0, prev_parent_id: 0, prev_period_id: 0,
            tableData: [], isFetching: true, showPanel: false, status: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.newClickHandle = this.newClickHandle.bind(this);
        this.editClickHandle = this.editClickHandle.bind(this);
        this.deleteClickHandle = this.deleteClickHandle.bind(this);
        this.displayClickHandle = this.displayClickHandle.bind(this);
        this.saveBtnClick = this.saveBtnClick.bind(this);
        this.cancelBtnClick = this.cancelBtnClick.bind(this);
        this.fetchDetailData = this.fetchDetailData.bind(this);
    }

    scrollToFormRef = () => window.scrollTo({ top: this.formRef.offsetTop, behavior: 'smooth' })
    scrollToGridRef = () => window.scrollTo({ top: 0, behavior: 'smooth', })

    fetchData() {
        Promise.all([getAllItem(storeIndex), getAllItem('contract/vw'), getAllItem('baseInfo/vw'), getAllItem('extension/vw'), getAllItem('period')]).then((response) => {
            let contracts = response[1].data.map(a => {
                return {
                    key: a.id, label: a.contract_no + ' - ' + a.company, value: a.id, title: a.title,
                    end_date: a.end_date ? moment(a.end_date) : undefined, start_date: a.start_date ? moment(a.start_date) : undefined
                }
            });
            let plans = response[2].data.filter(a => a.groupid === 37).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let extensions = response[3].data.map(a => { return { id: a.id,type_id:a.type_id, end_date: a.end_date ? moment(a.end_date) : undefined, contract_id: a.contract_id } });
            let periods = response[4].data.map(a => { return { id: a.id, end_date: a.end_date ? moment(a.end_date) : undefined, start_date: a.start_date ? moment(a.start_date) : undefined, title: a.title } });

            this.setState({
                isFetching: false, rows: response[0].data, contracts, extensions, plans, periods, tableData: [], showTable: false,
                status: '', showPanel: false,
                // contract_id: "", period_id: "", parent_id: "", prev_parent_id: "", prev_period_id: "",
            });
        }).catch((error) => console.log(error))
    }
    fetchDetailData() {
        let { periods, contractStartDate, contractEndDate, contractEndDate2, parent_id } = this.state;
        let tableData = [];
        if (parent_id) {
            getItem(parent_id,storeIndex+'Detail').then(res=>{
                res.data.forEach(e => {
                    let p=periods.find(a=>a.id===e.period_id);
                    tableData.push({ id: e.id, title: p.title, startDate: p.start_date.format('jYYYY/jMM/jDD'), 
                    endDate: p.end_date.format('jYYYY/jMM/jDD'),cumulative_done:e.cumulative_done })

                });
                this.setState({ tableData, showTable: true, isFetching: false });
            }).catch((error) => console.log(error))
        }
        else {
            contractEndDate = contractEndDate2 ? contractEndDate2 : contractEndDate;
            let first = periods.find(a => a.start_date.isSameOrBefore(contractStartDate, 'day') && a.end_date.isSameOrAfter(contractStartDate, 'day'));
            let last = periods.find(a => a.start_date.isSameOrBefore(contractEndDate, 'day') && a.end_date.isSameOrAfter(contractEndDate, 'day'));

            periods.forEach(e => {
                if (e.id >= first.id && e.id <= last.id) {
                    tableData.push({ id: e.id, title: e.title, startDate: e.start_date.format('jYYYY/jMM/jDD'), endDate: e.end_date.format('jYYYY/jMM/jDD') })
                }
            });
            this.setState({ tableData, showTable: true, isFetching: false });
        }
       



    }
    componentDidMount() {
        this.fetchData();
    }
    saveBtnClick() {

        let tbl = this.state.tableData;
        const { contract_id, plan_id, parent_id } = this.state;

        let rows = tbl.map((a, i) => ({
            period_id: a.id,
            cumulative_done: a.cumulative_done,
            sort: i
        }))

        let obj = { contract_id, plan_id, rows }
        console.log(obj)
        if (this.state.status === 'new') {
            saveItem(obj, storeIndex).then((response) => {
                if (response.data.type !== "Error") {
                    message.success(successMessage, successDuration);
                    this.fetchData();
                }
                else {
                    message.error(errorMessage, errorDuration);
                    console.error('error : ', response);
                }
            }).catch((error) => console.log(error));
        }
        else {
            obj.parent_id = parent_id;
            updateItem(obj, storeIndex).then((response) => {
                if (response.data.type !== "Error") {
                    message.success(successMessage, successDuration);
                    this.fetchData();
                }
                else {
                    message.error(errorMessage, errorDuration);
                    console.error('error : ', response);
                }
            }).catch((error) => console.log(error));
        }

    }
    handleChange(e, i) {
        let tableData = this.state.tableData;
        tableData[i][e.target.name] = e.target.value;
        this.setState({ tableData });
    }
    selectChange(name, values) {

        if (name === 'contract_id') {
            let { contractTitle, contractStartDate, contractEndDate, contractEndDate2, contracts, extensions } = this.state;

            let cont = contracts.find(a => a.key === values);
            contractTitle = cont && cont.title ? cont.title : '';
            contractStartDate = cont && cont.start_date ? cont.start_date : '';
            contractEndDate = cont && cont.end_date ? cont.end_date : '';
            let ext = extensions.filter(a => a.contract_id === values && a.type_id == 1);
            contractEndDate2 = ext[0] && ext[0].end_date ? ext[0].end_date : '';
            this.setState({ contract_id: values, contractTitle, contractStartDate, contractEndDate, contractEndDate2 });
        }
        else if (name === 'plan_id')
            this.setState({ plan_id: values });

    }
    editClickHandle(item) {
        let { contracts, extensions } = this.state;

        let cont = contracts.find(a => a.key === item.contract_id);
        let contractTitle = cont && cont.title ? cont.title : '';
        let contractStartDate = cont && cont.start_date ? cont.start_date : '';
        let contractEndDate = cont && cont.end_date ? cont.end_date : '';
        let ext = extensions.filter(a => a.contract_id === item.contract_id && a.type_id == 1);
        let contractEndDate2 = ext[0] && ext[0].end_date ? ext[0].end_date : '';

        this.setState({
            plan_id: item.plan_id, contract_id: item.contract_id,
            contractTitle, contractStartDate, contractEndDate, contractEndDate2,
            parent_id: item.id, status: 'edit', showPanel: true
        }, () => {
            this.fetchDetailData();
            this.scrollToFormRef();
        });
    }
    displayClickHandle(item) {
        let { contracts, extensions } = this.state;

        let cont = contracts.find(a => a.key === item.contract_id);
        let contractTitle = cont && cont.title ? cont.title : '';
        let contractStartDate = cont && cont.start_date ? cont.start_date : '';
        let contractEndDate = cont && cont.end_date ? cont.end_date : '';
        let ext = extensions.filter(a => a.contract_id === item.contract_id && a.type_id == 1);
        let contractEndDate2 = ext[0] && ext[0].end_date ? ext[0].end_date : '';
      
        this.setState({
            obj: item, status: 'display', showPanel: true,
            contract_id: item.contract_id, plan_id: item.plan_id,
            contractTitle, contractStartDate, contractEndDate, contractEndDate2,
            parent_id: item.id,
        }, () => {
            this.scrollToFormRef();
            this.fetchDetailData();
        });


    }
    deleteClickHandle(item) {
        console.log(item)
        removeItem(item.id, storeIndex).then((response) => {
            if (response.data.type !== "Error") {
                this.fetchData();
                message.success(successMessage, successDuration);
            }
            else {
                message.error(errorMessage, errorDuration);
                console.log('error : ', response);
            }
        }).catch((error) => console.log(error))
    }
    newClickHandle() {
        this.setState({
            status: 'new', showPanel: true
        }, () => { this.scrollToFormRef(); });
    }
    cancelBtnClick() {
        this.setState({
            contract_id: "", period_id: "", parent_id: "", prev_parent_id: "",
            prev_period_id: "", status: '', showPanel: false, tableData: [], showTable: false
        }, () => { this.scrollToGridRef(); });
    }
    render() {
        const { isFetching } = this.state;

        if (isFetching) {
            return (<Loading></Loading>)
        }
        else {
            return (
                <div className="app-main col-12" >
                    <div className="row" >
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col">
                                            {pageHeder}
                                        </div>
                                        <div className='col-1  ml-auto'>
                                            <i className="fa fa-plus-circle add-button" onClick={this.newClickHandle}></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <Grid columns={this.state.columns} rows={this.state.rows}
                                        editClick={this.editClickHandle}
                                        displayClick={this.displayClickHandle}
                                        deleteClick={this.deleteClickHandle}></Grid>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ref={(ref) => this.formRef = ref} className={this.state.showPanel ? 'row' : 'row hidden'}>
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    {this.state.status === 'new' ? 'اضافه کردن آیتم جدید' : this.state.status === 'edit' ? 'ویرایش آیتم' : 'مشاهده آیتم'}
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="form-group">
                                                <label htmlFor="contract_id" className={this.state.errors.contract_id ? "error-lable" : ''}>شماره پیمان</label>
                                                <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.contracts}
                                                    className={this.state.errors.contract_id ? "form-control error-control" : 'form-control'}
                                                    value={this.state.contract_id} onSelect={(values) => this.selectChange("contract_id", values)} />
                                            </div>
                                        </div>

                                        <div className="col-8">
                                            <div className="form-group">
                                                <label htmlFor="project_id" className="">نام پیمان</label>
                                                <label className="form-control">{this.state.contractTitle}</label>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="form-group">
                                                <label htmlFor="project_id" className="">تاریخ شروع پیمان</label>
                                                <label className="form-control">{this.state.contractStartDate ? this.state.contractStartDate.format('jYYYY/jMM/jDD') : ''}</label>
                                            </div>
                                        </div>

                                        <div className="col-4">
                                            <div className="form-group">
                                                <label htmlFor="project_id" className="">تاریخ پایان پیمان</label>
                                                <label className="form-control">{this.state.contractEndDate ? this.state.contractEndDate.format('jYYYY/jMM/jDD') : ''}</label>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="form-group">
                                                <label htmlFor="project_id" className="">تاریخ پایان با احتساب تمدید</label>
                                                <label className="form-control">{this.state.contractEndDate2 ? this.state.contractEndDate2.format('jYYYY/jMM/jDD') : ''}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="form-group">
                                                <label htmlFor="plan_id" className={this.state.errors.plan_id ? "error-lable" : ''}>شماره برنامه زمانبندی</label>
                                                <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.plans}
                                                    className={this.state.errors.plan_id ? "form-control error-control" : 'form-control'}
                                                    value={this.state.plan_id} onSelect={(values) => this.selectChange("plan_id", values)} />
                                            </div>
                                        </div>
                                        {this.state.status === 'new' && <div className="col-1">
                                            <div className="form-group">
                                                <button className='btn btn-primary marginTop35' onClick={this.fetchDetailData}>مشاهده</button>
                                            </div>
                                        </div>}
                                    </div>
                                    <hr />
                                    <div className={this.state.showTable ? 'row' : 'hidden'}>
                                        <div className='col'>
                                            <table className='table table-striped table-bordered'>
                                                <thead>

                                                    <tr>
                                                        <th>ردیف</th>
                                                        <th>عنوان دوره</th>
                                                        <th>تاریخ شروع</th>
                                                        <th>تاریخ پایان</th>
                                                        <th>درصد انجام</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.tableData.map((item, i) => {
                                                        return <tr key={i}>
                                                            <td><label className='tableSpan'>{i + 1}</label></td>
                                                            <td><label className='tableSpan'>{item.title}</label></td>
                                                            <td><label className='tableSpan'>{item.startDate}</label></td>
                                                            <td><label className='tableSpan'>{item.endDate}</label></td>

                                                            <td><input name="cumulative_done" className="form-control"
                                                                onChange={(e) => this.handleChange(e, i)} value={item.cumulative_done}
                                                                type='number' disabled={this.state.status === 'display'} /></td>

                                                        </tr>
                                                    })}

                                                </tbody>
                                            </table>
                                            {this.state.status !== 'display' && <input type="button" className="btn btn-primary" style={{ margin: "10px" }} onClick={this.saveBtnClick} value="ذخیره" />}
                                            <input type="button" className="btn btn-outline-primary" style={{ margin: "10px" }} value="بستن" onClick={this.cancelBtnClick} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

}
export default WeeklyOperationPlan;