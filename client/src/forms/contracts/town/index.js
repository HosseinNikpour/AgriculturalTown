import React, { Component } from 'react';
import { saveItem, getAllItem, removeItem, updateItem } from '../../../api/index';
import { message, Select } from 'antd';
import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import NumberFormat from 'react-number-format';
import { columns, storeIndex, pageHeder, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage, errorDuration, selectDefaultProp, numberDefaultProp } from '../../../components/statics'

class Town extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, rows: [], provinces: [],
            waterSupply: [], activities: [], ownerships: [], powerSupply: [], gasSupply: [], locations: [],  errors: {},
            isFetching: true, obj: { ...emptyItem }, showPanel: false, status: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.fileChange = this.fileChange.bind(this);
        this.newClickHandle = this.newClickHandle.bind(this);
        this.editClickHandle = this.editClickHandle.bind(this);
        this.deleteClickHandle = this.deleteClickHandle.bind(this);
        this.numberChange = this.numberChange.bind(this);
        this.displayClickHandle = this.displayClickHandle.bind(this);
        this.saveBtnClick = this.saveBtnClick.bind(this);
        this.cancelBtnClick = this.cancelBtnClick.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
    }

    scrollToFormRef = () => window.scrollTo({ top: this.formRef.offsetTop, behavior: 'smooth' })
    scrollToGridRef = () => window.scrollTo({ top: 0, behavior: 'smooth', })

    fetchData() {
        Promise.all([getAllItem(storeIndex), getAllItem('BaseInfo/vw')]).then((response) => {
            let provinces = response[1].data.filter(a => a.groupid === 1).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let activities = response[1].data.filter(a => a.groupid === 2).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let ownerships = response[1].data.filter(a => a.groupid === 4).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let waterSupply = response[1].data.filter(a => a.groupid === 5).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let powerSupply = response[1].data.filter(a => a.groupid === 6).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let gasSupply = response[1].data.filter(a => a.groupid === 7).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let locations = response[1].data.filter(a => a.groupid === 3).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let waterIndex = response[1].data.filter(a => a.groupid === 18).map(a => { return { key: a.id, label: a.title, value: a.id } });
            let operationType = response[1].data.filter(a => a.groupid === 12).map(a => { return { key: a.id, label: a.title, value: a.id } });
            this.setState({
                isFetching: false, rows: response[0].data, waterSupply,
                provinces, activities, ownerships, powerSupply, waterIndex,
                gasSupply, locations, operationType,
                obj: { ...emptyItem }, isEdit: false, showPanel: false
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
        errors.province_id = obj.province_id ? false : true;
        errors.city = obj.city ? false : true;
        errors.coordinate_e=obj.coordinate_e&&obj.coordinate_e.toString().length!==6?true:false;
        errors.coordinate_n=obj.coordinate_n&&obj.coordinate_n.toString().length!==7?true:false;

        if (Object.values(errors).filter(a => a).length > 0) {
            this.setState({ errors }, () => { this.scrollToFormRef(); });
            alert("خطا در ذخیره سازی اطلاعات");
        }
        else {

        let formData = new FormData();
        if (obj.f_file_dxf)
            formData.append("file_dxf", obj.f_file_dxf);
        if (obj.f_file_kmz)
            formData.append("file_kmz", obj.f_file_kmz);
        formData.append("data", JSON.stringify(obj));

        										
	    if (obj.f_file_plan)
        formData.append("file_plan", obj.f_file_plan);
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
                    // this.setState({ obj: emptyItem, isEdit: false, showPanel: false });
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
    numberChange(name, values) {
        const {formattedValue, value} = values;
        let ob = this.state.obj;
        ob[name] = value;
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
    selectChange(name, values) {
        let ob = this.state.obj;
        ob[name] = values;
        this.setState({ obj: ob });
    }
    deleteFile(name) {
        let ob = this.state.obj;
        ob[name] = false;
        this.setState({ obj: ob });
    }
    editClickHandle(item) {
        this.setState({ obj: item, status: 'edit', showPanel: true }, () => { this.scrollToFormRef(); });
    }
    displayClickHandle(item) {
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
                                                    <label htmlFor="title" className={this.state.errors.title ? "error-lable" : ''}>نام شهرک</label>
                                                    <input name="title" className={this.state.errors.title ? "form-control error-control" : 'form-control'} onChange={this.handleChange}
                                                        value={this.state.obj.title} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="province_id" className={this.state.errors.province_id ? "error-lable" : ''}>استان</label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.provinces}
                                                    className={this.state.errors.province_id ? "form-control error-control" : 'form-control'}
                                                        value={this.state.obj.province_id} onSelect={(values) => this.selectChange("province_id", values)} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="city" className={this.state.errors.city ? "error-lable" : ''}>شهرستان </label>
                                                    <input name="city" className="form-control" onChange={this.handleChange}
                                                    className={this.state.errors.city ? "form-control error-control" : 'form-control'}
                                                        value={this.state.obj.city} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="gross_area" className=""> مساحت ناخالص شهرک (مترمربع) </label>
                                                    <input name="gross_area" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.gross_area} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="pure_area" className="">مساحت خالص واحدها (مترمربع)</label>
                                                    <input name="pure_area" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.pure_area} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="inityear" className="">سال تاسیس</label>
                                                    <input name="inityear" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.inityear} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="activity_type_id" className=""> نوع فعالیت</label>
                                                    <Select {...selectDefaultProp} options={this.state.activities} disabled={this.state.status === 'display'}
                                                        value={this.state.obj.activity_type_id} onSelect={(values) => this.selectChange("activity_type_id", values)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="ownership_type_id" className="">نوع مالکیت</label>
                                                    <Select {...selectDefaultProp} options={this.state.ownerships} disabled={this.state.status === 'display'}
                                                        value={this.state.obj.ownership_type_id} onSelect={(values) => this.selectChange("ownership_type_id", values)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="water_supply_id" className=""> منبع تخصیص آب</label>
                                                    <Select {...selectDefaultProp} options={this.state.waterSupply} disabled={this.state.status === 'display'}
                                                        value={this.state.obj.water_supply_id} onSelect={(values) => this.selectChange("water_supply_id", values)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="water_rate" className="">میزان تخصیص آب (لیتر بر ثانیه)</label>
                                                    <input name="water_rate" className="form-control" onChange={this.handleChange} type="number"
                                                        value={this.state.obj.water_rate} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="power_supply_id" className=""> منبع تأمین برق</label>
                                                    <Select {...selectDefaultProp} options={this.state.powerSupply} disabled={this.state.status === 'display'}
                                                        value={this.state.obj.power_supply_id} onSelect={(values) => this.selectChange("power_supply_id", values)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="power_rate" className="">میزان برق تخصیص یافته (کیلو وات ساعت)</label>
                                                    <input name="power_rate" className="form-control" onChange={this.handleChange} type="number"
                                                        value={this.state.obj.power_rate} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="gas_supply_id" className="">منبع تخصیص گاز</label>
                                                    <Select {...selectDefaultProp} options={this.state.gasSupply} disabled={this.state.status === 'display'}
                                                        value={this.state.obj.gas_supply_id} onSelect={(values) => this.selectChange("gas_supply_id", values)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="gas_rate" className=""> میزان تخصیص مصرف گاز (مترمکعب در ساعت)</label>
                                                    <input name="gas_rate" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.gas_rate} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="total_units" className="">تعداد کل واحد های تولیدی</label>
                                                    <input name="total_units" className="form-control" onChange={this.handleChange} type="number"
                                                        value={this.state.obj.total_units} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="used_units" className="">تعداد واحدهای در حال بهره برداری</label>
                                                    <input name="used_units" className="form-control" onChange={this.handleChange} type="number"
                                                        value={this.state.obj.used_units} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="used_number" className=""> تعداد بهره بردار</label>
                                                    <input name="used_number" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.used_number} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="operation_type_id" className=""> نوع عملیات زیرساخت</label>
                                                    <Select {...selectDefaultProp} options={this.state.operationType} disabled={this.state.status === 'display'}
                                                      mode="multiple"  value={this.state.obj.operation_type_id} onChange={(values) => this.selectChange("operation_type_id", values)}
                                                    />
                                                </div>
                                            </div>
                                          
                                        </div>

                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="location_id" className="">موقعیت (شماره زون)</label>
                                                    <Select {...selectDefaultProp} options={this.state.locations} disabled={this.state.status === 'display'}
                                                        value={this.state.obj.location_id} onSelect={(values) => this.selectChange("location_id", values)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="coordinate_e" className={this.state.errors.coordinate_e ? "error-lable" : ''}>مختصات نقطه مرکزی (E)</label>
                                                    <input name="coordinate_e"  onChange={this.handleChange} type='number'
                                                    className={this.state.errors.coordinate_e ? "form-control error-control" : 'form-control'} 
                                                        value={this.state.obj.coordinate_e} disabled={this.state.status === 'display'} />
                                                    {this.state.errors.coordinate_e &&<lable className="text-danger">مقدار قابل قبول 6 رقم میباشد</lable>}
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="coordinate_n" className={this.state.errors.coordinate_n ? "error-lable" : ''}>مختصات نقطه مرکزی (N)</label>
                                                    <input name="coordinate_n"  onChange={this.handleChange} type='number'
                                                        className={this.state.errors.coordinate_n ? "form-control error-control" : 'form-control'} 
                                                        value={this.state.obj.coordinate_n} disabled={this.state.status === 'display'} />
                                                         {this.state.errors.coordinate_n &&<lable className="text-danger">مقدار قابل قبول 7 رقم میباشد</lable>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                        <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="water_quality_EC" className="">کیفیت آب -EC (میکروزیمنس بر سانتیمتر)</label>
                                                    <input name="water_quality_EC" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.water_quality_EC} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
											  <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="water_quality_PH" className="">کیفیت آب  -PH</label>
                                                    <input name="water_quality_PH" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.water_quality_PH} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
											  <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="water_quality_TDS" className=""> کیفیت  آب  -TDS (میلی‌گرم بر لیتر)</label>
                                                    <input name="water_quality_TDS" className="form-control" onChange={this.handleChange} type='number'
                                                        value={this.state.obj.water_quality_TDS} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
											 </div>

                                        <div className="row">
                                           
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_dxf" className="">بارگزاری فایل کروکی DXF</label>
                                                    {this.state.status !== 'display' && <input name="f_file_dxf" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_dxf && <div><a target="_blank" rel="noopener noreferrer" href={this.state.obj.file_dxf}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_dxf')}></i>}</div>}
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_kmz" className="">بارگزاری فایل کروکی KMZ</label>
                                                    {this.state.status !== 'display' && <input name="f_file_kmz" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_kmz && <div><a target="_blank" rel="noopener noreferrer" href={this.state.obj.file_kmz}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_kmz')}></i>}</div>}
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="f_file_plan" className="">بارگذاری فایل  pdf  پلان شهرک</label>
                                                    {this.state.status !== 'display' && <input name="f_file_plan" className="form-control" onChange={this.fileChange} type='file'
                                                    />}
                                                    {this.state.obj.file_plan && <div><a target="_blank" rel="noopener noreferrer" href={this.state.obj.file_dxf}>مشاهده فایل</a>
                                                        {this.state.status === 'edit' && <i className="far fa-trash-alt" style={{ marginRight: '8px' }}
                                                            onClick={() => this.deleteFile('file_plan')}></i>}</div>}
                                                </div>

                                        </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="decsciption" className="">توضیحات</label>
                                                    <textarea name="decsciption" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.decsciption} disabled={this.state.status === 'display'} row="2" />
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