import React, { Component } from 'react';
import { saveItem, getAllItem, removeItem, updateItem } from '../../../api/index';
import { message, Select } from 'antd';
import moment from 'moment-jalaali';


import DatePicker from 'react-datepicker2';
import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage, errorDuration, selectDefaultProp, datePickerDefaultProp } from '../../../components/statics'

class Town extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, rows: [], contractTypes: [],
            companies: [], projects: [],
            isFetching: true, obj: emptyItem, showPanel: false, status: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.fileChange = this.fileChange.bind(this);
        this.newClickHandle = this.newClickHandle.bind(this);
        this.editClickHandle = this.editClickHandle.bind(this);
        this.deleteClickHandle = this.deleteClickHandle.bind(this);
        this.displayClickHandle = this.displayClickHandle.bind(this);
        this.saveBtnClick = this.saveBtnClick.bind(this);
        this.cancelBtnClick = this.cancelBtnClick.bind(this);
    }

    scrollToFormRef = () => window.scrollTo({ top: this.formRef.offsetTop, behavior: 'smooth' })
    scrollToGridRef = () => window.scrollTo({ top: 0, behavior: 'smooth', })

    fetchData() {
        Promise.all([getAllItem(storeIndex), getAllItem('BaseInfo'), getAllItem('company'), getAllItem('project')]).then((response) => {
            let contractTypes = response[1].data.filter(a => a.groupid === 8).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let companies = response[2].data.map(a => { return { key: a.id, label: a.title, value: a.id } });
            let projects = response[3].data.map(a => { return { key: a.id, label: a.title, value: a.id } });
            let data = response[0].data;
            data.forEach(e => {
                let contract_date=e.contract_date;
                let announcement_date=e.announcement_date;
                let land_delivery_date=e.land_delivery_date;
                let end_date=e.end_date;

                e.contract_date_v = moment(contract_date);
                e.announcement_date_v = moment(announcement_date);
                e.land_delivery_date_v = moment(land_delivery_date);
                e.end_date_v = moment(end_date);

                e.contract_date = moment(contract_date).format('jYYYY/jMM/jDD');
                e.announcement_date = moment(announcement_date).format('jYYYY/jMM/jDD');
                e.land_delivery_date =moment(land_delivery_date).format('jYYYY/jMM/jDD');
                e.end_date =  moment(end_date).format('jYYYY/jMM/jDD');


               

            });
            
            this.setState({
                isFetching: false, rows: data, contractTypes: contractTypes,
                companies: companies, projects: projects
            });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
       
    //    let m=moment('2020-04-19T19:30:00.000Z');
    //     console.log(m.format('YYYY MM DD'))
    //     console.log(m.format('jYYYY/jMM/jDD'))
    }

    async saveBtnClick() {
        let obj = this.state.obj;
        delete obj.contract_date_v;
        delete obj.announcement_date_v;
        delete obj.land_delivery_date_v;
        delete obj.end_date_v;
        var formData = new FormData();

        if (obj.f_file_delivery)
            formData.append("file_delivery", obj.f_file_delivery);
        if (obj.f_file_announcement)
            formData.append("file_announcement", obj.f_file_announcement);
        if (obj.f_file_agreement)
            formData.append("file_agreement", obj.f_file_agreement);

        formData.append("data", JSON.stringify(obj));

        if (this.state.status === 'new')
            saveItem(formData, storeIndex, 'multipart/form-data').then((response) => {
                debugger;
                if (response.data.type !== "Error") {
                    console.log(response);
                    message.success(successMessage, successDuration);
                    this.setState({ obj: emptyItem, isEdit: false, showPanel: false });
                    this.fetchData();

                }
                else {
                    message.error(errorMessage, errorDuration);
                    console.log('error : ', response);
                }
            }).catch((error) => { console.log(error); message.error(errorMessage, errorDuration); });
        else {
            updateItem(obj, storeIndex).then((response) => {
                if (response.statusText === "OK") {
                    message.success(successMessage, successDuration);
                    this.setState({ obj: emptyItem, isEdit: false, showPanel: false });
                    this.fetchData();
                }
                else {
                    message.error(errorMessage, errorDuration);
                    console.log('error : ', response);
                }
            }).catch((error) => { console.log(error); message.error(errorMessage, errorDuration); });
        }
    }
    fileChange(e, name) {
        let ob = this.state.obj;
        if (!name)
            ob[e.target.name] = e.target.files[0];
        else
            ob[name] = e;
        this.setState({ obj: ob });
    }
    handleChange(e, name) {
        let ob = this.state.obj;
        if (!name)
            ob[e.target.name] = e.target.value;
        else
            ob[name] = e;

        if (e.target.name === 'initial_amount' || e.target.name == 'client_initial_amount')
            if (ob.client_initial_amount)
                ob['coefficient'] = ob.initial_amount / ob.client_initial_amount;

        this.setState({ obj: ob });
    }
    dateChange(name, dateString, m) {
        let ob = this.state.obj;
//debugger;
        // ob[name] = moment(dateString, 'jYYYY/jMM/jDD');
        // ob[name + '_v'] = dateString;
        //  ob[name] = m.format('jYYYY/jMM/jDD');
       // ob[name + '_v'] = m;
       // this.setState({ obj: ob });
    }
    selectChange(name, values) {
        let ob = this.state.obj;
        ob[name] = values;
        this.setState({ obj: ob });
    }
    editClickHandle(item) {
        this.setState({ obj: item, status: 'edit', showPanel: true }, () => { this.scrollToFormRef(); });
    }
    displayClickHandle(item) {
        console.log(item);
        this.setState({ obj: item, status: 'display', showPanel: true }, () => { this.scrollToFormRef() });
    }
    deleteClickHandle(item) {
        console.log(item)
        removeItem(item.id, storeIndex).then((response) => {
            if (response.statusText === "OK") {
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
        this.setState({ obj: emptyItem, status: '', showPanel: false }, () => { this.scrollToGridRef(); });
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
                                    <form>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="title" className="">عنوان اختصاری قرارداد/پیمان</label>
                                                    <input name="title" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.title} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="full_title" className="">عنوان قرارداد/پیمان</label>
                                                    <input name="full_title" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.full_title} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="contract_no" className="">شماره قرارداد/پیمان</label>
                                                    <input name="contract_no" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.contract_no} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="project_id" className="">نام پروژه</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.project}
                                                        value={this.state.obj.project_id} onSelect={(values) => this.selectChange("project_id", values)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="company_id" className="">شرکت</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.company}
                                                        value={this.state.obj.company_id} onSelect={(values) => this.selectChange("company_id", values)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="company_id" className="">شرکت همکار1</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.company}
                                                        value={this.state.obj.company_id} onSelect={(values) => this.selectChange("company_id", values)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="company_id" className="">شرکت همکار2</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.company}
                                                        value={this.state.obj.company_id} onSelect={(values) => this.selectChange("company_id", values)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="contract_id" className="">نوع قرارداد/پیمان</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.contract}
                                                        value={this.state.obj.contract_id} onSelect={(values) => this.selectChange("contract_id", values)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                             
                                                    <label htmlFor="contract_date" className="">تاریخ قرارداد/پیمان </label>
                                                 
                                                    <DatePicker onChange={(ts, d) => this.dateChange('contract_date_v', d, ts)} value={this.state.obj.contract_date_v}
                                                    disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="announcement_date" className="">تاریخ ابلاغ قرارداد/پیمان</label>{this.state.obj.announcement_date_v}
                                                    <DatePicker onChange={(ts, d) => this.dateChange('announcement_date_v', d, ts)} value={this.state.obj.announcement_date_v}
                                                    
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="land_delivery_date" className="">تاریخ تحویل زمین</label>
                                                    <DatePicker onChange={(ts, d) => this.dateChange('land_delivery_date', d, ts)}  {...datePickerDefaultProp}
                                                        value={this.state.obj.land_delivery_date_v} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="end_date" className="">تاریخ اولیه اتمام </label>
                                                    <DatePicker onChange={(ts, d) => this.dateChange('end_date', d, ts)}  {...datePickerDefaultProp}
                                                        value={this.state.obj.end_date_v} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="duration" className="">مدت  (روز)</label>
                                                    <input name="duration" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.duration} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="initial_amount" className="">مبلغ اولیه  (ریال)</label>
                                                    <input name="initial_amount" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.initial_amount} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="client_initial_amount" className="">مبلغ برآورد اولیه کارفرما (ریال)</label>
                                                    <input name="client_initial_amount" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.client_initial_amount} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="coefficient" className="">ضریب </label>
                                                    <input name="coefficient" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.coefficient} disabled={true} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="project_manager_name" className="">مدیر پروژه</label>
                                                    <input name="project_manager_name" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.project_manager_name} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="project_manager_contacts" className="">تلفن همراه مدیر پروژه</label>
                                                    <input name="project_manager_contacts" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.project_manager_contacts} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_agreement" className="">موافقتنامه </label>
                                                    <input name="f_file_agreement" className="form-control" onChange={this.fileChange} type='file'
                                                        disabled={this.state.status === 'display'} />

                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_announcement" className="">صورتجلسه ابلاغ</label>
                                                    <input name="f_file_announcement" className="form-control" onChange={this.fileChange} type='file'
                                                        disabled={this.state.status === 'display'} />

                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_delivery" className="">صورتجلسه تحویل زمین</label>
                                                    <input name="f_file_delivery" className="form-control" onChange={this.fileChange} type='file'
                                                        disabled={this.state.status === 'display'} />

                                                </div>
                                            </div>
                                        </div>

                                        {this.state.status !== 'display' && <input type="button" className="btn btn-primary" style={{ margin: "10px" }} onClick={this.saveBtnClick} value="ذخیره" />}
                                        <input type="button" className="btn btn-outline-primary" style={{ margin: "10px" }} value="بستن" onClick={this.cancelBtnClick} />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )
        }
    }

}
export default Town;