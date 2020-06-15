import React, { Component } from 'react';
import { saveItem, getAllItem, removeItem, updateItem } from '../../../api/index';
import { message, Select } from 'antd';
import moment from 'moment-jalaali';
import DatePicker from 'react-datepicker2';
import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage, errorDuration, selectDefaultProp, datePickerDefaultProp } from '../../../components/statics'

class Tender extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, rows: [], contracts: [], town: [], group: [], Typetender: [], ServiceType: [], 
            operation_type: [], DocumentType: [], ModifierType: [], CommissionResult: [], errors: {},
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
        Promise.all([getAllItem(storeIndex), getAllItem('contract'), getAllItem('BaseInfo'), getAllItem('town')]).then((response) => {
            let contracts = response[1].data.map(a => { return { key: a.id, label: a.contract_no + ' - ' + a.company, value: a.id, title: a.title } });
            let town = response[3].data.map(a => { return { key: a.id, label: a.title, value: a.id } });
            let group = response[2].data.filter(a => a.groupid === 24).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let Typetender = response[2].data.filter(a => a.groupid === 25).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let ServiceType = response[2].data.filter(a => a.groupid === 26).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let operation_type = response[2].data.filter(a => a.groupid === 19).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let DocumentType = response[2].data.filter(a => a.groupid === 27).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let ModifierType = response[2].data.filter(a => a.groupid === 28).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let CommissionResult = response[2].data.filter(a => a.groupid === 29).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let data = response[0].data;
            data.forEach(e => {
                e.publish_date = e.publish_date ? moment(e.publish_date) : undefined;
                e.get_doc_date = e.get_doc_date ? moment(e.get_doc_date) : undefined;
                e.upload_date = e.upload_date ? moment(e.upload_date) : undefined;
                e.commission_date = e.commission_date ? moment(e.commission_date) : undefined;
                e.open_packets_date = e.open_packets_date ? moment(e.open_packets_date) : undefined;
                e.say_to_winner_date = e.say_to_winner_date ? moment(e.say_to_winner_date) : undefined;
                e.contract_date = e.contract_date ? moment(e.contract_date) : undefined;
            });

            this.setState({
                isFetching: false, rows: data, contracts, town, group, Typetender, ServiceType, DocumentType, operation_type, ModifierType, CommissionResult,
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
        obj.publish_date = obj.publish_date ? obj.publish_date.format() : '';
        obj.get_doc_date = obj.get_doc_date ? obj.get_doc_date.format() : '';
        obj.upload_date = obj.upload_date ? obj.upload_date.format() : '';
        obj.commission_date = obj.commission_date ? obj.commission_date.format() : '';
        obj.open_packets_date = obj.open_packets_date ? obj.open_packets_date.format() : '';
        obj.say_to_winner_date = obj.say_to_winner_date ? obj.say_to_winner_date.format() : '';
        obj.contract_date = obj.contract_date ? obj.contract_date.format() : '';
        
        var formData = new FormData();


        if (obj.f_file_record)
        formData.append("file_record", obj.f_file_record); 

        formData.append("data", JSON.stringify(obj));

        if (this.state.status === 'new')
            saveItem(formData, storeIndex, 'multipart/form-data').then((response) => {
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
                                                        value={this.state.obj.town_id} onSelect={(values) => this.selectChange("town_id", values)} />
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
                                                    <label htmlFor="operation_type_id"  className={this.state.errors.operation_type_id ? "error-lable" : ''}>نوع عملیات</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.operation_type}
                                                     className={this.state.errors.operation_type_id ? "form-control error-control" : 'form-control'}
                                                        value={this.state.obj.operation_type_id} onSelect={(values) => this.selectChange("operation_type_id", values)} />
                                                </div>
                                            </div>
										<div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="document_type_id" className="">وضعیت اسناد</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.DocumentType}
                                                        value={this.state.obj.document_type_id} onSelect={(values) => this.selectChange("document_type_id", values)} />
                                                </div>
                                            </div>
										<div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="modifier_type_id" className="">مراحل بررسی</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.ModifierType}
                                                        value={this.state.obj.modifier_type_id} onSelect={(values) => this.selectChange("modifier_type_id", values)} />
                                                </div>
                                            </div>
									 </div>
								 <div className="row">
											   <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="publish_date" className="">تاریخ انتشار</label>

                                                    <DatePicker onChange={value => this.dateChange('publish_date', value)}
                                                        value={this.state.obj.publish_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
												 </div>
											   <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="get_doc_date" className="">آخرین مهلت دریافت اسناد</label>

                                                    <DatePicker onChange={value => this.dateChange('get_doc_date', value)}
                                                        value={this.state.obj.get_doc_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
												 </div>
											   <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="upload_date" className="">آخرین مهلت بارگذاری</label>

                                                    <DatePicker onChange={value => this.dateChange('upload_date', value)}
                                                        value={this.state.obj.upload_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
												 </div>    												 
								 </div>
								 <div className="row">
											   <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="commission_date" className="">تاریخ تشکیل کمیسیون</label>

                                                    <DatePicker onChange={value => this.dateChange('commission_date', value)}
                                                        value={this.state.obj.commission_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
												 </div>
                                              <div className="col-4">												 
											   <div className="form-group">
                                                    <label htmlFor="commission_result_id" className="">نتیجه کمیسیون</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.CommissionResult}
                                                        value={this.state.obj.commission_result_id} onSelect={(values) => this.selectChange("commission_result_id", values)} />
                                                </div>
                                            </div>
										     <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="open_packets_date" className="">تاریخ گشایش پاکت مالی</label>

                                                    <DatePicker onChange={value => this.dateChange('open_packets_date', value)}
                                                        value={this.state.obj.open_packets_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
									        </div>
											</div>
                                 <div className="row">
											   <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="say_to_winner_date" className="">تاریخ ابلاغ به برنده</label>

                                                    <DatePicker onChange={value => this.dateChange('say_to_winner_date', value)}
                                                        value={this.state.obj.say_to_winner_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
												 </div>
	                                         <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="contract_date" className="">تاریخ انعقاد قرارداد</label>

                                                    <DatePicker onChange={value => this.dateChange('contract_date', value)}
                                                        value={this.state.obj.contract_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
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
                                          <div className="col-8">
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