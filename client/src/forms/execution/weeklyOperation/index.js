import React, { Component } from 'react';
import { getPrevItems, getAllItem, removeItem, saveItem, updateItem, getItem } from '../../../api/index';
import { message, Select } from 'antd';
import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import NumberFormat from 'react-number-format';
import { columns, storeIndex, pageHeder } from './statics'
import { successDuration, successMessage, errorMessage, errorDuration, selectDefaultProp, numberDefaultProp } from '../../../components/statics'
import Approve from '../../../components/approve/index';
import History from '../../../components/approve/history';
import { findNextStep } from '../../../functions/index';
import { status } from '../../../components/approve/statics'

class WeeklyOperation extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, rows: [], periods: [], contracts: [], errors: {},
            //contract_id: 0, period_id: 0, parent_id: 0, prev_parent_id: 0, prev_period_id: 0,
            tableData: [], isFetching: true, showPanel: false, status: '', contractTitle: ""
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
        Promise.all([getAllItem(storeIndex), getAllItem('contract/vw'), getAllItem('period'),
        getItem("weeklyOperation", 'PermissionStructure')]).then((response) => {
            let contracts = response[1].data.map(a => { return { key: a.id, label: a.contract_no + ' - ' + a.company, value: a.id, title: a.title } });
            let periods = response[2].data.map(a => { return { key: a.id, label: a.title, value: a.id, end_date: a.end_date, start_date: a.start_date } });
            let roleId = JSON.parse(localStorage.getItem('user')).role_id;
            let canAdd = response[3].data[0].item_creator_id === roleId || roleId ===11 ? true : false;
            let canEdit = response[3].data[0].item_editor_id.indexOf(roleId) > -1 || roleId > 11 ? true : false;
            this.setState({
                canAdd, canEdit,
                isFetching: false, rows: response[0].data, contracts, periods, tableData: [], showTable: false,
                status: '', showPanel: false, contract_id: "", period_id: "", parent_id: "", prev_parent_id: "", prev_period_id: "",
            });
        }).catch((error) => console.log(error))
    }
    fetchDetailData() {
        //  
        let { contract_id, parent_id, period_id } = this.state;
        parent_id = parent_id ? parent_id : 0;

        Promise.all([getItem(contract_id, 'wbs'),
        getItem(parent_id, 'WeeklyOperationDetail'),
        getPrevItems("WeeklyOperationDetail", contract_id, period_id)
        ]).then((response) => {
            let wbs = response[0].data;
            let curr = response[1].data;
            let prev = response[2].data;
            let tableData = [];
            wbs.forEach(e => {
                let p = prev.find(a => a.operation === e.operation && a.unit === e.unit);
                let c = curr.find(a => a.operation === e.operation && a.unit === e.unit);
                let oo = {
                    //    cumulative_plan: 0,//p ? p.prev_plan : 0,//:
                    cumulative_done: p ? p.prev_done : 0,//:
                    //   current_plan: c ? c.current_plan : 0,
                    current_done: c ? c.current_done : 0,
                }
                //  oo.sum_plan = oo.cumulative_plan + oo.current_plan;
                // oo.sum_done = oo.cumulative_done + oo.current_done;
                //change this
                oo.plan = 0;
                tableData.push({ ...oo, operation: e.operation, unit: e.unit, totalWork: e.value_change, sort: e.sort })
            });
            // ;
            this.setState({ tableData, showTable: true, isFetching: false });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }
    async saveBtnClick() {
        const { contract_id, period_id, parent_id } = this.state;

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
            unit: a.unit,
            total_work: a.totalWork,
            cumulative_plan: a.cumulative_plan,
            cumulative_done: a.cumulative_done,
            current_plan: a.current_plan,
            current_done: parseInt(a.current_done),
            sort: a.sort
        }))

        let obj = { contract_id, period_id, rows }
        let xx = await findNextStep('weeklyOperation', contract_id, 'a');
        obj.current_user_id = xx;
        obj.status = xx === -1 ? status.approved : status.wait;
        obj.entity_name = 'weeklyOperation';
        obj.role_id = JSON.parse(localStorage.getItem('user')).role_id;


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

            let pervItems = this.state.rows.filter(a => a.contract_id === values);
            if (pervItems[0]) {
                let prevPeriod = this.state.periods.find(a => a.key === pervItems[0].period_id);
                if (prevPeriod) {
                    let periods = this.state.periods.filter(a => a.end_date > prevPeriod.end_date);
                    let period_id = periods[0].key;
                    let prev_parent_id = pervItems[0].id;
                    this.setState({ contractTitle, contract_id: values, period_id, prev_parent_id });
                }
                else
                    this.setState({ contract_id: values, contractTitle });
            }
            else
                this.setState({ contract_id: values, contractTitle });
        }

    }
    editClickHandle(item) {
        this.setState({
            period_id: item.period_id, contract_id: item.contract_id,
            parent_id: item.id, status: 'edit', showPanel: true
        }, () => {
            this.fetchDetailData();
            this.scrollToFormRef();
        });
    }
    displayClickHandle(item) {
        console.log(item);
        let status = 'display';
        if (item.status === 'در انتظار ویرایش' && item.current_user_id === JSON.parse(localStorage.getItem('user')).id)
            status = 'edit';
        this.setState({
            obj: item, status, showPanel: true,
            contract_id: item.contract_id, period_id: item.period_id,
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
                                        {this.state.canAdd && <div className='col-1  ml-auto'>
                                            <i className="fa fa-plus-circle add-button" onClick={this.newClickHandle}></i>
                                        </div>}
                                    </div>
                                </div>
                                <div className="card-body">
                                    <Grid columns={this.state.columns} rows={this.state.rows}
                                        editClick={this.state.canEdit ? this.editClickHandle : undefined}
                                        displayClick={this.displayClickHandle}
                                        deleteClick={this.state.canEdit ? this.deleteClickHandle : undefined}></Grid>
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
                                                <label htmlFor="contract_id" className={this.state.errors.town_id ? "error-lable" : ''}> پیمان</label>
                                                {this.state.contract_id && <label className="form-control">{this.state.contracts.find(a => a.key === this.state.contract_id).label}</label>}
                                                {!this.state.contract_id &&
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.contracts}
                                                        className={this.state.errors.contract_id ? "form-control error-control" : 'form-control'}
                                                        value={this.state.contract_id} onSelect={(values) => this.selectChange("contract_id", values)} />}
                                            </div>
                                        </div>

                                        <div className="col-5">
                                            <div className="form-group">
                                                <label htmlFor="period_id" className="">دوره</label>
                                                {this.state.period_id && <label className="form-control">{this.state.periods.find(a => a.key === this.state.period_id).label}</label>}
                                                {!this.state.period_id && <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.periods}
                                                    value={this.state.period_id} onSelect={(values) => this.setState({ period_id: values })} />}
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
                                                <label htmlFor="project_id" className="">نام پیمان</label>
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
                                                        <th>واحد</th>
                                                        <th>مقدار کل</th>
                                                        <th>تجمعی تا در دوره قبل</th>
                                                        <th>مقدار دوره</th>
                                                        <th>مقدار تجمعی</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.tableData.map((item, i) => {
                                                        return <tr key={i}>
                                                            <td><label className='tableSpan'>{i + 1}</label></td>
                                                            <td><label className='tableSpan'>{item.operation}</label></td>
                                                            <td><label className='tableSpan'>{item.unit}</label></td>
                                                            <td><label className='tableSpan'>{item.totalWork.toLocaleString()}</label></td>

                                                            <td><label className='tableSpan'>{item.cumulative_done.toLocaleString()}</label></td>

                                                            <td><input name="current_done" className="form-control" onChange={(e) => this.handleChange(e, i)}
                                                                value={item.current_done} type='number' disabled={this.state.status === 'display'} /></td>

                                                            <td><label className='tableSpan'>{(parseInt(item.cumulative_done) + parseInt(item.current_done)).toLocaleString()}</label></td>
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
                    <div className='row'>
                        {this.state.status === 'display' && <Approve item={this.state.obj} entityName='weeklyOperation' onEnd={this.cancelBtnClick}></Approve>}
                        {this.state.status === 'display' && <History item={this.state.obj} entityName='weeklyOperation'></History>}
                    </div>
                </div>
            )
        }
    }

}
export default WeeklyOperation;