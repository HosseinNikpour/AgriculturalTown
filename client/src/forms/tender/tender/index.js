import React, { Component } from 'react';
import { saveItem, getAllItem, removeItem, updateItem, getItem } from '../../../api/index';
import { message, Select } from 'antd';
import moment from 'moment-jalaali';

import NumberFormat from 'react-number-format';
import DatePicker from 'react-datepicker2';
import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage,errorMessageDuplicate, errorDuration, selectDefaultProp, datePickerDefaultProp, numberDefaultProp } from '../../../components/statics'

class Tender extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();                   

        this.state = {
            columns: columns, rows: [], contracts: [], town: [], group: [], Typetender: [], ServiceType: [],
            operation_type: [], DocumentType: [], ModifierType: [], CommissionResult: [], call_method: [], credit_type: [],invite_method: [], errors: {},
            isFetching: true, obj: { ...emptyItem }, showPanel: false, status: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.fileChange = this.fileChange.bind(this);
        this.newClickHandle = this.newClickHandle.bind(this);
        this.numberChange = this.numberChange.bind(this);
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
        Promise.all([getAllItem(storeIndex), getAllItem('contract/vw'), getAllItem('BaseInfo/vw'), getAllItem('town/vw')
        , getItem("tender", 'PermissionStructure')]).then((response) => {
            let contracts = response[1].data.map(a => { return { key: a.id, label: a.contract_no + ' - ' + a.company, value: a.id, title: a.title } });
            let town = response[3].data.map(a => { return { key: a.id, label: a.title, value: a.id } });
            let group = response[2].data.filter(a => a.groupid === 24).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let Typetender = response[2].data.filter(a => a.groupid === 25).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let ServiceType = response[2].data.filter(a => a.groupid === 26).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let operation_type = response[2].data.filter(a => a.groupid === 19).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let DocumentType = response[2].data.filter(a => a.groupid === 27).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let ModifierType = response[2].data.filter(a => a.groupid === 28).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let CommissionResult = response[2].data.filter(a => a.groupid === 29).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let call_method = response[2].data.filter(a => a.groupid === 35).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let invite_method = response[2].data.filter(a => a.groupid === 36).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let credit_type = response[2].data.filter(a => a.groupid === 16).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let data = response[0].data;

            

            let roleId = JSON.parse(localStorage.getItem('user')).role_id;
            let canAdd = response[4].data[0].item_creator_id === roleId || roleId ===11 ? true : false;
            let canEdit = response[4].data[0].item_editor_id.indexOf(roleId) > -1 || roleId === 11 ? true : false;
            let canRead = response[4].data[0].item_viewer_id.indexOf(roleId) > -1 ||  response[4].data[0].item_approver_id.indexOf(roleId) > -1 ? true : false;

           
            town.unshift({ key: null, label: '-------', value: null });
            group.unshift({ key: null, label: '-------', value: null });
            Typetender.unshift({ key: null, label: '-------', value: null });
            ServiceType.unshift({ key: null, label: '-------', value: null });
            operation_type.unshift({ key: null, label: '-------', value: null });
            DocumentType.unshift({ key: null, label: '-------', value: null });
            ModifierType.unshift({ key: null, label: '-------', value: null });
            CommissionResult.unshift({ key: null, label: '-------', value: null });
            call_method.unshift({ key: null, label: '-------', value: null });
            invite_method.unshift({ key: null, label: '-------', value: null });
            credit_type.unshift({ key: null, label: '-------', value: null });
            
          

            data.forEach(e => {
                // e.publish_date = e.publish_date ? moment(e.publish_date) : undefined;
                // e.get_doc_date = e.get_doc_date ? moment(e.get_doc_date) : undefined;
                //  e.upload_date = e.upload_date ? moment(e.upload_date) : undefined;
                e.commission_date = e.commission_date ? moment(e.commission_date) : undefined;
                // e.open_packets_date = e.open_packets_date ? moment(e.open_packets_date) : undefined;
                // e.say_to_winner_date = e.say_to_winner_date ? moment(e.say_to_winner_date) : undefined;
                //  e.contract_date = e.contract_date ? moment(e.contract_date) : undefined;
                e.send_document_date = e.send_document_date ? moment(e.send_document_date) : undefined;
                e.signification_date = e.signification_date ? moment(e.signification_date) : undefined;
                e.winner_letter_date = e.winner_letter_date ? moment(e.winner_letter_date) : undefined; 
                e.invite_date = e.invite_date ? moment(e.invite_date) : undefined;


            });

            this.setState({
                canAdd, canEdit,canRead,
                isFetching: false, rows: data, contracts, town, group, Typetender, ServiceType, DocumentType, operation_type, ModifierType, CommissionResult, call_method, invite_method,credit_type,
                obj: { ...emptyItem }, showPanel: false, status: '', contractTitle: '',
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
        errors.town_id = obj.town_id ? false : true;
        errors.service_type_id = obj.service_type_id ? false : true;
        errors.operation_type_id = obj.operation_type_id ? false : true;


        if (Object.values(errors).filter(a => a).length > 0) {
            this.setState({ errors }, () => { this.scrollToFormRef(); });
            alert("لطفا موارد الزامی را وارد کنید");
        }
        else {
            // obj.publish_date = obj.publish_date ? obj.publish_date.format() : '';
            // obj.get_doc_date = obj.get_doc_date ? obj.get_doc_date.format() : '';
            // obj.upload_date = obj.upload_date ? obj.upload_date.format() : '';
            obj.commission_date = obj.commission_date ? obj.commission_date.format() : '';
            // obj.open_packets_date = obj.open_packets_date ? obj.open_packets_date.format() : '';
            // obj.say_to_winner_date = obj.say_to_winner_date ? obj.say_to_winner_date.format() : '';
            // obj.contract_date = obj.contract_date ? obj.contract_date.format() : '';
            obj.invite_date = obj.invite_date ? obj.invite_date.format() : '';
            obj.send_document_date = obj.send_document_date ? obj.send_document_date.format() : '';
            obj.signification_date = obj.signification_date ? obj.signification_date.format() : '';
            obj.winner_letter_date = obj.winner_letter_date ? obj.winner_letter_date.format() : '';
            
            var formData = new FormData();


            if (obj.f_file_record)
                formData.append("file_record", obj.f_file_record);

            if (obj.f_file_invite)
                formData.append("file_invite", obj.f_file_invite);

            formData.append("data", JSON.stringify(obj));

            if (this.state.status === 'new')
                saveItem(formData, storeIndex, 'multipart/form-data').then((response) => {
                    if (response.data.type !== "Error") {
                        message.success(successMessage, successDuration);
                        this.fetchData();
                    }
                    else {
                        if(response.data.message.indexOf('duplicate key value violates unique constraint')>-1)
                    message.error(errorMessageDuplicate, errorDuration);
                    else{
                        message.error(errorMessage, errorDuration);
                        console.log('error : ', response);
                    }
                    }
                }).catch((error) => { console.log(error); message.error(errorMessage, errorDuration); });
            else {
                updateItem(formData, storeIndex, 'multipart/form-data').then((response) => {
                    if (response.data.type !== "Error") {
                        message.success(successMessage, successDuration);
                        this.fetchData();
                    }
                    else {
                        if(response.data.message.indexOf('duplicate key value violates unique constraint')>-1)
                        message.error(errorMessageDuplicate, errorDuration);
                        else{
                            message.error(errorMessage, errorDuration);
                            console.log('error : ', response);
                        }
                    }
                }).catch((error) => { console.log(error); message.error(errorMessage, errorDuration); });
            }
        }
    }

    numberChange(name, values) {
        const { formattedValue, value } = values;
        let ob = this.state.obj;
        ob[name] = value;
        this.setState({ obj: ob });
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

        this.setState({ obj: ob });
    }
    dateChange(name, value) {
        let ob = this.state.obj;
        ob[name] = value;
        this.setState({ obj: ob });
    }
    selectChange(name, values) {
        let { obj, contractTitle, contracts, rows, invioces } = this.state;
        obj[name] = values;

        if (name === 'contract_id') {
            let cont = contracts.find(a => a.key === obj.contract_id);
            contractTitle = cont && cont.title ? cont.title : '';
            let prevCont = rows.filter(a => a.contract_id === obj.contract_id)
                .sort((a, b) => (a.invoice_no > b.invoice_no) ? 1 : ((b.invoice_no > a.invoice_no) ? -1 : 0))[0];
            obj.prev_id = prevCont ? prevCont.no : 0;
            obj.prev_price = prevCont ? prevCont.price : 0;

            let prevInvo = invioces.filter(a => a.contract_id === obj.contract_id)
                .sort((a, b) => (a.invoice_no > b.invoice_no) ? 1 : ((b.invoice_no > a.invoice_no) ? -1 : 0))[0];
            obj.prev_approve_id = prevInvo ? prevInvo.no : 0;
            obj.prev_approve_price = prevInvo ? prevInvo.manager_price : 0;

        }
        this.setState({ obj, contractTitle });
    }
    editClickHandle(item) {
        let cont = this.state.contracts.find(a => a.key == item.contract_id);
        let contractTitle = cont && cont.title ? cont.title : '';
        this.setState({ contractTitle, obj: item, status: 'edit', showPanel: true }, () => { this.scrollToFormRef(); });
    }
    displayClickHandle(item) {
        let cont = this.state.contracts.find(a => a.key == item.contract_id);
        let contractTitle = cont && cont.title ? cont.title : '';
        this.setState({ contractTitle, obj: item, status: 'display', showPanel: true }, () => { this.scrollToFormRef() });
    }
    deleteClickHandle(item) {
        //console.log(item)
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
        const { isFetching,canRead ,canEdit ,canAdd } = this.state;
        if (isFetching) {
            return (<Loading></Loading>)
        }
        else if(!canRead && !canEdit && !canAdd ){
            return (<div className='center'><p> شما به این صفحه دسترسی ندارید لطفا با مدیر سامانه تماس بگیرید</p></div> )
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
                                    <form>
                                        <div className="row">
                                            <div className="col-8">
                                                <div className="form-group">
                                                    <label htmlFor="title" className={this.state.errors.title ? "error-lable" : ''}>عنوان</label>
                                                    <input name="title" className="form-control" onChange={this.handleChange}
                                                        className={this.state.errors.title ? "form-control error-control" : 'form-control'}
                                                        value={this.state.obj.title} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="town_id" className={this.state.errors.town_id ? "error-lable" : ''}>شهرک</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.town}
                                                        className={this.state.errors.town_id ? "form-control error-control" : 'form-control'}
                                                        value={this.state.obj.town_id} onSelect={(values) => this.selectChange("town_id", values)}
                                                        />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="group_id" className="">گروه</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.group}
                                                        value={this.state.obj.group_id} onSelect={(values) => this.selectChange("group_id", values)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="type_id" className="">نوع مناقصه</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.Typetender}
                                                        value={this.state.obj.type_id} onSelect={(values) => this.selectChange("type_id", values)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="service_type_id" className={this.state.errors.service_type_id ? "error-lable" : ''}>نوع خدمات</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.ServiceType}
                                                        className={this.state.errors.service_type_id ? "form-control error-control" : 'form-control'}
                                                        value={this.state.obj.service_type_id} onSelect={(values) => this.selectChange("service_type_id", values)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="operation_type_id" className={this.state.errors.operation_type_id ? "error-lable" : ''}>نوع عملیات</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.operation_type}
                                                        className={this.state.errors.operation_type_id ? "form-control error-control" : 'form-control'}
                                                        value={this.state.obj.operation_type_id} onSelect={(values) => this.selectChange("operation_type_id", values)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="modifier_type_id" className="">مراحل بررسی</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.ModifierType}
                                                        value={this.state.obj.modifier_type_id} onSelect={(values) => this.selectChange("modifier_type_id", values)} />
                                                </div>
                                            </div>

                                            <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="commission_date" className="">تاریخ تشکیل کمیسیون</label>

                                                    <DatePicker onChange={value => this.dateChange('commission_date', value)}
                                                        value={this.state.obj.commission_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">

                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="commission_result_id" className="">نتیجه کمیسیون</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.CommissionResult}
                                                        value={this.state.obj.commission_result_id} onSelect={(values) => this.selectChange("commission_result_id", values)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="invite_method_id" className={this.state.errors.invite_method_id ? "error-lable" : ''}>روش دعوت</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.invite_method}
                                                        className={this.state.errors.invite_method_id ? "form-control error-control" : 'form-control'}
                                                        value={this.state.obj.invite_method_id} onSelect={(values) => this.selectChange("invite_method_id", values)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="call_method_id" className={this.state.errors.call_method_id ? "error-lable" : ''}>مرحله فراخوان</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.call_method}
                                                        className={this.state.errors.call_method_id ? "form-control error-control" : 'form-control'}
                                                        value={this.state.obj.call_method_id} onSelect={(values) => this.selectChange("call_method_id", values)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="recommender_count" className="">تعداد پیشنهاد دهنده</label>
                                                    <input name="recommender_count" className="form-control" onChange={this.handleChange} type="number"
                                                        value={this.state.obj.recommender_count} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="tender_no" className="">شماره مناقصه</label>
                                                    <input name="tender_no" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.tender_no} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="invite_no" className="">شماره دعوتنامه </label>
                                                    <input name="invite_no" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.invite_no} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="invite_date" className="">تاریخ دعوتنامه جلسه بازگشایی</label>

                                                    <DatePicker onChange={value => this.dateChange('invite_date', value)}
                                                        value={this.state.obj.invite_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="init_amount" className={this.state.errors.init_amount ? "error-lable" : ''}>مبلغ پایه برآورد</label>
                                                    {/* <input name="init_amount" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.init_amount} disabled={this.state.status === 'display'} /> */}
                                                    <NumberFormat onValueChange={(values) => this.numberChange("init_amount", values)}
                                                        {...numberDefaultProp} disabled={this.state.status === 'display'} value={this.state.obj.init_amount}
                                                        className={this.state.errors.init_amount ? "form-control error-control" : 'form-control'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="first_winner_name" className="">نام شرکت برنده اول</label>
                                                    <input name="first_winner_name" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.first_winner_name} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="first_winner_amount" className={this.state.errors.first_winner_amount ? "error-lable" : ''}>مبلغ پیشنهادی برنده اول</label>
                                                    {/* <input name="first_winner_amount" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.first_winner_amount} disabled={this.state.status === 'display'} /> */}
                                                    <NumberFormat onValueChange={(values) => this.numberChange("first_winner_amount", values)}
                                                        {...numberDefaultProp} disabled={this.state.status === 'display'} value={this.state.obj.first_winner_amount}
                                                        className={this.state.errors.first_winner_amount ? "form-control error-control" : 'form-control'} />
                                                </div>
                                            </div>

                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="second_winner_name" className="">نام شرکت برنده دوم</label>
                                                    <input name="second_winner_name" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.second_winner_name} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="second_winner_amount" className={this.state.errors.second_winner_amount ? "error-lable" : ''}>مبلغ پیشنهادی برنده دوم</label>
                                                    {/* <input name="second_winner_amount" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.second_winner_amount} disabled={this.state.status === 'display'} /> */}
                                                    <NumberFormat onValueChange={(values) => this.numberChange("second_winner_amount", values)}
                                                        {...numberDefaultProp} disabled={this.state.status === 'display'} value={this.state.obj.second_winner_amount}
                                                        className={this.state.errors.second_winner_amount ? "form-control error-control" : 'form-control'} />
                                                </div>
                                            </div>


                                        </div>
                                        <div className="row">
								   <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="send_document_date" className=""> تاریخ اسال اسناد به کارفرما</label>
                                                    <DatePicker onChange={value => this.dateChange('send_document_date', value)}
                                                        value={this.state.obj. send_document_date }
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                            </div>
										
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="send_document_letter_number" className=""> شماره نامه ارسال اسناد به کارفرما</label>
                                                    <input name="send_document_letter_number" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.send_document_letter_number } disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
								   <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="signification_date" className="">تاریخ ابلاغ قرارداد</label>
                                                    <DatePicker onChange={value => this.dateChange('signification_date', value)}
                                                        value={this.state.obj. signification_date }
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                            </div>	

                                  </div>
                     <div className="row">								  
                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="warranty_price" className="">مبلغ تضمین</label>
                                            
                                                               <NumberFormat  onValueChange={(values) =>this.numberChange("warranty_price",values)} 
                                                       {...numberDefaultProp} disabled={this.state.status === 'display'}  value={this.state.obj.warranty_price}/>
                                                </div>
                                            </div> 
						            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="min_grade" className="">حداقل رتبه و رشته مورد نیاز</label>
                                            
                                                               <NumberFormat  onValueChange={(values) =>this.numberChange("min_grade",values)} 
                                                       {...numberDefaultProp} disabled={this.state.status === 'display'}  value={this.state.obj.min_grade}/>
                                                </div>
                                            </div> 	
					                   <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="call_number" className=""> شماره فراخوان</label>
                                                    <input name="call_number" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.call_number } disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
											</div>
                                            <div className="row">

                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="contract_price" className="">مبلغ قرارداد</label>
                                            
                                                               <NumberFormat  onValueChange={(values) =>this.numberChange("contract_price",values)} 
                                                       {...numberDefaultProp} disabled={this.state.status === 'display'}  value={this.state.obj.contract_price}/>
                                                </div>
                                            </div> 



                                     <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="credit_type_id" className={this.state.errors.invite_method_id ? "error-lable" : ''}>نوع اعتبار</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.credit_type}
                                                        className={this.state.errors.credit_type_id ? "form-control error-control" : 'form-control'}
                                                        value={this.state.obj.credit_type_id} onSelect={(values) => this.selectChange("credit_type_id", values)} />
                                                </div>
                                            </div>   



                                           <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="winner_letter_no" className="">شماره نامه ابلاغ برنده</label>
                                                    <input name="winner_letter_no" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.winner_letter_no} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>



                                            </div>
                                        <div className="row">

                                            
                                           <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="indicator_no" className="">اندیکاتور</label>
                                                    <input name="indicator_no" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.indicator_no} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                        <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="winner_letter_date" className="">تاریخ نامه ابلاغ برنده</label>
                                                    <DatePicker onChange={value => this.dateChange('winner_letter_date', value)}  {...datePickerDefaultProp}
                                                        value={this.state.obj.winner_letter_date} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>   

                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_invite" className="">بارگذاری دعوتنامه</label>
                                                    {this.state.status !== 'display' && <input name="f_file_invite" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_invite && <div><a target="_blank" href={this.state.obj.file_invite}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_invite')}></i>}</div>}

                                                </div>
                                            </div>

                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_record" className="">بارگذاری صورتجلسه</label>
                                                    {this.state.status !== 'display' && <input name="f_file_record" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_record && <div><a target="_blank" href={this.state.obj.file_record}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_record')}></i>}</div>}

                                                </div>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label htmlFor="description" className="">توضیحات</label>
                                                    <input name="description" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.description} disabled={this.state.status === 'display'} />
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
export default Tender;