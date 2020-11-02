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
            selectedCycle: 211
        }

       
    }

    fetchData() {
        let columns = [
            { dataIndex: 'town',key: 'town', title: 'نام شهرک ',width:'120px' }, 
            {dataIndex: 'title',key: 'title', title: 'عنوان پیمان' ,width:'300px' }, 
            {dataIndex: 'contract_no',key: 'contract_no', title: 'شماره پیمان' ,width:'120px' }, 
            {dataIndex: 'company',key: 'company', title: 'شرکت' ,width:'200px' }, 
            {dataIndex: 'land_delivery_date',key: 'land_delivery_date', title: 'تاریخ تحویل زمین' ,width:'120px' }, 
            {dataIndex: 'end_date',key: 'end_date', title: 'تاریخ اتمام اولیه' ,width:'120px' }, 
            {dataIndex: 'date_end_extension',key: 'date_end_extension', title: 'تاریخ پایان با احتساب تمدیدها' ,width:'120px' }, 
            {dataIndex: 'fund',key: 'fund', title: 'سرمایه بیمه شده ' ,width:'150px', render: function (text) { return   text?parseInt(text).toLocaleString():0 }  },
            {dataIndex: 'ins_start_date',key: 'ins_start_date', title: 'تاریخ شروع بیمه نامه' ,width:'120px' }, 	  
            {dataIndex: 'ins_end_date',key: 'ins_end_date', title: 'تاریخ پایان بیمه نامه' ,width:'120px' }, 
            {dataIndex: 'insapp_start_date',key: 'insapp_start_date', title: 'تاریخ شروع الحاقیه' ,width:'120px'}, 
            {dataIndex: 'insapp_end_date',key: 'insapp_end_date', title: 'تاریخ پایان الحاقیه' ,width:'120px' }, 
            {dataIndex: 'date_expire',key: 'date_expire', title: 'تاریخ انقضا بیمه' ,width:'120px' }, 
            {dataIndex: 'time_to_expire',key: 'time_to_expire', title: 'مدت زمان باقی مانده تا انقضا بیمه' ,width:'120px' ,render(text, record) {
                return {
                  props: {
                    style: { background: parseInt(text) >0 ? "green":parseInt(text) <0 ?"red":'white' }
                  },
                  children: <div>{text}</div>
                };
              }}, 
            ];
      
        let f = this.state.selectedCycle != -100 ? `where (select  state_id  from  contract_cycle  where contract_Id=con.id order by date desc limit 1)=${this.state.selectedCycle}` : '';

        Promise.all([getAllItem("Report/Webs", { reportId: 'Web_insurance', reportFilter: f }),
        getAllItem('BaseInfo/vw')]).then((response) => {
            let data = response[0].data;
            let cycles = response[1].data.filter(a => a.groupid === 23).map(a => { return { key: a.id, label: a.title, value: a.id } });
            cycles.push({ key: -100, label: 'همه موارد', value: -100 })
            this.setState({
                isFetching: false, rows: data, columns, cycles,
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
                                        بیمه
                                        </div>
                                       
                                    </div>
                                </div>
                                <div className="card-body">
                                <div style={{textAlign:'center',marginBottom: '20px'}}>
                                        <lable>چرخه عمر پیمان : </lable>
                                        <select value={this.state.selectedCycle} onChange={(e)=>{ this.setState({ selectedCycle: e.target.value })}}>
                                            {this.state.cycles.map((x) => <option key={x.key} value={x.value}>{x.label} </option>)}
                                        </select>
                                        <input type="button" value="اعمال فیلتر" style={{marginRight: '13px',height: '35px'}} onClick={()=>{this.setState({ isFetching: true }); this.fetchData();}} />
                                    </div>
                                <Grid columns={this.state.columns} rows={this.state.rows} description="مبالغ به میلیون ریال می باشد">
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