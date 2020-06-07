import React, { Component } from 'react';
import { getItem,  getAllItem,  upsertItem } from '../../../api/index';
import { message, Select } from 'antd'
import Loading from '../../../components/common/loading';
import NumberFormat from 'react-number-format';
import { columns, storeIndex, pageHeder, emptyItem } from './statics'
import { successDuration, successMessage, errorMessage, errorDuration, selectDefaultProp, numberDefaultProp
} from '../../../components/statics'

class WBS extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: columns, rows: [],
            contracts: [], units: [], opGroups: [], operations: [],
            contract_id: '', opGroup_id: '',
            isFetching: true, obj: { ...emptyItem }, showPanel: false, status: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.newClickHandle = this.newClickHandle.bind(this);
        this.showTable = this.showTable.bind(this);
        this.newRangeClickHandle = this.newRangeClickHandle.bind(this);
        this.numberChange = this.numberChange.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
        this.saveBtnClick = this.saveBtnClick.bind(this);
        this.cancelBtnClick = this.cancelBtnClick.bind(this);
    }

    fetchData() {
        Promise.all([getAllItem('contract'), getAllItem('BaseInfo'), getAllItem('operation')]).then((response) => {
            //    response[0].data.forEach(a => console.log(a.contract_no + ' - ' + a.company));
            let units = response[1].data.filter(a => a.groupid === 11).map(a => { return { key: a.id, label: a.title, value: a.id } })
            let opGroups = response[1].data.filter(a => a.groupid === 12).map(a => { return { key: a.id, label: a.title, value: a.id } })
            let contracts = response[0].data.map(a => { return { key: a.id, label: a.contract_no + ' - ' + a.company, value: a.id } })
            let operations = response[2].data.map(a => { return { key: a.id, label: a.title, value: a.id } })
            this.setState({ isFetching: false, contracts, units, opGroups, operations });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
    }

    saveBtnClick() {
        let rows = this.state.rows;
        console.log(rows)
        // if (rows.length === 0)
        //  alert('انتخاب حداقل یک ردیف الزامیست')
        //else {
        let sum = 0;
        let errorRows=[];
        rows.forEach((r,i) => {
            sum += parseInt(r.price_change);
            if (!r.unit_id&&errorRows.indexOf(i+1)<0)errorRows.push(i+1);
            else if (!r.operation_id&&errorRows.indexOf(i+1)<0)errorRows.push(i+1);
            else if (!r.price&&errorRows.indexOf(i+1)<0)errorRows.push(i+1);
            else if (!r.price_change&&errorRows.indexOf(i+1)<0)errorRows.push(i+1);
            else if (!r.sort&&errorRows.indexOf(i+1)<0)errorRows.push(i+1);
            else if (!r.value&&errorRows.indexOf(i+1)<0)errorRows.push(i+1);
            else if (!r.value_change&&errorRows.indexOf(i+1)<0)errorRows.push(i+1);
        });
        //  console.log(sum);
        if (errorRows.length>0) {
           alert('لطفا ستون های الزامی را وارد کنید . ردیف های '+errorRows.toString())
        }
        else {
            rows.forEach(r => {
                r.user_id = JSON.parse(localStorage.getItem('user')).id;
                r.contract_id = this.state.contract_id;
                r.price_diff = (r.price_change - r.price);
                r.value_diff = (r.value_change - r.value);
                r.wieght = (r.price_change / sum * 100).toFixed(2);
            });
            // }
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
        rows.push({...emptyItem});
        this.setState({ rows });

    }
    deleteRecord(e, i) {
        debugger;
        let rows = this.state.rows;
        rows.splice(i, 1);
        this.setState({ rows });
    }
    numberChange(name, values,i) {
        const {formattedValue, value} = values;
         let rows = this.state.rows;
        rows[i][name] = value;
        this.setState({ rows });
 }
	
    newRangeClickHandle() {
        this.setState({ isFetching: true });
        let opGroup_id = this.state.opGroup_id ? this.state.opGroup_id : 0;
        getItem(opGroup_id, 'operation').then(response => {

            let rows = this.state.rows;
            response.data.forEach(e => {
                rows.push({
                    operation_id: e.id, unit_id: e.unit_id,
                    //  operation: e.title, unit: e.unit,
                    value: '', value_change: '', value_diff: '',
                    price: '', price_change: '', price_diff: '',
                    wieght: '', sort: e.sort
                })
            });
            this.setState({ isFetching: false, rows });
        }).catch((error) => console.log(error))




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
                                        <div className="col-5">
                                            <div className="form-group">
                                                <label htmlFor="contract_id" className="">پیمان</label>
                                                <Select {...selectDefaultProp} options={this.state.contracts} disabled={this.state.status === 'display'}
                                                    value={this.state.contract_id} onSelect={(value) => this.setState({ contract_id: value })}
                                                />

                                            </div>  </div>
                                        <div className="col-1">
                                            <button className="botton-custom" onClick={this.showTable} >نمایش  <i className="far fa-money-check-edit"></i></button>
                                        </div>
                                        {this.state.showPanel &&
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
                                            </div>}
                                    </div>


                                    {this.state.showPanel &&
                                        <div className='row'>
                                            <div className='col'>
                                                <table className='table table-striped table-bordered'>
                                                    <thead>
                                                        <tr>
                                                            <th>شرح فعالیت</th>
                                                            <th>واحد</th>
                                                            <th>مقدار بر اساس قرارداد</th>
                                                            <th>مقدار بر اساس تغییرات مقادیر</th>
                                                            <th>حذف / اضافه</th>
                                                            <th>مبلغ اولیه</th>
                                                            <th>مبلغ بر اساس تغییر مقادیر</th>
                                                            <th>حذف / اضافه</th>
                                                            <th>درصد وزنی</th>
                                                            <th>ترتیب</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.rows.map((item, i) => {
                                                            return <tr key={i} >
                                                                <td style={{ width: '230px' }}><Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.operations}
                                                                    value={item.operation_id} onSelect={(values) => this.selectChange("operation_id", values, i)} />
                                                                </td>
                                                                <td style={{ width: '120px' }}><Select  {...selectDefaultProp} disabled={this.state.status === 'display'} options={this.state.units}
                                                                    value={item.unit_id} onSelect={(values) => this.selectChange("unit_id", values, i)} /></td>
                                                                <td><input name="value" className="form-control" onChange={(e) => this.handleChange(e, i)}
                                                                    value={item.value} type='number' required /></td>
                                                                <td><input name="value_change" className="form-control" onChange={(e) => this.handleChange(e, i)}
                                                                    value={item.value_change} type='number' /></td>
                                                                <td>{/*<input name="value_diff" className="form-control" onChange={(e)=>this.handleChange(e,i)}
                                                                    value={(item.value_change-item.value)} type='number' /> */}
                                                                    {(item.value_change - item.value)}

                                                                </td>
                                                                <td>
                                                                    {/* <input name="price" className="form-control" onChange={(e) => this.handleChange(e, i)}
                                                                    value={(item.price)} type='number' /> */}
                                                                       <NumberFormat  onValueChange={(values) =>this.numberChange("price",values,i)} 
                                                       {...numberDefaultProp} disabled={this.state.status === 'display'}  value={item.price}/>
                                                                    </td>
                                                                <td>
                                                                    {/* <input name="price_change" className="form-control" onChange={(e) => this.handleChange(e, i)}
                                                                    value={(item.price_change)} type='number' /> */}
                                                                       <NumberFormat  onValueChange={(values) =>this.numberChange("price_change",values,i)} 
                                                       {...numberDefaultProp} disabled={this.state.status === 'display'}  value={item.price_change}/>
                                                                    </td>
                                                                <td>{/* <input name="price_diff" className="form-control" onChange={(e)=>this.handleChange(e,i)}
                                                                    value={(item.price_change-item.price)} type='number' disabled={true}/> */}
                                                                    {(item.price_change - item.price).toLocaleString()}
                                                                </td>
                                                                <td>{item.wieght}</td>
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
export default WBS;