import React, { Component } from 'react';
import { getAllItem } from '../../api/index'
import Grid from '../../components/common/grid3';
import Loading from '../../components/common/loading';

class ReportWeb1 extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();                   

        this.state = {
            columns: [], rows: [],
            isFetching: true,
            selectedProvince:-100,
            selectedCycle: 211
        }

       
    }

    fetchData() {
        let columns = [
            { dataIndex: 'town',key: 'town', title: 'نام شهرک ',width:'120px' }, 
            { dataIndex: 'title',key: 'title', title: 'موضوع پیمان' , width:'500px'},
            { dataIndex: 'contract_no',key: 'contract_no', title: 'شماره پیمان', width:'120px' }, 
            { dataIndex: 'company',key: 'company', title: 'نام پیمانکار' ,width:'120px'},
            { dataIndex: 'initial_amount',key: 'initial_amount', title: 'مبلع اولیه پیمان' ,width:'120px', render: function (text) { return   text?parseInt(text).toLocaleString():0}},
            { dataIndex: 'contract_new_price',key: 'contract_new_price', title: 'مبلغ پیمان (با احتساب تغییر مقادیر)',width:'120px', render: function (text) { return   text?parseInt(text).toLocaleString():0 }  },
            { dataIndex: 'changeprecent',key: 'changeprecent', title: 'درصد تغیرات پیمان',width:'120px'}, 
            { dataIndex: 'max_invoice',key: 'max_invoice', title: 'شماره آخرین صورت وضعیت (تایید مدیر طرح)' ,width:'120px'},
            { dataIndex: 'end_date',key: 'end_date', title: 'تاریخ پایان کارکرد ' ,width:'120px'},
            { dataIndex: 'manager_price',key: 'manager_price', title: 'مبلغ تایید مدیر طرح ',width:'200px'},
            { dataIndex: 'letter_date_manager',key: 'letter_date_manager', title: 'تایخ نامه مدیر طرح' ,width:'120px'},
            { dataIndex: 'pishraft_phisical',key: 'pishraft_phisical', title: 'پیشرفت فیزیکی عملکرد' ,width:'150px'},
            { dataIndex: 'pishraft_mali',key: 'pishraft_mali', title: 'پیشرفت مالی تایید شده مدیر طرح' ,width:'120px'},
            ];
            let f1 = this.state.selectedCycle != -100 ? ` and (select  state_id from contract_cycle where contract_Id=con.id order by contract_cycle.id desc limit 1)=${this.state.selectedCycle}` : '';
            let f2 = this.state.selectedProvince != -100 ? ` and town.province_id =${this.state.selectedProvince}` : '';
            let f=f1+f2;
        Promise.all([getAllItem("Report/Webs", { reportId: 'Web_Invoice_Contractor', reportFilter: f }),
        getAllItem('BaseInfo/vw')]).then((response) => {
            let data = response[0].data;
            let cycles = response[1].data.filter(a => a.groupid === 23).map(a => { return { key: a.id, label: a.title, value: a.id } });
            cycles.push({ key: -100, label: 'همه موارد', value: -100 })
            let provinces = response[1].data.filter(a => a.groupid ===1).map(a => { return { key: a.id, label: a.title, value: a.id } });
            provinces.push({ key: -100, label: 'همه موارد', value: -100 })
            this.setState({
                isFetching: false, rows: data, columns, cycles,provinces
            });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        this.fetchData();
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
                                        خلاصه گزارش مالی
                                        </div>
                                       
                                    </div>
                                </div>
                                <div className="card-body">
                                <div style={{textAlign:'center',marginBottom: '20px'}}>
                                        <lable>چرخه عمر پیمان : </lable>
                                        <select value={this.state.selectedCycle} onChange={(e)=>{ this.setState({ selectedCycle: e.target.value })}}>
                                            {this.state.cycles.map((x) => <option key={x.key} value={x.value}>{x.label} </option>)}
                                        </select>
                                        <lable style={{marginRight: '15px'}}>استان : </lable>
                                        <select value={this.state.selectedProvince} onChange={(e)=>{ this.setState({ selectedProvince: e.target.value })}}>
                                            {this.state.provinces.map((x) => <option key={x.key} value={x.value}>{x.label} </option>)}
                                        </select>
                                        <input type="button" value="اعمال فیلتر" style={{marginRight: '13px',height: '35px'}} onClick={()=>{this.setState({ isFetching: true }); this.fetchData();}} />
                                    </div>
                                <Grid columns={this.state.columns} rows={this.state.rows} description="مبالغ به میلیون ریال میباشد">
                                       </Grid>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>

            )
        }
    }

}
export default ReportWeb1;