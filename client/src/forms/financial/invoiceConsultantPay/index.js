import React, { Component } from 'react';
import { saveItem, getAllItem, removeItem, updateItem , getItem} from '../../../api/index';
import { message, Select } from 'antd';
import moment from 'moment-jalaali';
import DatePicker from 'react-datepicker2';
import NumberFormat from 'react-number-format';
import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage,errorMessageDuplicate, errorDuration, selectDefaultProp, datePickerDefaultProp, numberDefaultProp } from '../../../components/statics'

class PayInvoiceConsultant extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, rows: [], contracts: [], invoice_no: [], Typecredit: [], TypePay: [], errors: {},
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
    scrollToGridRef = () => window.scrollTo({ top: 0, behavior: 'smooth', })

    fetchData() {
        Promise.all([getAllItem(storeIndex), getAllItem('agreement/vw'), getAllItem('BaseInfo/vw'), getAllItem('invoiceConsultantApprove')
        , getItem("invoiceConsultantPay", 'PermissionStructure')]).then((response) => {
            let contracts = response[1].data.map(a => { return { key: a.id, label: a.contract_no + ' - ' + a.company, value: a.id, title: a.title } });
            let invoice_no = response[2].data.filter(a => a.groupid === 14).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let Typecredit = response[2].data.filter(a => a.groupid === 16).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let TypePay = response[2].data.filter(a => a.groupid === 17).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let data = response[0].data;
            let invioces = response[3].data;

            let roleId = JSON.parse(localStorage.getItem('user')).role_id;
            let canAdd = response[4].data[0].item_creator_id === roleId || roleId ===11 ? true : false;
            let canEdit = response[4].data[0].item_editor_id.indexOf(roleId) > -1 || roleId === 11 ? true : false;
            let canRead = response[4].data[0].item_viewer_id.indexOf(roleId) > -1 ||  response[4].data[0].item_approver_id.indexOf(roleId) > -1 ? true : false;

            data.forEach(e => {
                //اینجا فیلدهای تاریخ میان
                e.pay_date = e.pay_date ? moment(e.pay_date) : undefined;
                e.Credit_date = e.payCredit_date_date ? moment(e.Credit_date) : undefined;
                e.letter_date_secretariat = e.letter_date_secretariat ? moment(e.letter_date_secretariat) : undefined;
              
 
            });

            this.setState({
                canAdd, canEdit,canRead,
                isFetching: false, rows: data, contracts, invoice_no, Typecredit, TypePay, invioces,
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

        errors.contract_id = obj.contract_id ? false : true;
        errors.no_id = obj.no_id ? false : true;
        errors.price = obj.price ? false : true;

        if (Object.values(errors).filter(a => a).length > 0) {
            this.setState({ errors }, () => { this.scrollToFormRef(); });
            alert("لطفا موارد الزامی را وارد کنید");
        }
        else {
        obj.pay_date = obj.pay_date ? obj.pay_date.format() : '';
        obj.Credit_date = obj.Credit_date ? obj.Credit_date.format() : '';
        obj.letter_date_secretariat = obj.letter_date_secretariat ? obj.letter_date_secretariat.format() : '';
         
        obj.period_price = parseInt(this.state.obj.price) - parseInt(this.state.obj.prev_price);
        var formData = new FormData();
        if (obj.f_file_invoice)
        formData.append("file_invoice", obj.f_file_invoice); 
     
        formData.append("data", JSON.stringify(obj));

        if (this.state.status === 'new')
        saveItem(formData, storeIndex,'multipart/form-data').then((response) => {
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
                    //  this.setState({ obj: emptyItem, isEdit: false, showPanel: false });
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
        let { obj, contractTitle, contracts, rows, invioces } = this.state;
        obj[name] = values;

        if (name === 'contract_id') {
            let cont = contracts.find(a => a.key === obj.contract_id);
            contractTitle = cont && cont.title ? cont.title : '';
           
            let prevInvo = invioces.filter(a => a.contract_id === obj.contract_id)
                .sort((a, b) => (a.invoice_no > b.invoice_no) ? 1 : ((b.invoice_no > a.invoice_no) ? -1 : 0))[0];
            obj.prev_approve_id = prevInvo ? prevInvo.no : 0;
            obj.prev_approve_price = prevInvo ? prevInvo.price : 0;

        }
        else if (name === 'no_id') {
            let prevs = rows.filter(a => a.contract_id === obj.contract_id)
                .sort((a, b) => (a.invoice_no > b.invoice_no) ? 1 : ((b.invoice_no > a.invoice_no) ? -1 : 0));//[0];
            let prevCont = prevs.filter(a => a.no_id < values)[0];
            obj.prev_id = prevCont ? prevCont.no : 0;
            obj.prev_price = prevCont ? prevCont.price : 0;
        }
        this.setState({ obj, contractTitle });
    }
    editClickHandle(item) {
        let cont = this.state.contracts.find(a => a.key == item.contract_id);
        let contractTitle = cont && cont.title ? cont.title : '';
        this.setState({ contractTitle, obj: item, status: 'edit', showPanel: true }, () => { this.scrollToFormRef(); });
    }
     
   numberChange(name, values) {
    const {formattedValue, value} = values;
    let ob = this.state.obj;
    ob[name] = value;
    this.setState({ obj: ob });
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
        const { isFetching  ,canRead ,canEdit ,canAdd } = this.state;
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
                                                    <label htmlFor="contract_id" className={this.state.errors.contract_id ? "error-lable" : ''}>شماره قرارداد</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.contracts}
                                                    className={this.state.errors.contract_id ? "form-control error-control" : 'form-control'}
                                                        value={this.state.obj.contract_id} onSelect={(values) => this.selectChange("contract_id", values)} />
                                                </div>
												
                                            </div>
                                            <div className="col-8">
                                                <div className="form-group">
                                                    <label htmlFor="project_id" className="">نام قرارداد</label>
                                                    <label className="form-control">{this.state.contractTitle}</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="prev_approve_id" className="">شماره آخرین صورت حساب تایید شده دفتر فنی</label>
                                                    <label className="form-control">{this.state.obj.prev_approve_id}</label>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="prev_approve_price" className="">مبلغ آخرین صورت حساب تایید شده دفتر فنی</label>
                                                    <label className="form-control">{this.state.obj.prev_approve_price?this.state.obj.prev_approve_price.toLocaleString():0}</label>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="no_id" className={this.state.errors.no_id ? "error-lable" : ''}>شماره صورت حساب فعلی</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.invoice_no}
                                                    className={this.state.errors.no_id ? "form-control error-control" : 'form-control'}
                                                        value={this.state.obj.no_id} onSelect={(values) => this.selectChange("no_id", values)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                        <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="prev_id" className="">شماره آخرین صورت حساب پرداخت شده مالی</label>
                                                    <label className="form-control">{this.state.obj.prev_id}</label>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="prev_price" className="">مبلغ خرین صورت حساب پرداخت شده مالی</label>
                                                    <label className="form-control">{this.state.obj.prev_price?this.state.obj.prev_price.toLocaleString():0}</label>
                                                </div>
                                            </div>
                                           
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="price" className={this.state.errors.price ? "error-lable" : ''}>مبلغ قابل پرداخت تجمعی</label>
                                                    {/* <input name="price" className="form-control" onChange={this.handleChange} type="number"
                                                        value={this.state.obj.price} disabled={this.state.status === 'display'} /> */}
                                                           <NumberFormat  onValueChange={(values) =>this.numberChange("price",values)} 
                                                       {...numberDefaultProp} disabled={this.state.status === 'display'}  value={this.state.obj.price}
                                                       className={this.state.errors.price ? "form-control error-control" : 'form-control'}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="period_price" className="">مبلغ قابل پرداخت در دوره</label>
                                                    <label className="form-control">{this.state.obj.price?(parseInt(this.state.obj.price) - parseInt(this.state.obj.prev_price)).toLocaleString():0}</label>
                                                </div>
                                            </div>
											
											 <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="letter_no_approve" className="">شماره نامه تایید دفتر فنی کارفرما</label>
                                                    <input name="letter_no_approve" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.letter_no_approve} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>	
											 <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="letter_date_secretariat" className="">تاریخ نامه دریافت از دبیرخانه</label>

                                                    <DatePicker onChange={value => this.dateChange('letter_date_secretariat', value)}
                                                        value={this.state.obj.letter_date_secretariat}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                            </div>
											
											
                               
                                        </div>
                                        <div className="row">
                                        <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="pay_date" className="">تاریخ سند پرداخت</label>

                                                    <DatePicker onChange={value => this.dateChange('pay_date', value)}
                                                        value={this.state.obj.pay_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                            </div>
                                          
										  <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="type_id" className="">نوع پرداخت</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.TypePay}
                                                        value={this.state.obj.type_id} onSelect={(values) => this.selectChange("type_id", values)} />
                                                </div>
                                            </div>
										 <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="Credit_date" className="">تاریخ سررسید اسناد</label>

                                                    <DatePicker onChange={value => this.dateChange('Credit_date', value)}
                                                        value={this.state.obj.Credit_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
												 </div>	
										
                                                 </div>
                                                 <div className="row">
                                                 <div className="col-4">
											   <div className="form-group">
                                                    <label htmlFor="f_file_invoice" className="">بارگذاری سند مالی</label>
                                                    {this.state.status !== 'display' && <input name="f_file_invoice" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_invoice && <div><a target="_blank" href={this.state.obj.file_invoice}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_invoice')}></i>}</div>}
												</div>		
											  </div> 
                                            <div className="col-8">
                                                <div className="form-group">
                                                    <label htmlFor="decsciption" className="">توضیحات</label>
                                                    <input name="decsciption" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.decsciption} disabled={this.state.status === 'display'} />
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
export default PayInvoiceConsultant;