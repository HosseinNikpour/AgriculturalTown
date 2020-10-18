import React, { Component } from 'react';
import { getAllItem } from '../../api/index'
import Grid from '../../components/common/grid3';
import Loading from '../../components/common/loading';
import DatePicker from 'react-datepicker2';
import moment from 'moment-jalaali';

const datePickerDefaultProp = {
    placeholder: "انتخاب تاریخ", className:'form-control display-inline',
    format: "jYYYY/jMM/jDD", timePicker: false, isGregorian: false,
}
class ReportWeb1 extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();                   

        this.state = {
            columns: [], rows: [],
            isFetching: true,
            selectedType:-100,
        }

       
    }

    fetchData() {
        let columns = [
            {dataIndex: 'title',key: 'title', title: 'عنوان',width:'500px' }, 
            {dataIndex: 'province',key: 'province', title: 'استان',width:'120px' }, 
            {dataIndex: 'town',key: 'town', title: 'نام شهرک ',width:'120px' }, 
            {dataIndex: 'service_type',key: 'service_type', title: 'نوع خدمات',width:'120px' }, 
            {dataIndex: 'tender_no',key: 'tender_no', title: 'شماره مناقصه',width:'120px' }, 
            {dataIndex: 'commission_date',key: 'commission_date', title: 'تاریخ تشکیل کمیسیون',width:'120px' }, 
            {dataIndex: 'commission_result',key: 'commission_result', title: 'نتیجه کمیسیون',width:'150px' }, 
            {dataIndex: 'first_winner_name',key: 'first_winner_name', title: 'نام شرکت برنده اول',width:'120px' }, 
            {dataIndex: 'winner_letter_date',key: 'winner_letter_date', title: 'تاریخ ابلاغ برنده',width:'120px' }, 
            {dataIndex: 'winner_letter_no',key: 'winner_letter_no', title: 'شماره نامه ابلاغ برنده',width:'120px' }, 
            {dataIndex: 'contract_date',key: 'contract_date', title: 'تاریخ پیمان',width:'120px' }, 
            {dataIndex: 'contract_no',key: 'contract_no', title: 'شماره پیمان/قرارداد',width:'120px' },
            {dataIndex: 'compuny',key: 'compuny', title: 'نام شرکت ',width:'120px' },  
            {dataIndex: 'initial_amount',key: 'initial_amount', title: 'مبلغ پیمان/قرارداد',width:'120px', render: function (text) { return   text?parseInt(text).toLocaleString():0 }  }, 
            {dataIndex: 'file_record',key: 'file_record', title: 'صورتجلسه کمیسیون',width:'120px' ,render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
            {dataIndex: 'commission_to_winner',key: 'commission_to_winner', title: 'مدت زمان از تاریخ تشکیل کمیسون تا تاریخ ابلاغ برنده',width:'120px' }, 
            {dataIndex: 'winner_to_signification',key: 'winner_to_signification', title: 'مدت زمان از تاریخ ابلاغ برنده تا تاریخ ابلاغ قرارداد',width:'120px' }, 
            
            ];
        //    console.log(this.state.startDate);

  // console.log(this.state.startDates.format('YYYY-MM-DD'))
        let f = this.state.selectedType != -100 ? ` and tn.service_type_id=${this.state.selectedType}` : '';
            f+= this.state.startDate  ? ` and commission_date >= '${this.state.startDate.format('YYYY-MM-DD')}'` : '';
            f+= this.state.endDate  ? ` and commission_date <= '${this.state.endDate.format('YYYY-MM-DD')}'` : '';
        Promise.all([getAllItem("Report/Webs", { reportId: 'Web_tender', reportFilter: f }),
        getAllItem('BaseInfo/vw')]).then((response) => {
            let data = response[0].data;
            let types = response[1].data.filter(a => a.groupid === 26).map(a => { return { key: a.id, label: a.title, value: a.id } });
            types.push({ key: -100, label: 'همه موارد', value: -100 })
            this.setState({
                isFetching: false, rows: data, columns, types,
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
                                      مناقصه
                                        </div>                                     
                                    </div>
                                </div>
                                <div className="card-body">
                                <div id='hnDiv' style={{textAlign:'center',marginBottom: '20px'}}>
                                        <lable>نوع خدمات : </lable>
                                        <select value={this.state.selectedType} onChange={(e)=>{ this.setState({ selectedType: e.target.value })}}>
                                            {this.state.types.map((x) => <option key={x.key} value={x.value}>{x.label} </option>)}
                                        </select>
                                        <lable style={{marginRight: '15px'}}>تاریخ شروع : </lable>
                                        <DatePicker onChange={value => this.setState({ startDate: value })} value={this.state.startDate }
                                                     {...datePickerDefaultProp} style={{display: 'inline-block'}}/>
                                                      <lable style={{marginRight: '15px'}}>تاریخ پایان : </lable>
                                        <DatePicker onChange={value => this.setState({ endDate: value })} value={this.state.endDate }
                                                     {...datePickerDefaultProp} style={{display: 'inline-block'}}/>
                                        <input type="button" value="اعمال فیلتر" style={{marginRight: '13px',height: '35px'}} onClick={()=>{this.setState({ isFetching: true }); this.fetchData();}} />
                                    </div>

                                <Grid columns={this.state.columns} rows={this.state.rows} >
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