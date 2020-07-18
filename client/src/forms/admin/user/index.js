import React, { Component } from 'react';
import { message,Select } from 'antd';
import moment from 'moment-jalaali'
import { saveItem, getAllItem, updateItem, removeItem, updatePassword } from '../../../api/index'

import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder, genPass, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage,errorMessageDuplicate, errorDuration,selectDefaultProp } from '../../../components/statics'

moment.loadPersian()
class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: columns, rows: [], isFetching: true, obj: {...emptyItem}, status: '', showPanel: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.newClickHandle = this.newClickHandle.bind(this);
        this.editClickHandle = this.editClickHandle.bind(this);
        this.deleteClickHandle = this.deleteClickHandle.bind(this);
        this.chpClickHandle = this.chpClickHandle.bind(this);
        this.genratePassword = this.genratePassword.bind(this);
        this.saveBtnClick = this.saveBtnClick.bind(this);
        this.cancelBtnClick = this.cancelBtnClick.bind(this);
    }

    scrollToFormRef = () => window.scrollTo({ top: 0, behavior: 'smooth', })

    fetchData() {
        Promise.all([getAllItem(storeIndex),getAllItem('role')]).then((response) => {
            let data = response[0].data;
            let roles=response[1].data.map(a => { return { key: a.id, label: a.title, value: a.id } });
            data.forEach(e => {
                e.last_login =e.last_login? moment(e.last_login):undefined;
              
            });

            this.setState({ data,roles, isFetching: false, rows: data.filter(a => a.enabled) 
            , obj: {...emptyItem},  showPanel: false,status: ''});
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }
    selectChange(name, values) {
        let ob = this.state.obj;
        ob[name] = values;
        this.setState({ obj: ob });
    }
    saveBtnClick() {
        let obj = this.state.obj;
        console.log(obj)
       
        if (this.state.status === 'new')
            saveItem(obj, storeIndex).then((response) => {
                if (response.data.type !== "Error") {
                    message.success(successMessage, successDuration);
                    this.fetchData();
                   // this.setState({ obj: emptyItem, status: '', showPanel: false });
                }
                else {
                    if(response.data.message.indexOf('duplicate key value violates unique constraint')>-1)
                    message.error(errorMessageDuplicate, errorDuration);
                    else{
                        message.error(errorMessage, errorDuration);
                        console.log('error : ', response);
                    }
                }
            }).catch((error) => console.log(error));
        else if (this.state.status === 'edit')
            updateItem(obj, storeIndex).then((response) => {
                if (response.data.type !== "Error") {
                    message.success(successMessage, successDuration);
                    this.fetchData();
                 //   this.setState({ obj: emptyItem, status: '', showPanel: false });
                }
                else {
                    message.error(errorMessage, errorDuration);
                    console.log('error : ', response);
                }
            }).catch((error) => console.log(error));
        else {
            updatePassword({id:obj.id ,password:obj.password}).then((response) => {
                if (response.data.type !== "Error") {
                    message.success(successMessage, successDuration);
                   // this.fetchData();
                   // this.setState({ obj: emptyItem, status: '', showPanel: false });
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
    newClickHandle() {
        this.setState({ showPanel: true, status: 'new' });
    }
    cancelBtnClick() {
        this.setState({ obj: emptyItem, status: '', showPanel: false });
    }
    genratePassword() {
        let pass = genPass();
        let obj = this.state.obj;
        obj.password = pass;
        this.setState({ obj: obj });
    }
    editClickHandle(item) {
        console.log(item)
        this.setState({ obj: item, status: 'edit', showPanel: true }, () => { this.scrollToFormRef(); });
    }
    chpClickHandle(item) {
        console.log(item)
        this.setState({ obj: item, status: 'display', showPanel: true }, () => { this.scrollToFormRef(); });
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
    render() {
        const { isFetching } = this.state;
        if (isFetching) {
            return (<Loading></Loading>)
        }
        else {
            return (
                <div className="app-main col-12">
                    <div className="row" >
                        <div className="col-8">
                            <div className="card">
                                <div className="card-header">
                                    <div className='row'>
                                        <div className='col'>
                                            {pageHeder}
                                        </div>
                                        <div className='col-1 ml-auto'>
                                            <i className="fa fa-plus-circle add-button" onClick={this.newClickHandle}></i>
                                        </div>
                                    </div>


                                </div>
                                <div className="card-body">
                                    <Grid columns={this.state.columns} rows={this.state.rows}
                                        editClick={this.editClickHandle}
                                        displayClick={this.chpClickHandle}
                                        // deleteClick={this.deleteClickHandle}
                                        >
                                        
                                    </Grid>
                                </div>
                            </div>
                        </div>

                        <div className='col-4'>
                            <div className={this.state.showPanel ? '' : 'hidden'}>
                                <div className="card">
                                    <div className="card-header">
                                        {this.state.status === 'new' ? 'اضافه کردن آیتم جدید' : this.state.status === 'edit' ? 'ویرایش آیتم' : 'مشاهده آیتم'}
                                    </div>
                                    <div className="card-body">
                                        <form>
                                            <div className="row">
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label htmlFor="username" className="">نام کاربری</label>
                                                        <input name="username" className="form-control" onChange={this.handleChange}
                                                            value={this.state.obj.username} disabled={this.state.status === 'display'} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label htmlFor="name" className="">نام</label>
                                                        <input name="name" className="form-control" onChange={this.handleChange}
                                                            value={this.state.obj.name} type="text" disabled={this.state.status === 'display'} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row'>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="role_id" className="">نقش </label>
                                                    <Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.roles}
                                                        value={this.state.obj.role_id} onSelect={(values) => this.selectChange("role_id", values)}
                                                    />
                                                </div>
                                            </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label htmlFor="enabled" className="">غعال ؟</label>
                                                     
                                                        <input name="enabled" className="form-control1" onChange={this.handleChange}
                                                            checked={this.state.obj.enabled} type="checkbox" disabled={this.state.status === 'display'} />
                                                    </div>
                                                </div>
                                            </div>
                                            {this.state.status !== 'edit' &&<div className='row'>
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label htmlFor="password" className="">پسورد</label>

                                                        <input name="password" className="form-control" onChange={this.handleChange}
                                                            type="text" value={this.state.obj.password}/>

                                                    </div>
                                                </div>
                                            </div>}
                                             <input type="button" className="btn btn-primary" style={{ margin: "10px" }}
                                                onClick={this.saveBtnClick} value="ذخیره" />
                                            <input type="button" className="btn btn-outline-primary" style={{ margin: "10px" }} value="بستن" onClick={this.cancelBtnClick} />
                                            {this.state.status !== 'edit' &&<input type="button" value='پیشنهاد پسورد' className='btn btn-outline-info' onClick={this.genratePassword}></input>}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

}
export default User;