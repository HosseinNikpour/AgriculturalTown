import React, { Component } from 'react';
import { saveItem, getAllItem, removeItem, updateItem } from '../../../api/index';
import { message, Select } from 'antd';
import moment from 'moment-jalaali';
import DatePicker from 'react-datepicker2';
import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage, errorDuration, selectDefaultProp, datePickerDefaultProp } from '../../../components/statics'

class Extension extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, rows: [], contract: [], project: '',
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
        Promise.all([getAllItem(storeIndex), getAllItem('contract'), getAllItem('baseinfo')]).then((response) => {
            let contracts = response[1].data.map(a => { return { key: a.id, label: a.title, value: a.id, project: a.project, duration: a.duration } });
            let exNo = response[2].data.filter(a => a.groupid === 13).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let data = response[0].data;
            data.forEach(e => {
                //اینجا فیلدهای تاریخ میان
                e.letter_date = e.letter_date ? moment(e.letter_date) : undefined;
                e.end_date = e.end_date ? moment(e.end_date) : undefined;
                e.end_date_calc = e.end_date_calc ? moment(e.end_date_calc) : undefined;
                e.Announcement_date = e.Announcement_date ? moment(e.Announcement_date) : undefined;
            });
            // console.log(response[1].data)
            this.setState({
                isFetching: false, rows: data, contracts, exNo
                , obj: { ...emptyItem }, showPanel: false, status: ''
            });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }
    saveBtnClick() {
        let obj = this.state.obj;
        console.log(obj);
        debugger;
        obj.letter_date = obj.letter_date ? obj.letter_date.format() : '';
        obj.end_date = obj.end_date ? obj.end_date.format() : '';
        obj.end_date_calc = obj.end_date_calc ? obj.end_date_calc.format() : '';
        obj.Announcement_date = obj.Announcement_date ? obj.Announcement_date.format() : '';
        var formData = new FormData();

        if (obj.f_file_signification)
            formData.append("file_signification", obj.f_file_signification);

        if (obj.f_file_late)
            formData.append("file_late", obj.f_file_late);

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
                    //    this.setState({ obj: emptyItem, isEdit: false, showPanel: false });
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
        let ob = this.state.obj;
        ob[name] = values;
        let prj = this.state.prj;

        if (name === 'contract_id') {
            let cont = this.state.contracts.find(a => a.key == this.state.obj.contract_id);
            prj = cont && cont.project ? cont.project : '';
            let contDur = cont && cont.duration ? parseInt(cont.duration) : 0;
            let pervDurs = this.state.rows.filter(a => a.contract_id == this.state.obj.contract_id),
                sumPrevDurs = pervDurs.reduce(function (acc, obj) { return acc + parseInt(obj.duration); }, 0);
            ob.total_duration = contDur + sumPrevDurs;
        }
        this.setState({ obj: ob, project: prj });
    }
    editClickHandle(item) {
        let cont = this.state.contracts.find(a => a.key == item.contract_id);
        let prj = cont && cont.project ? cont.project : '';
        this.setState({ project: prj, obj: item, status: 'edit', showPanel: true }, () => { this.scrollToFormRef(); });
    }
    displayClickHandle(item) {
        let cont = this.state.contracts.find(a => a.key == item.contract_id);
        let prj = cont && cont.project ? cont.project : '';
        this.setState({ project: prj, obj: item, status: 'display', showPanel: true }, () => { this.scrollToFormRef() });
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
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="contract_id" className="">شماره پیمان</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.contracts}
                                                        value={this.state.obj.contract_id} onSelect={(values) => this.selectChange("contract_id", values)} />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="project_id" className="">نام پروژه</label>
                                                    <label className="form-control">{this.state.project}</label>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="no_id" className="">شماره تمدید</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.exNo}
                                                        value={this.state.obj.no_id} onSelect={(values) => this.selectChange("no_id", values)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="letter_no" className="">شماره نامه ابلاغ تمدید</label>
                                                    <input name="letter_no" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.letter_no} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="letter_date" className="">تاریخ نامه ابلاغ تمدید</label>
                                                    <DatePicker onChange={value => this.dateChange('letter_date', value)}
                                                        value={this.state.obj.letter_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="TotalDuration" className="">جمع مدت اولیه پیمان به اضافه مدت تمدیدهای قبل</label>
                                                    <label className="form-control">{this.state.obj.total_duration}</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="duration" className="">مدت تمدید شده ابلاغ فعلی</label>
                                                    <input name="duration" className="form-control" onChange={this.handleChange} type="number"
                                                        value={this.state.obj.duration} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="end_date" className="">تاریخ پایان(محاسباتی)</label>
                                                    <label className="form-control">{this.state.obj.end_date_calc}</label>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="end_date" className="">تاریخ پایان ابلاغ فعلی</label>
                                                    <DatePicker onChange={value => this.dateChange('end_date', value)}
                                                        value={this.state.obj.end_date}
                                                        disabled={this.state.status === 'display'} {...datePickerDefaultProp} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="allow_late" className="">مدت تاخیرات مجاز</label>
                                                    <input name="allow_late" className="form-control" onChange={this.handleChange} type="number"
                                                        value={this.state.obj.allow_late} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_signification" className="">سند ابلاغ تمدید</label>
                                                    {this.state.status !== 'display' && <input name="f_file_signification" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_signification && <div><a target="_blank" href={this.state.obj.file_signification}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_signification')}></i>}</div>}
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_late" className="">سند لایحه تاخیرات</label>
                                                    {this.state.status !== 'display' && <input name="f_file_late" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_late && <div><a target="_blank" href={this.state.obj.file_late}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_late')}></i>}</div>}
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
export default Extension;