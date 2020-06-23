import React, { Component } from 'react';
import { saveItem, getAllItem, removeItem, updateItem } from '../../../api/index';
import { message, Select } from 'antd';
import moment from 'moment-jalaali';
import NumberFormat from 'react-number-format';

import DatePicker from 'react-datepicker2';
import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage, errorDuration, selectDefaultProp, datePickerDefaultProp, numberDefaultProp } from '../../../components/statics'

class Town extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, rows: [], contractTypes: [],
            companies: [], projects: [], errors: {},
            isFetching: true, obj: { ...emptyItem }, showPanel: false, status: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.fileChange = this.fileChange.bind(this);
        this.numberChange = this.numberChange.bind(this);
        this.newClickHandle = this.newClickHandle.bind(this);
        this.editClickHandle = this.editClickHandle.bind(this);
        this.deleteClickHandle = this.deleteClickHandle.bind(this);
        this.displayClickHandle = this.displayClickHandle.bind(this);
        this.saveBtnClick = this.saveBtnClick.bind(this);
        this.cancelBtnClick = this.cancelBtnClick.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
    }

    scrollToFormRef = () => window.scrollTo({ top: this.formRef.offsetTop, behavior: 'smooth' })
    //  scrollToFormRef = () => window.scrollTo({ top: 700, behavior: 'smooth' })
    scrollToGridRef = () => window.scrollTo({ top: 0, behavior: 'smooth', })

    fetchData() {
        Promise.all([getAllItem(storeIndex), getAllItem('BaseInfo/vw'), getAllItem('company/vw'),
        getAllItem('town/vw')]).then((response) => {
            let contractTypes = response[1].data.filter(a => a.groupid === 8).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let companies = response[2].data.map(a => { return { key: a.id, label: a.title, value: a.id } });
            let towns = response[3].data.map(a => { return { key: a.id, label: a.title, value: a.id } });
         
            let operationType = response[1].data.filter(a => a.groupid === 12).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let data = response[0].data;
            data.forEach(e => {

                e.contract_date = e.contract_date ? moment(e.contract_date) : undefined;
                e.announcement_date = e.announcement_date ? moment(e.announcement_date) : undefined;
                e.land_delivery_date = e.land_delivery_date ? moment(e.land_delivery_date) : undefined;
                e.end_date = e.end_date ? moment(e.end_date) : undefined;

            });
            //console.log(data);
            this.setState({
                isFetching: false, rows: data, contractTypes,
                companies, towns, operationType,
                obj: { ...emptyItem }, showPanel: false, status: ''
            });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }

    saveBtnClick() {
        let obj = this.state.obj;

        let errors = this.state.errors;

        errors.title = obj.title ? false : true;
        /*errors.town_id = obj.town_id ? false : true;*/
        errors.duration = obj.duration ? false : true;
        errors.announcement_date = obj.announcement_date ? false : true;
        errors.contract_date = obj.contract_date ? false : true;
        errors.contract_no = obj.contract_no ? false : true;
        errors.company_id = obj.company_id ? false : true;
        errors.initial_amount = obj.initial_amount ? false : true;


        if (Object.values(errors).filter(a => a).length > 0) {
            this.setState({ errors }, () => { this.scrollToFormRef(); });
            alert("لطفا موارد الزامی را وارد کنید");
        }
        else {
            obj['coefficient'] = obj.initial_amount / obj.client_initial_amount;
          
            obj.contract_date = obj.contract_date ? obj.contract_date.format() : '';
            obj.announcement_date = obj.announcement_date ? obj.announcement_date.format() : '';
            obj.land_delivery_date = obj.land_delivery_date ? obj.land_delivery_date.format() : '';
           // obj.end_date = obj.end_date ? obj.end_date.format() : '';
           obj['end_date']=moment(obj.announcement_date).add(obj.duration, 'days').format()
           
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

        // if (e.target.name === 'initial_amount' || e.target.name == 'client_initial_amount')
        //     if (ob.client_initial_amount)
        //         ob['coefficient'] = ob.initial_amount / ob.client_initial_amount;

        this.setState({ obj: ob });
    }
    dateChange(name, value) {
        let ob = this.state.obj;
        ob[name] = value;
        if (name === 'contract_date')
            ob.announcement_date = value;
        this.setState({ obj: ob });
    }
    numberChange(name, values) {
        const { formattedValue, value } = values;
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
                                            <div className="col-8">
                                                <div className="form-group">
                                                    <label htmlFor="title" className={this.state.errors.title ? "error-lable" : ''}>عنوان قرارداد</label>
                                                    <input name="title" className={this.state.errors.title ? "form-control error-control" : 'form-control'} onChange={this.handleChange}
                                                        value={this.state.obj.title} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="operation_type_id" className={this.state.errors.operation_type_id ? "error-lable" : ''}>  نوع عملیات</label>
                                                    <Select {...selectDefaultProp} options={this.state.operationType} disabled={this.state.status === 'display'}
                                                        className={this.state.errors.operation_type_id ? "form-control error-control" : 'form-control'}
                                                        mode="multiple" value={this.state.obj.operation_type_id} onChange={(values) => this.selectChange("operation_type_id", values)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
										
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="contract_no" className={this.state.errors.contract_no ? "error-lable" : ''}>شماره قرارداد</label>
                                                    <input name="contract_no" className="form-control" onChange={this.handleChange}
                                                        className={this.state.errors.contract_no ? "form-control error-control" : 'form-control'}
                                                        value={this.state.obj.contract_no} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="town_id" className={this.state.errors.town_id ? "error-lable" : ''}>نام شهرک</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.towns}
                                                        className={this.state.errors.town_id ? "form-control error-control" : 'form-control'}
                                                        mode="multiple" value={this.state.obj.town_id} onChange={(values) => this.selectChange("town_id", values)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="company_id" className={this.state.errors.company_id ? "error-lable" : ''}>شرکت</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.companies}
                                                        className={this.state.errors.company_id ? "form-control error-control" : 'form-control'}
                                                        value={this.state.obj.company_id} onSelect={(values) => this.selectChange("company_id", values)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="colleague1_id" className="">شرکت همکار1</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.companies}
                                                        value={this.state.obj.colleague1_id} onSelect={(values) => this.selectChange("colleague1_id", values)} />
                                                </div>
                                            </div>
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
                                                    <label htmlFor="contract_type_id" className="">نوع قرارداد</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.contractTypes}
                                                        value={this.state.obj.contract_type_id} onSelect={(values) => this.selectChange("contract_type_id", values)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">

                                                    < label htmlFor="contract_date" className={this.state.errors.contract_date ? "error-lable" : ''}>تاریخ قرارداد</label>

                                                    <DatePicker onChange={value => this.dateChange('contract_date', value)}
                                                        value={this.state.obj.contract_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp}
                                                        className={this.state.errors.contract_date ? "form-control error-control" : 'form-control'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="announcement_date" className={this.state.errors.announcement_date ? "error-lable" : ''}>تاریخ ابلاغ قرارداد</label>{this.state.obj.announcement_date_v}
                                                    <DatePicker onChange={value => this.dateChange('announcement_date', value)}
                                                        value={this.state.obj.announcement_date}

                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp}
                                                        className={this.state.errors.announcement_date ? "form-control error-control" : 'form-control'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="duration" className={this.state.errors.duration ? "error-lable" : ''}>مدت  (روز)</label>
                                                    <input name="duration" className="form-control" onChange={this.handleChange} type='number'
                                                        className={this.state.errors.duration ? "form-control error-control" : 'form-control'}
                                                        value={this.state.obj.duration} disabled={this.state.status === 'display'} />
                                                </div>

                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="end_date" className="">تاریخ اولیه اتمام </label>
                                                    <label className="form-control">{this.state.obj.announcement_date && this.state.obj.duration ? moment(this.state.obj.announcement_date).add(this.state.obj.duration, 'days').format('jYYYY/jMM/jDD') : ''}</label>
                                                    {/* <DatePicker onChange={value => this.dateChange('end_date', value)}  {...datePickerDefaultProp}
                                                        value={this.state.obj.end_date} disabled={this.state.status === 'display'} /> */}
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="initial_amount" className={this.state.errors.initial_amount ? "error-lable" : ''}>مبلغ اولیه  (ریال)</label>
                                                    {/* <input name="initial_amount" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.initial_amount} disabled={this.state.status === 'display'} /> */}
                                                    <NumberFormat onValueChange={(values) => this.numberChange("initial_amount", values)}
                                                        {...numberDefaultProp} disabled={this.state.status === 'display'} value={this.state.obj.initial_amount}
                                                        className={this.state.errors.initial_amount ? "form-control error-control" : 'form-control'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="client_initial_amount" className="">مبلغ برآورد اولیه کارفرما (ریال)</label>
                                                    {/* <input name="client_initial_amount" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.client_initial_amount} disabled={this.state.status === 'display'} /> */}
                                                    <NumberFormat onValueChange={(values) => this.numberChange("client_initial_amount", values)}
                                                        {...numberDefaultProp} disabled={this.state.status === 'display'} value={this.state.obj.client_initial_amount} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="coefficient" className="">ضریب </label>
                                                    <input name="coefficient" className="form-control" onChange={this.handleChange}
                                                        value={(parseFloat(this.state.obj.initial_amount) / parseFloat(this.state.obj.client_initial_amount)).toFixed(2)} disabled={true} />
                                                </div>
                                            </div>
											   
                                          
											  <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="study_surface" className={this.state.errors.study_surface ? "error-lable" : ''}>سطح مطالعات (قرارداد)</label>
                                                    {/* <input name="study_surface" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.study_surface} disabled={this.state.status === 'display'} /> */}
                                                    <NumberFormat onValueChange={(values) => this.numberChange("study_surface", values)}
                                                        {...numberDefaultProp} disabled={this.state.status === 'display'} value={this.state.obj.study_surface}
                                                        className={this.state.errors.study_surface ? "form-control error-control" : 'form-control'} />
                                                </div>
                                            </div>
										   <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="study_surface_final" className={this.state.errors.study_surface_final ? "error-lable" : ''}>سطح نهایی مطالعات</label>
                                                    {/* <input name="study_surface_final" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.study_surface_final} disabled={this.state.status === 'display'} /> */}
                                                    <NumberFormat onValueChange={(values) => this.numberChange("study_surface_final", values)}
                                                        {...numberDefaultProp} disabled={this.state.status === 'display'} value={this.state.obj.study_surface_final}
                                                        className={this.state.errors.study_surface_final ? "form-control error-control" : 'form-control'} />
                                                </div>
                                            </div>
                                           
                                        </div>
                                      
                                        <div className="row">
                                      
							           <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="mapping_surface" className={this.state.errors.mapping_surface ? "error-lable" : ''}>سطح نقشه برداری (قرارداد)</label>
                                                    {/* <input name="mapping_surface" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.mapping_surface} disabled={this.state.status === 'display'} /> */}
                                                    <NumberFormat onValueChange={(values) => this.numberChange("mapping_surface", values)}
                                                        {...numberDefaultProp} disabled={this.state.status === 'display'} value={this.state.obj.mapping_surface}
                                                        className={this.state.errors.mapping_surface ? "form-control error-control" : 'form-control'} />
                                                </div>
												 </div>
										<div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="mapping_surface_final" className={this.state.errors.mapping_surface_final ? "error-lable" : ''}>سطح نهایی نقشه برداری</label>
                                                    {/* <input name="mapping_surface_final" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.mapping_surface_final} disabled={this.state.status === 'display'} /> */}
                                                    <NumberFormat onValueChange={(values) => this.numberChange("mapping_surface_final", values)}
                                                        {...numberDefaultProp} disabled={this.state.status === 'display'} value={this.state.obj.mapping_surface_final}
                                                        className={this.state.errors.mapping_surface_final ? "form-control error-control" : 'form-control'} />
                                                </div>
                                            </div>
											<div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="project_manager_name" className="">مدیر پروژه</label>
                                                    <input name="project_manager_name" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.project_manager_name} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
											</div>
											 <div className="row">
											 <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="project_manager_contacts" className="">تلفن همراه مدیر پروژه</label>
                                                    <input name="project_manager_contacts" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.project_manager_contacts} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="fax" className="">فکس</label>
                                                    <input name="fax" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.fax} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
											   <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="email" className="">ایمیل</label>
                                                    <input name="email" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.email} disabled={this.state.status === 'display'} />
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
                                                    <label htmlFor="f_file_announcement" className="">نامه ابلاغ</label>
                                                    {this.state.status !== 'display' && <input name="f_file_announcement" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_announcement && <div><a target="_blank" href={this.state.obj.file_announcement}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_announcement')}></i>}</div>}

                                                </div>
                                            </div> 
                                      
                                            </div>
                                            <div className="row">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label htmlFor="description" className="">توضیحات</label>
                                                    <textarea name="description" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.description} disabled={this.state.status === 'display'} row="2" />
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