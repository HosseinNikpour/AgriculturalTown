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
        Promise.all([getAllItem(storeIndex),getAllItem('role')]).then((response) => {
            let users =response[1].data.map(a => { return { key: a.id, label: a.title, value: a.id } });
            let rows = response[0].data;
           
            rows.forEach(e => {
                e.entity_name_fa=entities.find(a=>a.value===e.entity_name).label;
                e.item_creator = e.item_creator_id?users.find(a => a.key === e.item_creator_id).label:undefined;
                e.item_approver =e.item_approver?e.item_approver_id.map(x => users.find(a => a.key === x).label).toString():undefined;
                e.item_viewer = e.item_viewer?e.item_viewer_id.map(x => users.find(a => a.key === x).label).toString():undefined;
                e.item_editor = e.item_editor?e.item_editor_id.map(x => users.find(a => a.key === x).label).toString():undefined;
            });
           
            this.setState({ isFetching: false, rows, users ,
                 obj: { ...emptyItem }, showPanel: false, status: ''});
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }

    saveBtnClick() {
        let obj = this.state.obj;
        console.log(obj);
 
        if (this.state.status === 'new')
            saveItem(obj, storeIndex).then((response) => {
                if (response.data.type !== "Error") {
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
           delete obj.entity_name_fa;
            updateItem(obj, storeIndex).then((response) => {
                if (response.data.type !== "Error") {
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
            if (response.data.type !== "Error") {
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
                                                    <label htmlFor="item_creator_id" className=""> ایجاد کننده </label>
                                                    <Select className="form-control" direction="rtl" placeholder='انتخاب ...'
                                                        disabled={this.state.status === 'display'} options={this.state.users}
                                                        showSearch value={this.state.obj.item_creator_id}
                                                        onSelect={(values) => this.selectChange("item_creator_id", values)}
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label htmlFor="item_approver_id" className="">تایید کننده گان</label>
                                                    <Select className="form-control" direction="rtl" placeholder='انتخاب ...'
                                                        disabled={this.state.status === 'display'} options={this.state.users}
                                                        mode="multiple" showSearch value={this.state.obj.item_approver_id}
                                                        onChange={(values) => this.selectChange("item_approver_id", values)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label htmlFor="item_viewer_id" className="">مشاهده کننده گان </label>
                                                    <Select className="form-control" direction="rtl" placeholder='انتخاب ...'
                                                        disabled={this.state.status === 'display'} options={this.state.users}
                                                        mode="multiple" showSearch value={this.state.obj.item_viewer_id}
                                                        onChange={(values) => this.selectChange("item_viewer_id", values)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label htmlFor="item_editor_id" className=""> ویرایش کننده گان</label>
                                                    <Select className="form-control" direction="rtl" placeholder='انتخاب ...'
                                                        disabled={this.state.status === 'display'} options={this.state.users}
                                                        mode="multiple" showSearch value={this.state.obj.item_editor_id}
                                                        onChange={(values) => this.selectChange("item_editor_id", values)}
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