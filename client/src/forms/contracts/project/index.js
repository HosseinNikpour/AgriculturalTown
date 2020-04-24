import React, { Component } from 'react';
import { message, Select } from 'antd';
import { saveItem, getAllItem, removeItem, updateItem } from '../../../api/index'

import Grid from '../../../components/common/grid3';
import Loading from '../../../components/common/loading';
import { columns, storeIndex, pageHeder, types, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage, errorDuration, selectDefaultProp } from '../../../components/statics'


class Project extends Component {
    constructor(props) {
        super(props);
        //  this.formRef = React.createRef();
        //  this.gridRef = React.createRef();

        this.state = {
            columns: columns, rows: [], towns: [],
            isFetching: true, obj: emptyItem, isEdit: false, showPanel: false
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

    scrollToFormRef = () => window.scrollTo({ top: 0, behavior: 'smooth', })
    fetchData() {
        Promise.all([getAllItem(storeIndex), getAllItem("town")]).then((response) => {
            let towns = response[1].data.map(a => { return { key: a.id, label: a.title, value: a.id } });
            this.setState({ isFetching: false, rows: response[0].data, towns: towns });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }

    saveBtnClick() {
        let obj = this.state.obj;

        console.log(obj)
        if (this.state.status === 'new')
            saveItem(obj, storeIndex).then((response) => {
                // console.log('new save res', response);
                if (response.statusText === "OK") {
                    message.success(successMessage, successDuration);
                    this.fetchData();
                }
                else {
                    message.error(errorMessage, errorDuration);
                    console.log('error : ', response);
                }
            }).catch((error) => { console.log(error); message.error(errorMessage, errorDuration); });
        else {
            updateItem(obj, storeIndex).then((response) => {
                //console.log('new save res', response);
                if (response.statusText === "OK") {
                    message.success(successMessage, successDuration);
                    this.fetchData();
                }

                else {
                    message.error(errorMessage, errorDuration);
                    console.log('error : ', response);
                }
            }).catch((error) => { console.log(error); message.error(errorMessage, errorDuration); });
        }
        this.setState({ obj: emptyItem, isEdit: false, showPanel: false });

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
        this.setState({ obj: item, status: 'edit', showPanel: true }, this.scrollToFormRef);
        // console.log(item);
    }
    displayClickHandle(item) {
        this.setState({ obj: item, status: 'display', showPanel: true }, this.scrollToFormRef);
        // console.log(item);
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
        this.setState({ showPanel: true, status: 'new' });

    }
    cancelBtnClick() {
        this.setState({ obj: emptyItem, status: '', showPanel: false });
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
                                        displayClick={this.displayClickHandle}
                                        deleteClick={this.deleteClickHandle}></Grid>
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
                                                        <label htmlFor="title" className="">عنوان</label>
                                                        <input name="title" className="form-control" onChange={this.handleChange}
                                                            value={this.state.obj.title} disabled={this.state.status === 'display'} />
                                                    </div>
                                                </div>
                                            </div><div className="row">
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label htmlFor="full_title" className="">نام کامل</label>
                                                        <input name="full_title" className="form-control" onChange={this.handleChange}
                                                            value={this.state.obj.title} disabled={this.state.status === 'display'} />
                                                    </div>
                                                </div>
                                            </div><div className="row">
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label htmlFor="town_id" className="">شهرک</label>
                                                        <Select {...selectDefaultProp} options={this.state.towns} disabled={this.state.status === 'display'}
                                                            value={this.state.obj.town_id} onSelect={(values) => this.selectChange("town_id", values)}
                                                        />
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
export default Project;