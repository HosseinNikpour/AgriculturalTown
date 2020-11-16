import React, { Component } from 'react';
import { getAllItem, removeItem, saveItem, updateItem, getItem } from '../../../api/index';
import { message, Select } from 'antd';
import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import moment from 'moment-jalaali';
import DatePicker from 'react-datepicker2';
import { columns, storeIndex, pageHeder } from './statics'
import { successDuration, successMessage, errorMessage, errorDuration, selectDefaultProp, datePickerDefaultProp } from '../../../components/statics'


class StudyOperation extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, rows: [], contracts: [], errors: {},
            //contract_id: 0, period_id: 0, parent_id: 0, prev_parent_id: 0, prev_period_id: 0,
            tableData: [], isFetching: true, showPanel: false, status: '', contractTitle: "", report_date: undefined,
        }

        this.handleChange = this.handleChange.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.newClickHandle = this.newClickHandle.bind(this);
        this.editClickHandle = this.editClickHandle.bind(this);
        this.numberChange = this.numberChange.bind(this);
        this.deleteClickHandle = this.deleteClickHandle.bind(this);
        this.displayClickHandle = this.displayClickHandle.bind(this);
        this.saveBtnClick = this.saveBtnClick.bind(this);
        this.cancelBtnClick = this.cancelBtnClick.bind(this);
        this.fetchDetailData = this.fetchDetailData.bind(this);
    }

    scrollToFormRef = () => window.scrollTo({ top: this.formRef.offsetTop, behavior: 'smooth' })
    scrollToGridRef = () => window.scrollTo({ top: 0, behavior: 'smooth', })

    fetchData() {
        Promise.all([getAllItem(storeIndex), getAllItem('agreement/vw')]).then((response) => {
            let contracts = response[1].data.map(a => { return { key: a.id, label: a.contract_no + ' - ' + a.company, value: a.id, title: a.title } });
            let data = response[0].data;
            data.forEach(e => {

                e.report_date = e.report_date ? moment(e.report_date) : undefined;
            });
            this.setState({
                isFetching: false, rows: data, contracts, tableData: [], showTable: false,
                status: '', showPanel: false, contract_id: "", parent_id: "",
            });
        }).catch((error) => console.log(error))
    }
    fetchDetailData() {

        let { contract_id, parent_id } = this.state;
        parent_id = parent_id ? parent_id : 0;

        Promise.all([getItem(contract_id, 'studyWbs'), getItem(parent_id, 'StudyOperationDetail')]).then((response) => {
            let wbs = response[0].data;
            let curr = response[1].data;

            let tableData = [];
            wbs.forEach(e => {
                let p = curr.find(a => a.operation === e.operation);
                let oo = {

                    percent_done: p ? p.percent_done : 0,//:
                    progress_done: p ? p.progress_done : 0,//:
                    percent_approve: p ? p.percent_approve : 0,
                    progress_approve: p ? p.progress_approve : 0,
                }

                tableData.push({ ...oo, operation: e.operation, weight: e.weight, sort: e.sort })
            });
            // ;
            this.setState({ tableData, showTable: true, isFetching: false });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }
    async saveBtnClick() {
        const { contract_id, report_date, parent_id } = this.state;

        let tbl = this.state.tableData;

        /*let errors = this.state.errors;

        errors.contract_id = obj.contract_id ? false : true;
     

        if (Object.values(errors).filter(a => a).length > 0) {
            this.setState({ errors }, () => { this.scrollToFormRef(); });
            alert("لطفا موارد الزامی را وارد کنید");
        }
        else {*/


        let rows = tbl.map(a => ({
            operation: a.operation,
            weight: a.weight,
            percent_done: a.percent_done,
            progress_done: parseFloat(a.percent_done) * parseFloat(a.weight),
            percent_approve: a.percent_approve,
            progress_approve: parseFloat(a.percent_approve) * parseFloat(a.weight),

            sort: a.sort
        }))

        let obj = { contract_id, report_date, rows,parent_id }

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
            obj.id=parent_id;
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
    numberChange(name, values) {
        const { formattedValue, value } = values;
        let ob = this.state.obj;
        ob[name] = value;
        this.setState({ obj: ob });
    }

    handleChange(e, i) {
        let tableData = this.state.tableData;
        tableData[i][e.target.name] = e.target.value;
        this.setState({ tableData });
    }
    selectChange(name, values) {
        let contractTitle = this.state.contractTitle;
        if (name === 'contract_id') {
            let cont = this.state.contracts.find(a => a.key == values);
            contractTitle = cont && cont.title ? cont.title : '';
            this.setState({ contract_id: values, contractTitle });
        }

    }
    editClickHandle(item) {
        this.setState({
            report_date: item.report_date, contract_id: item.contract_id,
            parent_id: item.id, status: 'edit', showPanel: true
        }, () => {
            this.fetchDetailData();
            this.scrollToFormRef();
        });
    }
    displayClickHandle(item) {
        //   console.log(item);
        let status = 'display';
        // if (item.status === 'در انتظار ویرایش' && item.current_user_id === JSON.parse(localStorage.getItem('user')).id)
        //    status = 'edit';
        this.setState({
            obj: item, status, showPanel: true,
            contract_id: item.contract_id, report_date: item.report_date,
            parent_id: item.id,
        }, () => {
            this.scrollToFormRef();
            this.fetchDetailData();
        });


    }
    deleteClickHandle(item) {
        //  console.log(item)
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
            contract_id: "", report_date: "", parent_id: "",
            status: '', showPanel: false, tableData: [], showTable: false
        }, () => { this.scrollToGridRef(); this.fetchData(); });
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
                                        <div className="col-6">
                                            <div className="form-group">
                                                <label htmlFor="contract_id" className={this.state.errors.town_id ? "error-lable" : ''}> قرارداد</label>
                                                {this.state.contract_id && <label className="form-control">{this.state.contracts.find(a => a.key === this.state.contract_id).label}</label>}
                                                {!this.state.contract_id &&
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.contracts}
                                                        className={this.state.errors.contract_id ? "form-control error-control" : 'form-control'}
                                                        value={this.state.contract_id} onSelect={(values) => this.selectChange("contract_id", values)} />}
                                            </div>
                                        </div>

                                        <div className="col-5">
                                            <div className="form-group">
                                                <label htmlFor="report_date" className="">تاریخ گزارش</label>
                                                <DatePicker onChange={value => this.setState({ report_date: value })}

                                                    value={this.state.report_date}
                                                    disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                            </div>
                                        </div>
                                        {this.state.status === 'new' && <div className="col-1">
                                            <div className="form-group">
                                                <button className='btn btn-primary' onClick={this.fetchDetailData}>مشاهده</button>
                                            </div>
                                        </div>}
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="project_id" className="">نام قرارداد</label>
                                                <label className="form-control">{this.state.contractTitle}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className={this.state.showTable ? 'row' : 'hidden'}>
                                        <div className='col'>
                                            <table className='table table-striped table-bordered'>
                                                <thead>

                                                    <tr>
                                                        <th>ردیف</th>
                                                        <th>شرح فعالیت</th>
                                                        <th>وزن نهایی</th>
                                                        <th>درصد انجام شده</th>
                                                        <th>پیشرفت انجام شده</th>
                                                        <th>درصد تایید شده</th>
                                                        <th>پیشرفت تایید شده</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.tableData.map((item, i) => {
                                                        return <tr key={i}>
                                                            <td><label className='tableSpan'>{i + 1}</label></td>
                                                            <td><label className='tableSpan'>{item.operation}</label></td>
                                                            <td><label className='tableSpan'>{item.weight}</label></td>
                                                            <td><input name="percent_done" className="form-control" onChange={(e) => this.handleChange(e, i)}
                                                                value={item.percent_done} type='number' disabled={this.state.status === 'display'} /></td>
                                                            <td><label className='tableSpan'>{(parseFloat(item.percent_done) * parseFloat(item.weight)/100)}</label></td>
                                                            <td><input name="percent_approve" className="form-control" onChange={(e) => this.handleChange(e, i)}
                                                                value={item.percent_approve} type='number' disabled={this.state.status === 'display'} /></td>
                                                            <td><label className='tableSpan'>{(parseFloat(item.percent_approve) * parseFloat(item.weight)/100)}</label></td>
                                                        </tr>
                                                       
                                                    })}
                                                        <tr>
                                                        <td></td><td colspan='2'>جمع</td>
                                                        <td></td><td>{this.state.tableData.reduce((a, b) => a + ((parseFloat(b.percent_done) * parseFloat(b.weight)/100) || 0), 0)}</td>
                                                        <td></td><td>{this.state.tableData.reduce((a, b) => a + ((parseFloat(b.percent_approve) * parseFloat(b.weight)/100) || 0), 0)}</td>
                                                        </tr>
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
export default StudyOperation;