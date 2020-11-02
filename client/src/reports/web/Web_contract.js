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
            { dataIndex: 'town', key: 'town', title: 'نام شهرک', width: '120px' },
            { dataIndex: 'title', key: 'title', title: 'عنوان پیمان', width: '500px' },
            { dataIndex: 'contract_no', key: 'contract_no', title: 'شماره پیمان', width: '120px' },
            { dataIndex: 'contract_date', key: 'contract_date', title: 'تاریخ پیمان', width: '120px' },
            { dataIndex: 'contract_new_price', key: 'contract_new_price', title: 'مبلغ پیمان با احتساب تغیر مقادیر', width: '120px', render: function (text) { return text ? parseInt(text).toLocaleString() : 0 } },
            { dataIndex: 'company', key: 'company', title: 'پیمانکار', width: '120px' },
            { dataIndex: 'state_id', key: 'state_id', title: 'وضعیت', width: '120px' },
            { dataIndex: 'con_land_delivery_date', key: 'con_land_delivery_date', title: 'تاریخ تحویل زمین', width: '120px' },
            { dataIndex: 'ex_total_duration', key: 'ex_total_duration', title: 'مدت پیمان با احتساب تمدید', width: '120px' },
            { dataIndex: 'ex_end_date', key: 'ex_end_date', title: 'تاریخ پایان پیمان', width: '120px' },
            { dataIndex: 'pishraft_phisical', key: 'pishraft_phisical', title: 'پیشرفت فیزیکی ', width: '120px' },
            { dataIndex: 'pishraft_mali', key: 'pishraft_mali', title: 'پیشرفت مالی ', width: '120px' },
            { dataIndex: 'monitoring_agreement', key: 'monitoring_agreement', title: 'شرکت ناظر', width: '200px' },
            { dataIndex: 'ag_contract_no', key: 'ag_contract_no', title: 'شماره قرارداد', width: '120px' },
            { dataIndex: 'ag_contract_date', key: 'ag_contract_date', title: 'تاریخ قرارداد', width: '120px' },
            { dataIndex: 'agex_end_date', key: 'agex_end_date', title: 'تاریخ پایان قرارداد', width: '120px' },
            { dataIndex: 'study_agreement_id', key: 'study_agreement_id', title: 'شرکت طراح', width: '120px' },

        ];
        let f = this.state.selectedCycle != -100 ? `where (select  state_id  from  contract_cycle  where contract_Id=con.id order by date desc limit 1)=${this.state.selectedCycle}` : '';
        // let par=id!=-100?['*sid*',id]:[]
        // Promise.all([getAllItem("Report/Webs", { reportId: 'Web_contract',reportParmas:[par] }),
        Promise.all([getAllItem("Report/Webs", { reportId: 'Web_contract', reportFilter: f }),
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
                                            شناسنامه پروژه
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