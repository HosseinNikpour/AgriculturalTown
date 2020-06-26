import React, { Component } from 'react';
import { getItem, getAllItem, upsertItem } from '../../../api/index';
import { message, Select } from 'antd'
import Loading from '../../../components/common/loading';

import { columns, storeIndex, pageHeder, emptyItem } from './statics'
import {successDuration, successMessage, errorMessage, errorDuration, selectDefaultProp} from '../../../components/statics'

class studyWbs extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, rows: [],
            contracts: [],  operations: [], contract_id: '',
            isFetching: true, obj: { ...emptyItem }, showPanel: false, status: '', contractTitle: "",
        }

        this.handleChange = this.handleChange.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.newClickHandle = this.newClickHandle.bind(this);
        this.showTable = this.showTable.bind(this);
      //  this.newRangeClickHandle = this.newRangeClickHandle.bind(this);
        this.numberChange = this.numberChange.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
        this.saveBtnClick = this.saveBtnClick.bind(this);
        this.cancelBtnClick = this.cancelBtnClick.bind(this);
    }

    fetchData() {
        Promise.all([getAllItem('agreement/vw'), getAllItem('operation')]).then((response) => {
                   
            let contracts = response[0].data.map(a => { return { key: a.id, label: a.contract_no + ' - ' + a.company, value: a.id, title: a.title } });
            let operations = response[1].data.filter(a=>a.category_id===200).map(a => { return { key: a.id, label: a.title, value: a.id } })
            this.setState({ isFetching: false, contracts, operations });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }

    saveBtnClick() {
        let rows = this.state.rows;
        //
       // let sum = 0;
        let errorRows = [];
        rows.forEach((r, i) => {
            r.contract_id = this.state.contract_id;
         if (!r.operation_id && errorRows.indexOf(i + 1) < 0) errorRows.push(i + 1);
            else if (!r.weight && errorRows.indexOf(i + 1) < 0) errorRows.push(i + 1);
        
        });
       
        if (errorRows.length > 0) {
            alert('لطفا ستون های الزامی را وارد کنید . ردیف های ' + errorRows.toString())
        }
        else {
           
            upsertItem({ rows: rows }, storeIndex).then((response) => {
                if (response.data.type !== "Error") {
                    message.success(successMessage, successDuration);
                    this.setState({ rows });
                }
                else {
                    message.error(errorMessage, errorDuration);
                    console.log('error : ', response);
                }
            }).catch((error) => console.log(error));
        }
    }
    handleChange(e, i) {
        //debugger;
        let rows = this.state.rows;
        rows[i][e.target.name] = e.target.value;
        this.setState({ rows });
    }
    selectChangeContract(value) {

        let cont = this.state.contracts.find(a => a.key == value);
        let contractTitle = cont && cont.title ? cont.title : '';
        this.setState({ contract_id: value, contractTitle });
    }
    selectChange(name, values, i) {
        let rows = this.state.rows;
        rows[i][name] = values;

        this.setState({ rows });
    }
    showTable() {
        if (!this.state.contract_id)
            alert('لطفا قرارداد را انتخاب کنید')
        else {
            this.setState({ isFetching: true });
            // console.log(this.state.contract_id);
            getItem(this.state.contract_id, storeIndex).then(response => {
                this.setState({ isFetching: false, rows: response.data, showPanel: true });
            }).catch((error) => console.log(error))
        }
    }
    cancelBtnClick() {
        this.setState({ rows: [], showPanel: false });
    }
    newClickHandle() {
        let rows = this.state.rows;
        rows.push({ ...emptyItem });
        this.setState({ rows });

    }
    deleteRecord(e, i) {
      
        let rows = this.state.rows;
        rows.splice(i, 1);
        this.setState({ rows });
    }
    numberChange(name, values, i) {
        const { formattedValue, value } = values;
        let rows = this.state.rows;
        rows[i][name] = value;
        this.setState({ rows });
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

                                    </div>
                                </div>

                                <div className="card-body">

                                    <div className="row">
                                        <div className="col-4">
                                            <div className="form-group">
                                                <label htmlFor="contract_id" className="">قرارداد</label>
                                                <Select {...selectDefaultProp} options={this.state.contracts} disabled={this.state.status === 'display'}
                                                    value={this.state.contract_id} onSelect={(value) => this.selectChangeContract(value)}
                                                />
                                            </div> 
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="project_id" className="">نام قرارداد</label>
                                                <label className="form-control">{this.state.contractTitle}</label>
                                            </div>
                                        </div>
                                        <div className="col-1">
                                            <button className="botton-custom" onClick={this.showTable} >نمایش  <i className="far fa-money-check-edit"></i></button>
                                        </div>
                                        {/* {this.state.showPanel &&
                                            <div className='col-5' style={{ padding: '39px 0px 0px 0px', marginLeft: '20px' }} >
                                                <div className="col-8 " style={{ float: 'right' }} >
                                                    <i className="fa fa-plus-circle add-button" onClick={() => this.setState({ showSelect: true })}></i>
                                                    <Select {...selectDefaultProp} options={this.state.opGroups}
                                                        onSelect={(values) => this.setState({ opGroup_id: values })}
                                                    />
                                                </div>
                                                <div className="col-4" style={{ float: 'right', marginRight: '-21px' }}  >
                                                    <button style={{ fontSize: '17px' }} className="botton" onClick={this.newRangeClickHandle} >درج ردیف ها  <i className="far fa-file-import"></i></button>
                                                </div>
                                            </div>} */}

                                    </div>
                                   

                                    {this.state.showPanel &&
                                        <div className='row'>
                                            <div className='col'>
                                                <table className='table table-striped table-bordered'>
                                                    <thead>
                                                        <tr>
                                                            <th>رئوس خدمات</th>
                                                            
                                                            <th> وزن نهایی</th>
                                                            <th>ترتیب</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.rows.map((item, i) => {
                                                            return <tr key={i} >
                                                                <td style={{ width: '40%' }}><Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.operations}
                                                                    value={item.operation_id} onSelect={(values) => this.selectChange("operation_id", values, i)} />
                                                                </td>
                                                              
                                                                <td><input name="weight" className="form-control" onChange={(e) => this.handleChange(e, i)}
                                                                    value={(item.weight)} type='number' /></td>
                                                                <td><input name="sort" className="form-control" onChange={(e) => this.handleChange(e, i)}
                                                                    value={(item.sort)} type='number' /></td>
                                                                <td>

                                                                    <i className="far fa-trash-alt" onClick={(e) => this.deleteRecord(e, i)}></i>
                                                                </td>
                                                            </tr>
                                                        })}

                                                    </tbody>
                                                </table>
                                                <div className='col-1  ml-auto'>
                                                    <i className="fa fa-plus-circle add-button" onClick={this.newClickHandle}></i>
                                                </div>
                                                {this.state.status !== 'display' && <input type="button" className="btn btn-primary" style={{ margin: "10px" }} onClick={this.saveBtnClick} value="ذخیره" />}
                                                <input type="button" className="btn btn-outline-primary" style={{ margin: "10px" }} value="بستن" onClick={this.cancelBtnClick} />
                                            </div>
                                        </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            )
        }
    }

}
export default studyWbs;