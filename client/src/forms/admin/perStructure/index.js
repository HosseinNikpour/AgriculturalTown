import React, { Component } from 'react';
import { saveItem, getAllItem, removeItem, updateItem } from '../../../api/index';
import { message, Select } from 'antd';
import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder, emptyItem, entities } from './statics'
import { successDuration, successMessage, errorMessage, errorDuration } from '../../../components/statics'

class PermissionStructure extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            columns: columns, rows: [], users: [], entities,
            isFetching: true, obj: emptyItem, showPanel: false, status: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.selectChange = this.selectChange.bind(this);
      //  this.selectMultiChange = this.selectMultiChange.bind(this);
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
        Promise.all([getAllItem(storeIndex), getAllItem('User')]).then((response) => {
            let users = response[1].data.map(a => ({ key: a.id,value: a.id,  label: a.username }));
            users.unshift({ key: -1,value:-1, label: 'پیمانکار' }, { key: -2,value:-2, label: 'مشاور' }, {Key: -3,value:-3, label: 'مدیر شهرستان' })
           let r=response[0].data;
           console.log(r);
            this.setState({ isFetching: false, rows: r, users: users });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }

    saveBtnClick() {
        let obj = this.state.obj;
        // obj.item_creator=obj.item_creator.map(a=>a.value).toString();
        // obj.item_approver=obj.item_approver.map(a=>a.value).toString();
        // obj.item_viewer=obj.item_viewer.map(a=>a.value).toString();
        // obj.item_editor=obj.item_editor.map(a=>a.value).toString();
        if (this.state.status === 'new')
            saveItem(obj, storeIndex).then((response) => {
                if (response.statusText === "OK") {
                    message.success(successMessage, successDuration);
                    this.fetchData();
                }
                else {
                    message.error(errorMessage, errorDuration);
                    console.log('error : ', response);
                }
                //todo : handel error handeling
            }).catch((error) => console.log(error));
        else {
            updateItem(obj, storeIndex).then((response) => {
                if (response.statusText === "OK") {
                    message.success(successMessage, successDuration);
                    this.fetchData();
                }
                else {
                    message.error(errorMessage, errorDuration);
                    console.log('error : ', response);
                }
            }).catch((error) => console.log(error));
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
        console.log(item)

        this.setState({ obj: item, status: 'edit', showPanel: true }, () => { this.scrollToFormRef(); });
    }
    displayClickHandle(item) {
        this.setState({ obj: item, status: 'display', showPanel: true }, () => { this.scrollToFormRef() });
    }
    deleteClickHandle(item) {
        removeItem(item.id, storeIndex).then((response) => {
            if (response.statusText === "OK") {
                message.success(successMessage, successDuration);
                this.fetchData();
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
        this.setState({ obj: emptyItem, status: '', showPanel: false }, () => { this.scrollToGridRef(); });
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
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label htmlFor="entity_name" className="">نام سند</label>
                                                    <Select showSearch className="form-control" direction="rtl" placeholder='انتخاب ...'
                                                        disabled={this.state.status === 'display'} filterOption={true} options={this.state.entities}
                                                        value={this.state.obj.entity_name}
                                                        onSelect={(values) => this.selectChange("entity_name", values)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label htmlFor="item_creator" className=""> ایجاد کننده گان</label>
                                                    <Select className="form-control" direction="rtl" placeholder='انتخاب ...'
                                                        disabled={this.state.status === 'display'} options={this.state.users}
                                                        mode="multiple" showSearch value={this.state.obj.item_creator} 
                                                        onChange={(values) => this.selectChange("item_creator", values)}
                                                    />
                                                   
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label htmlFor="item_approver" className="">تایید کننده گان</label>
                                                    <Select className="form-control" direction="rtl" placeholder='انتخاب ...'
                                                        disabled={this.state.status === 'display'} options={this.state.users}
                                                        mode="multiple" showSearch value={this.state.obj.item_approver} 
                                                        onChange={(values) => this.selectChange("item_approver", values)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label htmlFor="item_viewer" className="">مشاهده کننده گان </label>
                                                    <Select className="form-control" direction="rtl" placeholder='انتخاب ...'
                                                        disabled={this.state.status === 'display'} options={this.state.users}
                                                        mode="multiple" showSearch value={this.state.obj.item_viewer}
                                                        onChange={(values) => this.selectChange("item_viewer", values)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label htmlFor="item_editor" className=""> ویرایش کننده گان</label>
                                                    <Select className="form-control" direction="rtl" placeholder='انتخاب ...'
                                                        disabled={this.state.status === 'display'} options={this.state.users}
                                                        mode="multiple" showSearch value={this.state.obj.item_editor}  
                                                        onChange={(values) => this.selectChange("item_editor", values)}
                                                    />
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
export default PermissionStructure;