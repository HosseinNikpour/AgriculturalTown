import React, { Component } from 'react';
import { saveItem, getAllItem, removeItem, updateItem } from '../../../api/index';
import { message, Select } from 'antd';
import Grid from '../../../components/common/grid3';
import NumberFormat from 'react-number-format';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage, errorDuration, selectDefaultProp, datePickerDefaultProp, numberDefaultProp } from '../../../components/statics'

class ValueChange extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, rows: [], contracts: [], valueChange_no: [],
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
        this.numberChange = this.numberChange.bind(this);
        this.saveBtnClick = this.saveBtnClick.bind(this);
        this.cancelBtnClick = this.cancelBtnClick.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
    }

    scrollToFormRef = () => window.scrollTo({ top: this.formRef.offsetTop, behavior: 'smooth' })
    scrollToGridRef = () => window.scrollTo({ top: 0, behavior: 'smooth', })

    fetchData() {
        Promise.all([getAllItem(storeIndex), getAllItem('contract'), getAllItem('BaseInfo')]).then((response) => {
            let contracts = response[1].data.map(a => { return { key: a.id, label: a.contract_no + ' - ' + a.company, value: a.id, title: a.title,initial_amount:a.initial_amount } });
            let valueChange_no = response[2].data.filter(a => a.groupid === 30).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let yesNo = [{ key: 1, label: 'بلی', value: true }, { key: 2, label: 'خیر', value: false }]
            let data = response[0].data;

            this.setState({
                isFetching: false, rows: data, contracts, valueChange_no, yesNo,
                obj: { ...emptyItem }, showPanel: false, status: '', contractTitle: '',initialAmount:0,
            });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }

    saveBtnClick() {
        let obj = this.state.obj;

        let formData = new FormData();
        if (obj.f_file_signification) formData.append("file_signification", obj.f_file_signification);
        if (obj.f_file_25percent) formData.append("file_25percent", obj.f_file_25percent);
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
        let { obj, contractTitle, contracts, initialAmount,rows, invioces } = this.state;
        obj[name] = values;

        if (name === 'contract_id') {
            let cont = contracts.find(a => a.key === obj.contract_id);
            contractTitle = cont && cont.title ? cont.title : '';
            initialAmount=cont&&cont.initial_amount?parseInt(cont.initial_amount):0;
          
        }
        this.setState({ obj, contractTitle ,initialAmount});
    }
    editClickHandle(item) {
        let cont = this.state.contracts.find(a => a.key == item.contract_id);
        let contractTitle = cont && cont.title ? cont.title : '';
       let initialAmount=cont&&cont.initial_amount?cont.initial_amount:0;
        this.setState({initialAmount, contractTitle, obj: item, status: 'edit', showPanel: true }, () => { this.scrollToFormRef(); });
    }
    displayClickHandle(item) {
        let cont = this.state.contracts.find(a => a.key == item.contract_id);
        let contractTitle = cont && cont.title ? cont.title : '';
        let initialAmount=cont&&cont.initial_amount?cont.initial_amount:0;
        this.setState({initialAmount, contractTitle, obj: item, status: 'display', showPanel: true }, () => { this.scrollToFormRef() });
    }
    numberChange(name, values) {
        const {formattedValue, value} = values;
        let ob = this.state.obj;
        ob[name] = value;
        this.setState({ obj: ob });
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
                                                    <label htmlFor="project_id" className="">مبلغ اولیه پیمان</label>
                                                    <label className="form-control">{this.state.initialAmount?this.state.initialAmount.toLocaleString():0}</label>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="no_id" className="">شماره تغییر مقادیر</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.valueChange_no}
                                                        value={this.state.obj.no_id} onSelect={(values) => this.selectChange("no_id", values)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="increase_price" className="">مبلغ افزایش یافته</label>
                                                   {/* <input name="increase_price" className="form-control" onChange={this.handleChange} type="number"
                                                        value={this.state.obj.increase_price} disabled={this.state.status === 'display'} /> */}
                                                          <NumberFormat  onValueChange={(values) =>this.numberChange("increase_price",values)} 
                                                       {...numberDefaultProp} disabled={this.state.status === 'display'}  value={this.state.obj.increase_price}/>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="decrease_price" className="">مبلغ کاهش یافته</label>
                                                    {/* <input name="decrease_price" className="form-control" onChange={this.handleChange} type="number"
                                                        value={this.state.obj.decrease_price} disabled={this.state.status === 'display'} /> */}
                                                           <NumberFormat  onValueChange={(values) =>this.numberChange("decrease_price",values)} 
                                                       {...numberDefaultProp} disabled={this.state.status === 'display'}  value={this.state.obj.decrease_price}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="new_work" className="">بهای کار جدید</label>
                                                    {/* <input name="new_work" className="form-control" onChange={this.handleChange} type="number"
                                                        value={this.state.obj.new_work} disabled={this.state.status === 'display'} /> */}
                                                           <NumberFormat  onValueChange={(values) =>this.numberChange("new_work",values)} 
                                                       {...numberDefaultProp} disabled={this.state.status === 'display'}  value={this.state.obj.new_work}/>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="change_price" className="">بهای تغییر مقادیر </label>
                                                    <label className="form-control">{(-parseInt(this.state.obj.decrease_price) + parseInt(this.state.obj.new_work) + parseInt(this.state.obj.increase_price)).toLocaleString()}</label>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="contract_new_price_calc" className="">مبلغ پیمان با احتساب تغییر مقادیر(محاسباتی)</label>
                                                    <label className="form-control">{(parseInt(this.state.initialAmount) - parseInt(this.state.obj.decrease_price) + parseInt(this.state.obj.new_work) + parseInt(this.state.obj.increase_price)).toLocaleString()}</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="contract_new_price" className="">مبلغ پیمان با احتساب تغییر مقادیر(سند)</label>
                                                    {/* <input name="contract_new_price" className="form-control" onChange={this.handleChange} type="number"
                                                        value={this.state.obj.contract_new_price} disabled={this.state.status === 'display'} /> */}
                                                           <NumberFormat  onValueChange={(values) =>this.numberChange("contract_new_price",values)} 
                                                       {...numberDefaultProp} disabled={this.state.status === 'display'}  value={this.state.obj.contract_new_price}/>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="increase_price_percent" className="">درصد تغییرات(افزایش)</label>
                                                    <label className="form-control">{(100* parseInt(this.state.obj.increase_price)/parseInt(this.state.initialAmount)).toFixed(2)}</label>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="decrease_price_percent" className="">درصد تغییرات( کاهش)</label>
                                                    <label className="form-control">{(100* parseInt(this.state.obj.decrease_price)/parseInt(this.state.initialAmount)).toFixed(2)}</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                        <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="new_work_percent" className="">درصد کارجدید</label>
                                                    <label className="form-control">{(100* parseInt(this.state.obj.new_work)/parseInt(this.state.initialAmount)).toFixed(2)}</label>
                                                </div>
                                            </div>
                                         <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="change_price_percent" className="">درصد کل افزایش یا کاهش</label>
                                                    <label className="form-control">{(100* (-parseInt(this.state.obj.decrease_price) + parseInt(this.state.obj.new_work) + parseInt(this.state.obj.increase_price))/parseInt(this.state.initialAmount)).toFixed(2)}</label>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="has_license" className="">مجوز جمع جبری دارد</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.yesNo}
                                                        value={this.state.obj.has_license} onSelect={(values) => this.selectChange("has_license", values)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                        <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="has25" className="">ابلاغ 25 درصد دارد</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.yesNo}
                                                        value={this.state.obj.has25} onSelect={(values) => this.selectChange("has25", values)} />
                                                </div>
                                            </div>
                                       <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_signification" className="">نامه ابلاغ تغییر مقادیر</label>
                                                    {this.state.status !== 'display' && <input name="f_file_signification" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_signification && <div><a target="_blank" href={this.state.obj.file_signification}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_signification')}></i>}</div>}

                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_25percent" className="">نامه ابلاغ  25 درصد</label>
                                                    {this.state.status !== 'display' && <input name="f_file_25percent" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_25percent && <div><a target="_blank" href={this.state.obj.file_25percent}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_25percent')}></i>}</div>}

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
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
export default ValueChange;