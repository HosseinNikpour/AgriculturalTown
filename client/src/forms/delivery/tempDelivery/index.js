import React, { Component } from 'react';
import { saveItem, getAllItem, removeItem, updateItem, getItem} from '../../../api/index';
import { message, Select } from 'antd';
import moment from 'moment-jalaali';
import DatePicker from 'react-datepicker2';
import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage,errorMessageDuplicate, errorDuration, selectDefaultProp, datePickerDefaultProp } from '../../../components/statics'

class Town extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, rows: [], contracts: [], project: '', hasDefect: [], errors: {},
            isFetching: true, obj: { ...emptyItem }, showPanel: false, status: '', hide_remove_defect_date: false,
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
        Promise.all([getAllItem(storeIndex), getAllItem('contract/vw'), getItem("tempDelivery", 'PermissionStructure')]).then((response) => {
            let contracts = response[1].data.map(a => { return { key: a.id, label: a.contract_no + ' - ' + a.company, value: a.id, title: a.title } })
            let hasDefect = [{ key: 1, label: 'بلی', value: true }, { key: 2, label: 'خیر', value: false }]
            let data = response[0].data;
            console.log(data);


            let roleId = JSON.parse(localStorage.getItem('user')).role_id;
            let canAdd = response[2].data[0].item_creator_id === roleId || roleId ===11 ? true : false;
            let canEdit = response[2].data[0].item_editor_id.indexOf(roleId) > -1 || roleId === 11 ? true : false;
            let canRead = response[2].data[0].item_viewer_id.indexOf(roleId) > -1 ||  response[2].data[0].item_approver_id.indexOf(roleId) > -1 ? true : false;
            data.forEach(e => {
               
                e.contractor_date = e.contractor_date ? moment(e.contractor_date) : undefined;
                e.consultant_date = e.consultant_date ? moment(e.consultant_date) :  undefined;
                e.branch_date = e.branch_date ? moment(e.branch_date) :  undefined;
                e.manager_date = e.manager_date ? moment(e.manager_date) : undefined;
                e.commision_date = e.commision_date ? moment(e.commision_date) : undefined;
                e.remove_defect_date = e.remove_defect_date ? moment(e.remove_defect_date) :  undefined;
                e.elimination_defects_date = e.elimination_defects_date ? moment(e.elimination_defects_date) :  undefined;
            });

            this.setState({
                canAdd, canEdit,canRead,
                isFetching: false, rows: data, contracts, hasDefect
                , obj: { ...emptyItem }, showPanel: false, status: ''
            });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }

    saveBtnClick() {
        let obj = this.state.obj;
        let errors = this.state.errors;

        errors.contract_id = obj.contract_id ? false : true;

        errors.commision_date = obj.commision_date ? false : true;


        if (Object.values(errors).filter(a => a).length > 0) {
            this.setState({ errors }, () => { this.scrollToFormRef(); });
            alert("لطفا موارد الزامی را وارد کنید");
        }
        else {

            obj.contractor_date = obj.contractor_date ? obj.contractor_date.format() : '';
            obj.consultant_date = obj.consultant_date ? obj.consultant_date.format() : '';
            obj.branch_date = obj.branch_date ? obj.branch_date.format() : '';
            obj.manager_date = obj.manager_date ? obj.manager_date.format() : '';
            obj.commision_date = obj.commision_date ? obj.commision_date.format() : '';
            obj.remove_defect_date = obj.remove_defect_date ? obj.remove_defect_date.format() : '';
            obj.elimination_defects_date = obj.elimination_defects_date ? obj.elimination_defects_date.format() : '';

            var formData = new FormData();

            if (obj.f_file_defect) formData.append("file_defect", obj.f_file_defect);
            if (obj.f_file_record) formData.append("file_record", obj.f_file_record);
            if (obj.f_file_elimination_defects) formData.append("file_elimination_defects", obj.f_file_elimination_defects);
            if (obj.f_file_signification) formData.append("file_signification", obj.f_file_signification);

            formData.append("data", JSON.stringify(obj));

            if (this.state.status === 'new')
                saveItem(formData, storeIndex, 'multipart/form-data').then((response) => {
                    if (response.data.type !== "Error") {
                        message.success(successMessage, successDuration);
                        // this.setState({ obj: emptyItem, isEdit: false, showPanel: false });
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
                        //      this.setState({ obj: emptyItem, isEdit: false, showPanel: false });
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
        let { obj, contractTitle, hide_remove_defect_date } = this.state;
        obj[name] = values;

        if (name === 'contract_id') {
            let cont = this.state.contracts.find(a => a.key == this.state.obj.contract_id);
            contractTitle = cont && cont.title ? cont.title : '';
        }
        if (name === 'with_defect') {
            if (values === false) hide_remove_defect_date = true;
            else hide_remove_defect_date = false;
        }
        this.setState({ obj, contractTitle, hide_remove_defect_date });
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
        // console.log(item)
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
        const { isFetching ,canRead ,canEdit ,canAdd } = this.state;
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
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="contract_id" className={this.state.errors.contract_id ? "error-lable" : ''}>شماره پیمان </label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.contracts}
                                                        className={this.state.errors.contract_id ? "form-control error-control" : 'form-control'}
                                                        value={this.state.obj.contract_id} onSelect={(values) => this.selectChange("contract_id", values)} />
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
                                                    <label htmlFor="contractor_date" className="">تاریخ درخواست پیمانکار</label>
                                                    <DatePicker onChange={value => this.dateChange('contractor_date', value)}
                                                        value={this.state.obj.contractor_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="consultant_date" className="">تاریخ درخواست مشاور</label>
                                                    <DatePicker onChange={value => this.dateChange('consultant_date', value)}
                                                        value={this.state.obj.consultant_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="branch_date" className="">تاریخ درخواست مدیر شعبه</label>
                                                    <DatePicker onChange={value => this.dateChange('branch_date', value)}
                                                        value={this.state.obj.branch_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                            </div>
											</div>
                                        <div className="row">
										<div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="manager_date" className="">تاریخ درخواست مدیر طرح</label>
                                                    <DatePicker onChange={value => this.dateChange('manager_date', value)}
                                                        value={this.state.obj.manager_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="commision_date" className={this.state.errors.commision_date ? "error-lable" : ''}>تاریخ تشکیل کمیسیون</label>

                                                    <DatePicker onChange={value => this.dateChange('commision_date', value)}
                                                        value={this.state.obj.commision_date}

                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp}
                                                        className={this.state.errors.commision_date ? "form-control error-control" : 'form-control'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="with_defect" className="">تحویل با نقص</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.hasDefect}
                                                        value={this.state.obj.with_defect} onSelect={(values) => this.selectChange("with_defect", values)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
										<div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="remove_defect_date" className="">آخرین مهلت تعیین شده برای رفع نقص</label>

                                                    <DatePicker onChange={value => this.dateChange('remove_defect_date', value)}
                                                        value={this.state.obj.remove_defect_date}
                                                        disabled={this.state.status === 'display' || this.state.hide_remove_defect_date} {...datePickerDefaultProp} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="elimination_defects_date" className="">تاریخ رفع نقص</label>
                                                    <DatePicker onChange={value => this.dateChange('elimination_defects_date', value)}
                                                        value={this.state.obj.elimination_defects_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                               </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_record" className="">سند صورتجلسه</label>
                                                    {this.state.status !== 'display' && <input name="f_file_record" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_record && <div><a target="_blank" href={this.state.obj.file_record}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_record')}></i>}</div>}
                                                </div>
                                            </div>
											 </div>
											  <div className="row">
                                                   <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_defect" className="">لیست نواقص</label>
                                                    {this.state.status !== 'display' && <input name="f_file_defect" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_defect && <div><a target="_blank" href={this.state.obj.file_defect}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_defect')}></i>}</div>}
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_signification" className="">سند ابلاغ صورتجلسه</label>
                                                    {this.state.status !== 'display' && <input name="f_file_signification" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_signification && <div><a target="_blank" href={this.state.obj.file_signification}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_signification')}></i>}</div>}
                                                </div>
                                            </div>
											   <div className="col-4">
												<div className="form-group">
                                                    <label htmlFor="f_file_elimination_defects" className="">صورت جلسه رفع نقص</label>
                                                    {this.state.status !== 'display' && <input name="f_file_elimination_defects" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_elimination_defects && <div><a target="_blank" href={this.state.obj.file_elimination_defects}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_elimination_defects')}></i>}</div>}
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