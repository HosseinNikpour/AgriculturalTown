import React, { Component } from 'react';
import { saveItem, getAllItem, removeItem, updateItem } from '../../../api/index';
import { message, Select } from 'antd';
import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage, errorDuration, selectDefaultProp } from '../../../components/statics'

class Company extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, data: [], rows: [], provinces: [], certificateTypes: [],  errors: {},
            isFetching: true, obj: { ...emptyItem }, showPanel: false, status: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.newClickHandle = this.newClickHandle.bind(this);
        this.editClickHandle = this.editClickHandle.bind(this);
        this.deleteClickHandle = this.deleteClickHandle.bind(this);
        this.displayClickHandle = this.displayClickHandle.bind(this);
        this.saveBtnClick = this.saveBtnClick.bind(this);
        this.cancelBtnClick = this.cancelBtnClick.bind(this);
    }

    scrollToFormRef = () => window.scrollTo({ top: this.formRef.offsetTop, behavior: 'smooth' })
    scrollToGridRef = () => window.scrollTo({ top: 0, behavior: 'smooth', })

    fetchData() {
        Promise.all([getAllItem(storeIndex), getAllItem('BaseInfo')]).then((response) => {
            let provinces = response[1].data.filter(a => a.groupid === 1).map(a => { return { key: a.id, label: a.title, value: a.id } })
            let certificateTypes = response[1].data.filter(a => a.groupid === 9).map(a => { return { key: a.id, label: a.title, value: a.id } })
      
            this.setState({ isFetching: false, rows: response[0].data, provinces: provinces, certificateTypes: certificateTypes 
                , obj: {...emptyItem},  showPanel: false,status: ''});
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }

    saveBtnClick() {
        let obj = this.state.obj;

        let errors = this.state.errors;

        errors.title = obj.title ? false : true;
        errors.certificate_type_id = obj.certificate_type_id ? false : true;
       

        if (Object.values(errors).filter(a => a).length > 0) {
            this.setState({ errors }, () => { this.scrollToFormRef(); });
            alert("لطفا موارد الزامی را وارد کنید");
        }
        else {
        if (this.state.status === 'new')
            saveItem(obj, storeIndex).then((response) => {
                if (response.data.type !== "Error") {
                    message.success(successMessage, successDuration);
                    this.fetchData();
                    //   this.setState({ obj: empty  ,status:'', showPanel: false });
                }
                else {
                    message.error(errorMessage, errorDuration);
                    console.log('error : ', response);
                }
            }).catch((error) => console.log(error) );
        else {
            updateItem(obj, storeIndex).then((response) => {
                if (response.data.type !== "Error") {
                    message.success(successMessage, successDuration);
                    //       this.setState({ obj: emptyItem, isEdit: false, showPanel: false });
                    this.fetchData();
                }
                else {
                    message.error(errorMessage, errorDuration);
                    console.log('error : ', response);
                }
            }).catch((error) => console.log(error));
        }
    }
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
    editClickHandle(item) {
    //    item = JSON.parse(JSON.stringify(item).replace(/\:null/gi, "\:\"\""));
        // console.log(item)
        this.setState({ obj: item, status: 'edit', showPanel: true }, () => { this.scrollToFormRef(); });
    }
    displayClickHandle(item) {
     //   item = JSON.parse(JSON.stringify(item).replace(/\:null/gi, "\:\"\""));
        this.setState({ obj: item, status: 'display', showPanel: true }, () => { this.scrollToFormRef() });
    }
    deleteClickHandle(item) {
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
        this.setState({ obj: {...emptyItem}, status: '', showPanel: false }, () => { this.scrollToGridRef(); });
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
                                                    <label htmlFor="title"  className={this.state.errors.title ? "error-lable" : ''}>نام شرکت</label>
                                                    <input name="title"  className={this.state.errors.title ? "form-control error-control" : 'form-control'}  onChange={this.handleChange}
                                                        value={this.state.obj.title} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-8">
                                                <div className="form-group">
                                                    <label htmlFor="full_title" className="">نام  کامل شرکت </label>
                                                    <input name="full_title" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.full_title} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="meli_code" className="">شناسه ملی </label>
                                                    <input name="meli_code" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.meli_code} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="economic_code" className="">کد اقتصادی</label>
                                                    <input name="economic_code" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.economic_code} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="registration_number" className="">شماره ثبت</label>
                                                    <input name="registration_number" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.registration_number} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="registration_province_id" className="">استان محل ثبت شرکت </label>
                                                    <Select {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.provinces}
                                                        value={this.state.obj.registration_province_id} onSelect={(values) => this.selectChange("registration_province_id", values)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="province_id" className="">استان</label>
                                                    <Select {...selectDefaultProp} options={this.state.provinces} disabled={this.state.status === 'display'}
                                                        value={this.state.obj.province_id} onSelect={(values) => this.selectChange("province_id", values)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="city" className="">شهرستان</label>
                                                    <input name="city" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.city} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label htmlFor="address" className="">نشانی کامل</label>
                                                    <input name="address" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.address} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="postalcode" className="">کد پستی</label>
                                                    <input name="postalcode" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.postalcode} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="tell" className="">تلفن</label>
                                                    <input name="tell" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.tell} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="fax" className="">فکس</label>
                                                    <input name="fax" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.fax} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="certificate_type_id" className={this.state.errors.town_id ? "error-lable" : ''}>نوع گواهینامه</label>
                                                    <Select {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.certificateTypes}
                                                        value={this.state.obj.certificate_type_id} onSelect={(values) => this.selectChange("certificate_type_id", values)}
                                                        className={this.state.errors.certificate_type_id ? "form-control error-control" : 'form-control'} 
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="rating1" className="">رتبه های اخذ شده مشاور</label>
                                                    <input name="rating1" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.rating1} disabled={this.state.status === 'display'} />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="rating2" className="">رتبه های اخذ شده پیمانکار</label>
                                                    <input name="rating2" className="form-control" onChange={this.handleChange}
                                                        value={this.state.obj.rating2} disabled={this.state.status === 'display'} />
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
export default Company;