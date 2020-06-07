import React, { Component } from 'react';
import { saveItem, getAllItem, removeItem, updateItem } from '../../../api/index';
import { message, Select } from 'antd';
import moment from 'moment-jalaali';
import DatePicker from 'react-datepicker2';
import NumberFormat from 'react-number-format';
import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage, errorDuration, selectDefaultProp, datePickerDefaultProp ,numberDefaultProp} from '../../../components/statics'

class InvoiceConsultant extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, rows: [], contracts: [], invoice_no: [], dueTypes: [],
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
        Promise.all([getAllItem(storeIndex), getAllItem('contract'), getAllItem('BaseInfo'),]).then((response) => {
            let contracts = response[1].data.map(a => { return { key: a.id, label: a.contract_no + ' - ' + a.company, value: a.id, title: a.title } });
            let invoice_no = response[2].data.filter(a => a.groupid === 14).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let dueTypes = response[2].data.filter(a => a.groupid === 15).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let data = response[0].data;
            data.forEach(e => {
                //اینجا فیلدهای تاریخ میان
                e.start_date = e.start_date ? moment(e.start_date) : undefined;
                e.end_date = e.end_date ? moment(e.end_date) : undefined;

            });

            this.setState({
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

        obj.start_date = obj.start_date ? obj.start_date.format() : '';
        obj.end_date = obj.end_date ? obj.end_date.format() : '';
        obj.period_price=parseInt(obj.manager_price)-parseInt(obj.prev_price);
        
        var formData = new FormData();
        if (obj.f_file_invoice)
            formData.append("file_invoice", obj.f_file_invoice);

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
            delete obj.Contract;
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

        this.setState({ obj: ob });
    }
    dateChange(name, value) {
        let ob = this.state.obj;
        ob[name] = value;
        this.setState({ obj: ob });
    }
    selectChange(name, values) {
        let {obj ,contractTitle,contracts,rows}= this.state;
        obj[name] = values;
      
        if (name === 'contract_id') {
            let cont =contracts.find(a => a.key === obj.contract_id);
            contractTitle = cont && cont.title ? cont.title : '';
            let prevCont = rows.filter(a => a.contract_id === obj.contract_id)
                .sort((a, b) => (a.invoice_no > b.invoice_no) ? 1 : ((b.invoice_no > a.invoice_no) ? -1 : 0))[0];
            obj.prev_id=prevCont?prevCont.no:0;
            obj.prev_price=prevCont?prevCont.manager_price:0;
        }
        this.setState({ obj, contractTitle });
    }
    numberChange(name, values) {
        const {formattedValue, value} = values;
        let ob = this.state.obj;
        ob[name] = value;
        this.setState({ obj: ob });
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
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="contract_id" className="">شماره پیمان/ قرارداد</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.contracts}
                                                        value={this.state.obj.contract_id} onSelect={(values) => this.selectChange("contract_id", values)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="project_id" className="">نام پیمان</label>
                                                    <label className="form-control">{this.state.contractTitle}</label>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="prev_id" className="">شماره آخرین صورت وضعیت تایید شده مدیر طرح</label>
                                                    <label className="form-control">{this.state.obj.prev_id}</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="prev_price" className="">مبلغ آخرین صورت وضعیت تایید شده مدیر طرح</label>
                                                    <label className="form-control">{this.state.obj.prev_price?this.state.obj.prev_price.toLocaleString():0}</label>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="no_id" className="">شماره صورت وضعیت</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.invoice_no}
                                                        value={this.state.obj.no_id} onSelect={(values) => this.selectChange("no_id", values)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">

                                                    <label htmlFor="start_date" className="">تاریخ شروع دوره کارکرد</label>

                                                    <DatePicker onChange={value => this.dateChange('start_date', value)}
                                                        value={this.state.obj.start_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
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
                                                    <label htmlFor="consultant_price" className="">مبلغ ارائه شده مشاور</label>
                                                    {/* <input name="consultant_price" className="form-control" onChange={this.handleChange} type="number"
                                                        value={this.state.obj.consultant_price} disabled={this.state.status === 'display'} /> */}
                                                        <NumberFormat  onValueChange={(values) =>this.numberChange("consultant_price",values)} 
                                                       {...numberDefaultProp} disabled={this.state.status === 'display'}  value={this.state.obj.consultant_price}/>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="manager_price" className="">مبلغ تایید مدیر طرح</label>
                                                    {/* <input name="manager_price" className="form-control" onChange={this.handleChange} type="number"
                                                        value={this.state.obj.manager_price} disabled={this.state.status === 'display'} /> */}
                                                        <NumberFormat  onValueChange={(values) =>this.numberChange("manager_price",values)} 
                                                       {...numberDefaultProp} disabled={this.state.status === 'display'}  value={this.state.obj.manager_price}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label htmlFor="period_price" className="">کارکرد دوره</label>
                                                    {/* <input name="period_price" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.period_price} disabled={this.state.status === 'display'} /> */}
                                                    <label className="form-control">{this.state.obj.manager_price?(parseInt(this.state.obj.manager_price)-parseInt(this.state.obj.prev_price)).toLocaleString():0}</label>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_invoice" className="">روکش صورت وضعیت</label>
                                                    {this.state.status !== 'display' && <input name="f_file_invoice" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_invoice && <div><a target="_blank" href={this.state.obj.file_invoice}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_invoice')}></i>}</div>}
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
export default InvoiceConsultant;