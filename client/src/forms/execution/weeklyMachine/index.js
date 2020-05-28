import React, { Component } from 'react';
import { getAllItem, removeItem, saveItem, updateItem, getItem } from '../../../api/index';
import { message, Select } from 'antd';
import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder } from './statics'
import { successDuration, successMessage, errorMessage, errorDuration, selectDefaultProp } from '../../../components/statics'

import Approve from '../../../components/approve/index';
import History from '../../../components/approve/history';
import { findNextStep } from '../../../functions/index';
import { status } from '../../../components/approve/statics'

class WeeklyMachine extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, rows: [], periods: [], contracts: [],
            tableData: [], isFetching: true, showPanel: false, status: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.newClickHandle = this.newClickHandle.bind(this);
        this.new2ClickHandle = this.new2ClickHandle.bind(this);
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
        Promise.all([getAllItem(storeIndex), getAllItem('contract'), getAllItem('period'),
        getAllItem('baseinfo'), getItem("weeklyMachine", 'PermissionStructure')]).then((response) => {
            let contracts = response[1].data.map(a => { return { key: a.id, label: a.title, value: a.id, project: a.project } });
            let periods = response[2].data.map(a => { return { key: a.id, label: a.title, value: a.id, end_date: a.end_date, start_date: a.start_date } });
            let machineTypes = response[3].data.filter(a => a.groupid === 22).map(a => { return { key: a.id, label: a.title, value: a.id } });

            let roleId = JSON.parse(localStorage.getItem('user')).role_id;
            let canAdd = response[4].data[0].item_creator_id === roleId || roleId > 3 ? true : false;
            let canEdit = response[4].data[0].item_editor_id.indexOf(roleId) > -1 || roleId > 3 ? true : false;
            this.setState({
                canAdd, canEdit,
                isFetching: false, rows: response[0].data, contracts, periods, tableData: [],
                showTable: false, machineTypes,
                status: '', showPanel: false, contract_id: "", period_id: "", parent_id: "", prev_parent_id: "", prev_period_id: "",
            });
        }).catch((error) => console.log(error))
    }
    fetchDetailData() {
        let { period_id, parent_id } = this.state;
        parent_id = parent_id ? parent_id : 0;

        getItem(parent_id, 'WeeklyMachineDetail').then((response) => {
            let data = response.data ? response.data : [];
            let tableData = data;// [];
            // let per = this.state.periods.find(a => a.key === period_id);
            // let s = moment(per.start_date), e = moment(per.end_date).add(1, 'days');

            // while (s.isBefore(e)) {
            //     let curr = data.find(a => moment(a.date).format('jYYYY/jMM/jDD') === s.format('jYYYY/jMM/jDD'))

            //     tableData.push({
            //         date: s.format('jYYYY/jMM/jDD'),
            //         day: s.format('ddd'),
            //         shift_count: curr ? curr.shift_count : 0,
            //         weather_status_id: curr ? curr.weather_status_id : "",
            //         workshop_status_id: curr ? curr.workshop_status_id : "",
            //         rain: curr ? curr.rain : 0
            //     });

            //     s.add(1, 'days');
            // }


            this.setState({ tableData, showTable: true, isFetching: false });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }
    async saveBtnClick() {

        let rows = this.state.tableData;
        const { contract_id, period_id, parent_id } = this.state;

        let errorRows = [];
        rows.forEach((r, i) => {
            if (!r.machine_type_id && errorRows.indexOf(i + 1) < 0) errorRows.push(i + 1);
          //  else if (!r.workshop_status_id && errorRows.indexOf(i + 1) < 0) errorRows.push(i + 1);

        });

        if (errorRows.length > 0)
            alert('لطفا ستون های الزامی را وارد کنید . ردیف های ' + errorRows.toString())
        else {
            // rows.forEach(e => {
            //     e.date = moment(e.date, 'jYYYY/jMM/jDD').format();
            // });


            let obj = { contract_id, period_id, rows };
            let xx = await findNextStep('weeklyMachine', contract_id, 'a');
            obj.current_user_id = xx;
            obj.status = xx === -1 ? status.approved : status.wait;
            obj.entity_name = 'weeklyMachine';
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
    }
    handleChange(e, i) {
        let tableData = this.state.tableData;
        tableData[i][e.target.name] = e.target.value;
        this.setState({ tableData });
    }
    selectChange2(name, value, i) {
        let tableData = this.state.tableData;
        tableData[i][name] = value;
        this.setState({ tableData });
    }
    selectChange(name, values) {
        if (name === 'contract_id') {
            let pervItems = this.state.rows.filter(a => a.contract_id === values);
            if (pervItems[0]) {
                let prevPeriod = this.state.periods.find(a => a.key === pervItems[0].period_id);
                let periods = this.state.periods.filter(a => a.end_date > prevPeriod.end_date)
                let period_id = periods[periods.length - 1].key;
                let prev_parent_id = pervItems[0].id;
                this.setState({ contract_id: values, period_id, prev_parent_id });
            }
            else
                this.setState({ contract_id: values });
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
    new2ClickHandle() {
       let tableData=this.state.tableData;
       tableData.push({active:0,deactive:0});
        this.setState({ tableData});
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
                                                <label htmlFor="contract_id" className=""> پیمان</label>
                                                {this.state.contract_id && <label className="form-control">{this.state.contracts.find(a => a.key === this.state.contract_id).label}</label>}
                                                {!this.state.contract_id &&
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.contracts}
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
                                    <hr />
                                    <div className={this.state.showTable ? 'row' : 'hidden'}>
                                        <div className='col'>
                                            <table className='table table-striped table-bordered' style={{ width: '80%' }}>
                                                <thead>

                                                    <tr>
                                                        <th>ردیف</th>
                                                        <th>نوع ماشین آلات</th>
                                                        <th>فعال</th>
                                                        <th>غیرفعال</th>
                                                        <th>موجود</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.tableData.map((item, i) => {
                                                        return <tr key={i}>
                                                            <td><label className='tableSpan'>{i + 1}</label></td>
                                                            <td style={{ width: '200px' }}>
                                                                <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.machineTypes}
                                                                    value={item.machine_type_id} onSelect={(values) => this.selectChange2("machine_type_id", values, i)} /></td>

                                                            <td style={{ width: '150px' }}><input name="active" className="form-control" onChange={(e) => this.handleChange(e, i)}
                                                                value={item.active} type='number' disabled={this.state.status === 'display'} /></td>
                                                            <td style={{ width: '150px' }}><input name="deactive" className="form-control" onChange={(e) => this.handleChange(e, i)}
                                                                value={item.deactive} type='number' disabled={this.state.status === 'display'} /></td>
                                                            <td><label className='tableSpan'>{parseInt(item.active) + parseInt(item.deactive)}</label></td>

                                                        </tr>
                                                    })}

                                                </tbody>
                                            </table>
                                            {this.state.status !== 'display' && <input type="button" className="btn btn-outline-primary" style={{ margin: "10px" }} onClick={this.new2ClickHandle} value="ردیف جدید" />}
                                            {this.state.status !== 'display' && <input type="button" className="btn btn-primary" style={{ margin: "10px" }} onClick={this.saveBtnClick} value="ذخیره" />}
                                            <input type="button" className="btn btn-outline-primary" style={{ margin: "10px" }} value="بستن" onClick={this.cancelBtnClick} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        {this.state.status === 'display' && <Approve item={this.state.obj} entityName='weeklyWeather' onEnd={this.cancelBtnClick}></Approve>}
                        {this.state.status === 'display' && <History item={this.state.obj} entityName='weeklyWeather'></History>}
                    </div>
                </div>
            )
        }
    }

}
export default WeeklyMachine;