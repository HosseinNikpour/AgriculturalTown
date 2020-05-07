import React, { Component } from 'react';
import { saveItem, getAllItem, removeItem, updateItem, getItem } from '../../../api/index';
import { message, Select } from 'antd';
import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage, errorDuration, selectDefaultProp } from '../../../components/statics'

class WeeklyOperation extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, rows: [], periods: [], contracts: [], contract_id: '', period_id: '',
            tableData: [], isFetching: true, obj: { ...emptyItem }, showPanel: false, status: '',
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

        Promise.all([getAllItem(storeIndex), getAllItem('contract'), getAllItem('period')]).then((response) => {
            let contracts = response[1].data.map(a => { return { key: a.id, label: a.title, value: a.id, project: a.project } });
            let periods = response[2].data.map(a => { return { key: a.id, label: a.title, value: a.id } });
            this.setState({
                isFetching: false, rows: response[0].data, contracts, periods,
                status: '', showPanel: false
            });
        }).catch((error) => console.log(error))
    }
    fetchDetailData() {
        this.setState({ isFetching: true });
        let currPeriod=this.state.periods.find(a=>a.id==this.state.period_id);
        let prevPriod=this.state.periods.find(a=>a.end_date<currPeriod.end_date);
        let pervItem=this.state.rows.find(a=>a.contract_id==this.state.contract_id&&a.period_id==prevPriod.id);

        Promise.all([getItem(this.state.contract_id, 'wbs'),getItem(pervItem.id, 'WeeklyOperation')]).then((response) => {
            let wbs = response[0].data;
            let prev = response[1].data;
            wbs.forEach(e => {
               let p=prev.find(a=>a.operation==e.operation&&a.unit==e.unit)
                tableData.push({...e,...p})
            });
            let tableData = wbs;
            this.setState({ tableData, showTable: true, isFetching: false });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }

    saveBtnClick() {

        let obj = this.state.obj;

        let formData = new FormData();
        if (obj.f_file_dxf)
            formData.append("file_dxf", obj.f_file_dxf);
        if (obj.f_file_kmz)
            formData.append("file_kmz", obj.f_file_kmz);
        formData.append("data", JSON.stringify(obj));

        if (this.state.status === 'new')
            saveItem(formData, storeIndex, 'multipart/form-data').then((response) => {
                // debugger;
                if (response.data.type !== "Error") {
                    //      console.log(response);
                    message.success(successMessage, successDuration);

                    //  this.setState({ obj: emptyItem, isEdit: false, showPanel: false });
                    this.fetchData();
                }
                else {
                    message.error(errorMessage, errorDuration);
                    console.log('error : ', response);
                }
            }).catch((error) => { console.log(error); message.error(errorMessage, errorDuration); });
        else {


            updateItem(formData, storeIndex, 'multipart/form-data').then((response) => {
                if (response.data.type !== "Error") {
                    message.success(successMessage, successDuration);
                    // this.setState({ obj: emptyItem, isEdit: false, showPanel: false });
                    this.fetchData();
                }
                else {
                    message.error(errorMessage, errorDuration);
                    console.log('error : ', response);
                }
            }).catch((error) => { console.log(error); message.error(errorMessage, errorDuration); });
        }
    }
    handleChange(e, name) {
        let ob = this.state.obj;
        if (!name)
            ob[e.target.name] = e.target.value;
        else
            ob[name] = e;
        this.setState({ obj: ob });
    }
    selectChange(name, values) {
        let obj = this.state[name];
        obj = values;

        this.setState({ name });
    }
    editClickHandle(item) {
        this.setState({ obj: item, status: 'edit', showPanel: true }, () => { this.scrollToFormRef(); });
    }
    displayClickHandle(item) {
        this.setState({ obj: item, status: 'display', showPanel: true }, () => { this.scrollToFormRef() });
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
        this.setState({ status: 'new', showPanel: true }, () => { this.scrollToFormRef(); });
    }
    cancelBtnClick() {
        this.setState({ obj: { ...emptyItem }, status: '', showPanel: false }, () => { this.scrollToGridRef(); });
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
                                                <label htmlFor="contract_id" className=""> پیمان</label>
                                                <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.contracts}
                                                    value={this.state.contract_id} onSelect={(values) => this.setState({ contract_id: values })} />
                                            </div>
                                        </div>

                                        <div className="col-5">
                                            <div className="form-group">
                                                <label htmlFor="period_id" className="">دوره</label>
                                                <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.periods}
                                                    value={this.state.period_id} onSelect={(values) => this.setState({ period_id: values })} />
                                            </div>
                                        </div>
                                        <div className="col-1">
                                            <div className="form-group">
                                                <button className='btn btn-primary' onClick={this.fetchDetailData}>مشاهده</button>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className={this.state.showTable ? 'row' : 'hidden'}>
                                        <div className='col'>
                                            <table className='table table-striped table-bordered'>
                                                <thead>
                                                    <tr>
                                                        <th colSpan={4}></th>
                                                        <th colSpan={2}>جمعی تا در دوره قبل</th>
                                                        <th colSpan={2}>مقدار دوره</th>
                                                        <th colSpan={2}>مقدار تجمعی</th>
                                                    </tr>
                                                    <tr>
                                                        <th>ردیف</th>
                                                        <th>شرح فعالیت</th>
                                                        <th>واحد</th>
                                                        <th>مقدار کل</th>
                                                        <th>پیش بینی</th>
                                                        <th>عملکرد</th>
                                                        <th>پیش بینی</th>
                                                        <th>عملکرد</th>
                                                        <th>پیش بینی</th>
                                                        <th>عملکرد</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.tableData.map((item, i) => {
                                                        return <tr key={i}>
                                                            <td><label className='tableSpan'>{i + 1}</label></td>
                                                            <td><label className='tableSpan'>{item.operation}</label></td>
                                                            <td><label className='tableSpan'>{item.unit}</label></td>
                                                            <td><label className='tableSpan'>{item.value_change}</label></td>
                                                            <td><label className='tableSpan'>{i + 1}</label></td>
                                                            <td><label className='tableSpan'>{i + 1}</label></td>
                                                            <td><label className='tableSpan'>{i + 1}</label></td>
                                                            <td><label className='tableSpan'>{i + 1}</label></td>
                                                            <td><label className='tableSpan'>{i + 1}</label></td>
                                                            <td><label className='tableSpan'>{i + 1}</label></td>
                                                        </tr>
                                                    })}

                                                </tbody>
                                            </table>
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
export default WeeklyOperation;