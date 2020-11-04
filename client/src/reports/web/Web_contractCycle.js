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
            {dataIndex: 'town',key: 'town', title: 'نام شهرک ',width:'120px' }, 
            {dataIndex: 'title',key: 'title', title: 'عنوان پیمان',width:'500px' }, 
            {dataIndex: 'contract_no',key: 'contract_no', title: 'شماره پیمان',width:'120px' }, 
            {dataIndex: 'company',key: 'company', title: 'شرکت ',width:'200px' }, 
            {dataIndex: 'status_title',key: 'status_title', title: 'چرخه پیمان',width:'120px' }, 
            {dataIndex: 'duration',key: 'duration', title: 'مدت پیمان(روز)',width:'120px' }, 
            {dataIndex: 'ex_total_duration',key: 'ex_total_duration', title: 'جمع مدت قرارداد و تمدید ',width:'120px' }, 
            {dataIndex: 'announcement_date',key: 'announcement_date', title: 'تاریخ ابلاغ قرارداد',width:'120px' }, 
            {dataIndex: 'announcement_to_land_delivery',key: 'announcement_to_land_delivery', title: 'مدت زمان از تاریخ ابلاغ تا صورتجسله تحویل زمین',width:'120px' ,render(text, record) {
                return {
                  props: {
                    style: { background: parseInt(text) >7 ? "red":'green' }
                  },
                  children: <div>{text}</div>
                };
              }}, 
            {dataIndex: 'land_delivery',key: 'land_delivery', title: 'تاریخ تحویل زمین',width:'120px' }, 
            {dataIndex: 'pishraft_phisical',key: 'pishraft_phisical', title: 'پیشرفت فیزیکی (تاکنون)',width:'120px' }, 
            {dataIndex: 're',key: 're', title: 'مدت زمان باقی مانده تا پایان قرارداد',width:'120px' },  
            {dataIndex: 'ex_end_date',key: 'ex_end_date', title: 'تاریخ پایان با احتساب مدت تمدید شده',width:'120px' }, 
            {dataIndex: 'rh',key: 'rh', title: 'مدت زمان سپری شده برای تشکیل کمیسیون تحویل موقت از تاریخ پایان قرارداد',width:'120px' }, 
            {dataIndex: 'td_commision_date',key: 'td_commision_date', title: 'تاریخ صورتجلسه تحویل موقت',width:'120px' }, 
           // {dataIndex: '',key: '', title: 'مدت زمان تا پایان دوره تضمین',width:'120px' }, 
            {dataIndex: 'tm_commision_date',key: 'tm_commision_date', title: 'تاریخ صورتجلسه تحویل قطعی',width:'120px' }, 
            ];

            let f = this.state.selectedCycle != -100 ? `where   cc.state_id=${this.state.selectedCycle}` : '';

        Promise.all([getAllItem("Report/Webs", { reportId: 'Web_contractCycle', reportFilter: f }),
        getAllItem('BaseInfo/vw')]).then((response) => {
            let data = response[0].data.map((a,i)=>({...a,id:i}));
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
                                        چرخه عمر پروژه
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
                                <Grid columns={this.state.columns} rows={this.state.rows} /*description="مبالغ به میلیون ریال می باشد"*/>
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