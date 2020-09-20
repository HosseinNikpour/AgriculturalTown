import React, { Component } from 'react';
import { saveItem, getAllItem, removeItem, updateItem , getItem } from '../../../api/index';
import { message, Select } from 'antd';
import moment from 'moment-jalaali';
import DatePicker from 'react-datepicker2';
import NumberFormat from 'react-number-format';
import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage,errorMessageDuplicate, errorDuration, selectDefaultProp, datePickerDefaultProp ,numberDefaultProp} from '../../../components/statics'

class InvoiceContractor extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, rows: [], contracts: [], invoice_no: [], Duetypes: [], errors: {}, 
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
        Promise.all([getAllItem(storeIndex), getAllItem('contract/vw'), getAllItem('BaseInfo/vw')
         , getItem("invoiceContractor", 'PermissionStructure')]).then((response) => {
            //.filter(a=>a.company_type_id===55)
            let contracts = response[1].data.map(a => { return { key: a.id, label: a.contract_no + ' - ' + a.company, value: a.id, title: a.title } });
            let invoice_no= response[2].data.filter(a => a.groupid === 14).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let dueTypes= response[2].data.filter(a => a.groupid === 15).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let data = response[0].data;

            let roleId = JSON.parse(localStorage.getItem('user')).role_id;
            let canAdd = response[3].data[0].item_creator_id === roleId || roleId ===11 ? true : false;
            let canEdit = response[3].data[0].item_editor_id.indexOf(roleId) > -1 || roleId === 11 ? true : false;
            let canRead = response[3].data[0].item_viewer_id.indexOf(roleId) > -1 ||  response[3].data[0].item_approver_id.indexOf(roleId) > -1 ? true : false;
            data.forEach(e => {
                //اینجا فیلدهای تاریخ میان
                e.start_date = e.start_date ? moment(e.start_date) : undefined;
                e.end_date = e.end_date ? moment(e.end_date) : undefined;
                e.letter_date_manager = e.letter_date_manager ? moment(e.letter_date_manager) : undefined;
                e.letter_date_branch = e.letter_date_branch ? moment(e.letter_date_branch) : undefined;
                e.contractor_letter_date = e.contractor_letter_date ? moment(e.contractor_letter_date) : undefined;
                e.consultant_letter_date = e.consultant_letter_date ? moment(e.consultant_letter_date) : undefined;
            });

            this.setState({
                canAdd, canEdit, canRead,
                isFetching: false, rows: data, contracts, invoice_no, dueTypes
                , obj: { ...emptyItem }, showPanel: false, status: '',contractTitle:''
            });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }

    saveBtnClick() {
        let obj = this.state.obj;
        let errors = this.state.errors;
        
        errors.no_id = obj.no_id ? false : true;
        errors.contract_id = obj.contract_id ? false : true;
        errors.manager_price = obj.manager_price ? false : true;
       

        if (Object.values(errors).filter(a => a).length > 0) {
            this.setState({ errors }, () => { this.scrollToFormRef(); });
            alert("لطفا موارد الزامی را وارد کنید");
        }
        else {
        obj.start_date = obj.start_date ? obj.start_date.format() : '';
        obj.end_date = obj.end_date ? obj.end_date.format() : '';
        obj.period_price=parseInt(obj.manager_price)-parseInt(obj.prev_price);
        obj.letter_date_manager = obj.letter_date_manager ? obj.letter_date_manager.format() : '';	
        obj.letter_date_branch = obj.letter_date_branch ? obj.letter_date_branch.format() : '';	
        obj.contractor_letter_date = obj.contractor_letter_date ? obj.contractor_letter_date.format() : '';	
        obj.consultant_letter_date = obj.consultant_letter_date ? obj.consultant_letter_date.format() : '';	
        var formData = new FormData();
   //اینجا فیلدهای فایل میان
  
   if (obj.f_file_invoice)
   formData.append("file_invoice", obj.f_file_invoice);
   
   if (obj.f_file_letter_manager)
   formData.append("file_letter_manager", obj.f_file_letter_manager);
   


        formData.append("data", JSON.stringify(obj));

        if (this.state.status === 'new')
            saveItem(formData, storeIndex, 'multipart/form-data').then((response) => {

                if (response.data.type !== "Error") {
                    message.success(successMessage, successDuration);
                    //   this.setState({ obj: emptyItem, isEdit: false, showPanel: false });
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
    
 
   numberChange(name, values) {
    const {formattedValue, value} = values;
    let ob = this.state.obj;
    ob[name] = value;
    this.setState({ obj: ob });
}

    selectChange(name, values) {
        let { obj, contractTitle, contracts, rows } = this.state;
        obj[name] = values;
      //  let contractTitle = this.state.contractTitle;

        if (name === 'contract_id') {
            let cont = contracts.find(a => a.key ===obj.contract_id);
            contractTitle = cont && cont.title ? cont.title : '';
          
        }
        else if (name === 'no_id') {
            let prevs = rows.filter(a => a.contract_id === obj.contract_id)
                .sort((a, b) => (a.invoice_no > b.invoice_no) ? 1 : ((b.invoice_no > a.invoice_no) ? -1 : 0));//[0];
            let prevCont = prevs.filter(a => a.no_id < values)[0];
            obj.prev_id = prevCont ? prevCont.no : 0;
            obj.prev_price = prevCont ? prevCont.manager_price : 0;
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
                                                    <label htmlFor="contract_id" className={this.state.errors.contract_id ? "error-lable" : ''}>شماره پیمان</label>
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
                                                    <label htmlFor="no_id" className={this.state.errors.no_id ? "error-lable" : ''}>شماره صورت وضعیت فعلی</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.invoice_no} 
                                                     className={this.state.errors.no_id ? "form-control error-control" : 'form-control'}													
                                                        value={this.state.obj.no_id} onSelect={(values) => this.selectChange("no_id", values)}/>
                                                </div>
                                             </div> 
									 <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="prev_id" className="">شماره آخرین صورت وضعیت تایید شده مدیر طرح</label>
                                                    <label className="form-control">{this.state.obj.prev_id}</label>
                                                </div>
                                            </div>
                                         <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="prev_price" className="">مبلغ آخرین صورت وضعیت تایید شده مدیر طرح</label>
                                                    <label className="form-control">{this.state.obj.prev_price?this.state.obj.prev_price.toLocaleString():0}</label>
                                                </div>
                                            </div>
                                                     
				                              </div>
                                     <div className="row">
									 <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="start_date" className="">تاریخ شروع دوره کارکرد</label>

                                                    <DatePicker onChange={value => this.dateChange('start_date', value)}
                                                        value={this.state.obj.start_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
												 </div>  
                                      <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="end_date" className="">تاریخ پایان دوره کارکرد</label>
                                                    <DatePicker onChange={value => this.dateChange('end_date', value)}
                                                        value={this.state.obj.end_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
												 </div>
                                    <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="contractor_price" className="">مبلغ تجمعی ارائه شده پیمانکار</label>
                                                    {/* <input name="contractor_price" className="form-control" onChange={this.handleChange} type="number"
                                                        value={this.state.obj.contractor_price} disabled={this.state.status === 'display'} /> */}
                                                               <NumberFormat  onValueChange={(values) =>this.numberChange("contractor_price",values)} 
                                                       {...numberDefaultProp} disabled={this.state.status === 'display'}  value={this.state.obj.contractor_price}/>
                                                </div>
                                            </div>    											
                                            </div>
                                     <div className="row"> 
                                   <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="consultant_price" className="">مبلغ تجمعی تایید نظارت</label>
                                                    {/* <input name="consultant_price" className="form-control" onChange={this.handleChange} type="number"
                                                        value={this.state.obj.consultant_price} disabled={this.state.status === 'display'} /> */}
                                                               <NumberFormat  onValueChange={(values) =>this.numberChange("consultant_price",values)} 
                                                       {...numberDefaultProp} disabled={this.state.status === 'display'}  value={this.state.obj.consultant_price}/>
                                                </div>
                                            </div> 
                                     <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="manager_price"className={this.state.errors.manager_price ? "error-lable" : ''}>مبلغ تجمعی تایید مدیر طرح</label>
                                                    {/* <input name="manager_price"  className={this.state.errors.manager_price ? "form-control error-control" : 'form-control'}	 onChange={this.handleChange} type="number"
                                                        value={this.state.obj.manager_price} disabled={this.state.status === 'display'} /> */}
                                                               <NumberFormat  onValueChange={(values) =>this.numberChange("manager_price",values)} 
                                                       {...numberDefaultProp} disabled={this.state.status === 'display'} value={this.state.obj.manager_price}
													    className={this.state.errors.manager_price ? "form-control error-control" : 'form-control'} />
                                                </div>
                                            </div>			
						                <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="period_price" className="">کارکرد دوره</label>
                                                    <label className="form-control">{this.state.obj.manager_price?(parseInt(this.state.obj.manager_price)-parseInt(this.state.obj.prev_price)).toLocaleString():0}</label>
                                                </div>
                                            </div>
                                            </div>
                                            <div className="row">

                                           <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="letter_no_branch" className="">شماره نامه مدیر شعبه</label>
                                                    <input name="letter_no_branch" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.letter_no_branch} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
																					
								            <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="letter_date_branch" className="">تاریخ نامه مدیر شعبه</label>

                                                    <DatePicker onChange={value => this.dateChange('letter_date_branch', value)}
                                                        value={this.state.obj.letter_date_branch}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
												 </div>  	 
								        <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="letter_no_manager" className="">شماره نامه مدیر طرح</label>
                                                    <input name="letter_no_manager" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.letter_no_manager} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
												 
										</div> 
                                     <div className="row"> 		 									
								       <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="letter_date_manager" className="">تاریخ نامه مدیر طرح به معاون فنی</label>

                                                    <DatePicker onChange={value => this.dateChange('letter_date_manager', value)}
                                                        value={this.state.obj.letter_date_manager}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
												 </div>

                                                 

                                   <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="contractor_letter_date" className="">تاریخ نامه پیمانکار</label>

                                                    <DatePicker onChange={value => this.dateChange('contractor_letter_date', value)}
                                                        value={this.state.obj.contractor_letter_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
					  </div> 


                                   <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="consultant_letter_date" className="">تاریخ نامه مشاور</label>

                                                    <DatePicker onChange={value => this.dateChange('consultant_letter_date', value)}
                                                        value={this.state.obj.consultant_letter_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
					  </div> 
                      </div> 
                      <div className="row">	
											 <div className="col-4">
											   <div className="form-group">
                                                    <label htmlFor="f_file_invoice" className="">روکش صورت وضعیت</label>
                                                    {this.state.status !== 'display' && <input name="f_file_invoice" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_invoice && <div><a target="_blank" href={this.state.obj.file_invoice}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_invoice')}></i>}</div>}
												</div>		
											  </div>
                                              <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_letter_manager" className="">بارگذاری نامه مدیر طرح</label>
                                                    {this.state.status !== 'display' && <input name="f_file_letter_manager" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_letter_manager && <div><a target="_blank" href={this.state.obj.file_letter_manager}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_letter_manager')}></i>}</div>}
                                                </div>
                                            </div>
                                              </div>	
                                              <div className="row">								 
                                          <div className="col-12">
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
export default InvoiceContractor;