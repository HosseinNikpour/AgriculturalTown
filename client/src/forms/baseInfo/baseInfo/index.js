import React, { Component } from 'react';
import { message } from 'antd';
import { saveItem, getAllItem, removeItem, updateItem } from '../../../api/index'

import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder, types, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage,errorMessageDuplicate, errorDuration } from '../../../components/statics'


class BaseInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: columns, data: [], rows: [], type: 1, isFetching: true, obj: {...emptyItem}, isEdit: false, showPanel: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.typeChange = this.typeChange.bind(this);
        this.newClickHandle = this.newClickHandle.bind(this);
        this.editClickHandle = this.editClickHandle.bind(this);
        this.deleteClickHandle = this.deleteClickHandle.bind(this);
        this.displayClickHandle = this.displayClickHandle.bind(this);
        this.saveBtnClick = this.saveBtnClick.bind(this);
        this.cancelBtnClick = this.cancelBtnClick.bind(this);
    }

    scrollToFormRef = () => window.scrollTo({ top: 0, behavior: 'smooth', })
    fetchData() {
        getAllItem(storeIndex).then((response) => {
            let data = response.data;
            this.setState({ data: data, isFetching: false, rows: data.filter(a => a.groupid == this.state.type) 
                , obj: {...emptyItem},  showPanel: false,status: ''});
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }

    saveBtnClick() {
        let obj = this.state.obj;
        obj.groupid = this.state.type;
        console.log(obj)
        if (this.state.status === 'new')
            saveItem(obj, storeIndex).then((response) => {
                // console.log('new save res', response);
                if (response.data.type !== "Error") {
                    message.success(successMessage, successDuration);
                    this.fetchData();
                  //  this.setState({ obj: emptyItem, isEdit: false, showPanel: false });
                }
                else {
                    if(response.data.message.indexOf('duplicate key value violates unique constraint')>-1)
                    message.error(errorMessageDuplicate, errorDuration);
                    else{
                        message.error(errorMessage, errorDuration);
                        console.log('error : ', response);
                    }
                }
            }).catch((error) => {console.log(error);  message.error(errorMessage, errorDuration);});
        else {
            updateItem(obj, storeIndex).then((response) => {
                //console.log('new save res', response);
                if (response.data.type !== "Error") {
                    message.success(successMessage, successDuration);
                    this.fetchData();
                  //  this.setState({ obj: emptyItem, isEdit: false, showPanel: false });
                }

                else {
                    if(response.data.message.indexOf('duplicate key value violates unique constraint')>-1)
                    message.error(errorMessageDuplicate, errorDuration);
                    else{
                        message.error(errorMessage, errorDuration);
                        console.log('error : ', response);
                    }
                }
            }).catch((error) => {console.log(error);  message.error(errorMessage, errorDuration);});
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
    typeChange(event) {
        let index = event.nativeEvent.target.selectedIndex;
        let value = event.nativeEvent.target[index].value;
        let data = this.state.data;
        let rr = data.filter(a => a.groupid == value);
        this.setState({ rows: rr, type: value })
    }
    editClickHandle(item) {
        this.setState({ obj: item, status: 'edit', showPanel: true }, this.scrollToFormRef);
        // console.log(item);
    }
    displayClickHandle(item) {
        this.setState({ obj: item, status: 'display', showPanel: true }, this.scrollToFormRef);
        // console.log(item);
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
        this.setState({ showPanel: true, status: 'new' });

    }
    cancelBtnClick() {
        this.setState({ obj: {...emptyItem}, status: '', showPanel: false });
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
                        <div className="col-6">
                            <div className="card">
                                <div className="card-header">
                                    <div className='row'>
                                        <div className='col'>
                                            {pageHeder}
                                        </div>
                                        <div className='col-5 ml-auto'>
                                            <select className="form-control" onChange={this.typeChange} style={{ 'width': '200px', marginLeft: '30px' }} >
                                                {types.map(a => <option key={a.value} value={a.value}>{a.label} </option>)}
                                            </select>
                                        </div><div className='col-1'>
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
                        <div className='col-6'>
                            <div className={this.state.showPanel ? '' : 'hidden'}>
                                <div className="card">
                                    <div className="card-header">
                                        {this.state.status === 'new' ? 'اضافه کردن آیتم جدید' : this.state.status === 'edit' ? 'ویرایش آیتم' : 'مشاهده آیتم'}
                                    </div>
                                    <div className="card-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-9">
                                                    <div className="form-group">
                                                        <label htmlFor="title" className="">عنوان</label>
                                                        <input name="title" className="form-control" onChange={this.handleChange}
                                                            value={this.state.obj.title} disabled={this.state.status === 'display'} />
                                                    </div>
                                                </div>
                                                <div className="col-3">
                                                    <div className="form-group">
                                                        <label htmlFor="sort" className="">ترتیب</label>
                                                        <input name="sort" className="form-control" onChange={this.handleChange}
                                                            value={this.state.obj.sort} type="number" disabled={this.state.status === 'display'} />
                                                    </div>
                                                </div>
                                            </div>
                                            {this.state.status !== 'display' && <input type="button" className="btn btn-primary" style={{ margin: "10px" }}
                                                onClick={this.saveBtnClick} value="ذخیره" />}
                                            <input type="button" className="btn btn-outline-primary" style={{ margin: "10px" }} value="بستن" onClick={this.cancelBtnClick} />
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
export default BaseInfo;