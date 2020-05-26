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
            companies: [], projects: [], users: [],
            isFetching: true, obj: { ...emptyItem }, showPanel: false, status: '',
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
        this.deleteFile = this.deleteFile.bind(this);
    }

    scrollToFormRef = () => window.scrollTo({ top: this.formRef.offsetTop, behavior: 'smooth' })
    scrollToGridRef = () => window.scrollTo({ top: 0, behavior: 'smooth', })

    fetchData() {
        Promise.all([getAllItem(storeIndex), getAllItem('BaseInfo'), getAllItem('company'),
        getAllItem('project'), getAllItem('user')]).then((response) => {
            let contractTypes = response[1].data.filter(a => a.groupid === 8).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let companies = response[2].data.map(a => { return { key: a.id, label: a.title, value: a.id } });
            let projects = response[3].data.map(a => { return { key: a.id, label: a.title, value: a.id } });
            let users = response[4].data.map(a => { return { key: a.id, label: a.username, value: a.id ,roleId:a.role_id} });
            let data = response[0].data;
            data.forEach(e => {

                e.contract_date = e.contract_date ? moment(e.contract_date) : undefined;
                e.announcement_date = e.announcement_date ? moment(e.announcement_date) : undefined;
                e.land_delivery_date = e.land_delivery_date ? moment(e.land_delivery_date) : undefined;
                e.end_date = e.end_date ? moment(e.end_date) : undefined;

            });
            //console.log(data);
            this.setState({
                isFetching: false, rows: data, contractTypes: contractTypes,
                companies: companies, projects: projects, users: users
                , obj: { ...emptyItem }, showPanel: false, status: ''
            });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }

    saveBtnClick() {
        let obj = this.state.obj;
       // debugger;
        obj.contract_date = obj.contract_date ? obj.contract_date.format() : '';
        obj.announcement_date = obj.announcement_date ? obj.announcement_date.format() : '';
        obj.land_delivery_date = obj.land_delivery_date ? obj.land_delivery_date.format() : '';
        obj.end_date = obj.end_date ? obj.end_date.format() : '';

        var formData = new FormData();

        if (obj.f_file_delivery) formData.append("file_delivery", obj.f_file_delivery);
        if (obj.f_file_announcement) formData.append("file_announcement", obj.f_file_announcement);
        if (obj.f_file_agreement) formData.append("file_agreement", obj.f_file_agreement);

        formData.append("data", JSON.stringify(obj));

        if (this.state.status === 'new')
            saveItem(formData, storeIndex, 'multipart/form-data', obj.id).then((response) => {

                if (response.data.type !== "Error") {
                    message.success(successMessage, successDuration);
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
    dateChange(name, value) {
        let ob = this.state.obj;
        ob[name] = value;
        this.setState({ obj: ob });
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
    deleteFile(name) {
        let ob = this.state.obj;
        ob[name] = false;
        this.setState({ obj: ob });
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
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.projects}
                                                        value={this.state.obj.project_id} onSelect={(values) => this.selectChange("project_id", values)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="company_id" className="">شرکت</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.companies}
                                                        value={this.state.obj.company_id} onSelect={(values) => this.selectChange("company_id", values)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="colleague1_id" className="">شرکت همکار1</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.companies}
                                                        value={this.state.obj.colleague1_id} onSelect={(values) => this.selectChange("colleague1_id", values)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="colleague2_id" className="">شرکت همکار2</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.companies}
                                                        value={this.state.obj.colleague2_id} onSelect={(values) => this.selectChange("colleague2_id", values)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="contract_type_id" className="">نوع قرارداد/پیمان</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.contractTypes}
                                                        value={this.state.obj.contract_type_id} onSelect={(values) => this.selectChange("contract_type_id", values)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="contract_date" className="">تاریخ قرارداد/پیمان </label>

                                                    <DatePicker onChange={value => this.dateChange('contract_date', value)}
                                                        value={this.state.obj.contract_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="announcement_date" className="">تاریخ ابلاغ قرارداد/پیمان</label>{this.state.obj.announcement_date_v}
                                                    <DatePicker onChange={value => this.dateChange('announcement_date', value)}
                                                        value={this.state.obj.announcement_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="land_delivery_date" className="">تاریخ تحویل زمین</label>
                                                    <DatePicker onChange={value => this.dateChange('land_delivery_date', value)}  {...datePickerDefaultProp}
                                                        value={this.state.obj.land_delivery_date} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="end_date" className="">تاریخ اولیه اتمام </label>
                                                    <DatePicker onChange={value => this.dateChange('end_date', value)}  {...datePickerDefaultProp}
                                                        value={this.state.obj.end_date} disabled={this.state.status === 'display'} />
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
                                                        value={parseFloat(this.state.obj.coefficient).toFixed(2)} disabled={true} />
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
                                                    {this.state.status !== 'display' && <input name="f_file_agreement" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_agreement && <div><a target="_blank" href={this.state.obj.file_agreement}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_agreement')}></i>}</div>}
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_announcement" className="">صورتجلسه ابلاغ</label>
                                                    {this.state.status !== 'display' && <input name="f_file_announcement" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_announcement && <div><a target="_blank" href={this.state.obj.file_announcement}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_announcement')}></i>}</div>}

                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_delivery" className="">صورتجلسه تحویل زمین</label>
                                                    {this.state.status !== 'display' && <input name="f_file_delivery" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_delivery && <div><a target="_blank" href={this.state.obj.file_delivery}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_delivery')}></i>}</div>}

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="contractor_user_id" className="">کاربر پیمانکار </label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.users.filter(a => a.roleId===1)}
                                                        value={this.state.obj.contractor_user_id} onSelect={(values) => this.selectChange("contractor_user_id", values)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="engineer_user_id" className="">کاربر مشاور  </label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.users.filter(a => a.roleId===2)}
                                                        value={this.state.obj.engineer_user_id} onSelect={(values) => this.selectChange("engineer_user_id", values)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="manager_user_id" className="">کاربر مدیر استان </label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.users.filter(a => a.roleId===3)}
                                                        value={this.state.obj.manager_user_id} onSelect={(values) => this.selectChange("manager_user_id", values)}
                                                    />
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