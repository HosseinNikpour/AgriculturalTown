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
        }

       
    }

    fetchData() {
        let columns = [
            { dataIndex: 'town',key: 'town', title: 'نام شهرک ' ,width:'100px' }, 
            { dataIndex: 'title',key: 'title', title: 'نام پروژه' ,width:'500px' },
            { dataIndex: 'contract_no',key: 'contract_no', title: 'شماره قرارداد' ,width:'120px' }, 
            { dataIndex: 'company',key: 'company', title: 'نام مشاور' ,width:'120px' },
			{ dataIndex: 'pishraft_phisical',key: 'pishraft_phisical', title: 'پیشرفت فیزیکی پروژه' ,width:'120px' },
            { dataIndex: 'initial_amount',key: 'initial_amount', title: 'مبلغ اولیه قرارداد' , render: function (text) { return   text?parseInt(text).toLocaleString():0}  ,width:'120px'},
            { dataIndex: 'contract_new_price',key: 'contract_new_price', title: 'مبلغ پیمان (با احتساب تغییر مقادیر)', render: function (text) { return   text?parseInt(text).toLocaleString():0 }  ,width:'120px' },
            { dataIndex: 'manager_pishraft_mali',key: 'manager_pishraft_mali', title: 'پیشرفت مالی تایید شده مدیر طرح' ,width:'120px' },
			{ dataIndex: 'technical_pishraft_mali',key: 'technical_pishraft_mali', title: 'پیشرفت مالی تایید شده دفتر فنی'  ,width:'120px'},
		    { dataIndex: 'mali_pishraft_mali',key: 'mali_pishraft_mali', title: 'پیشرفت مالی تایید شده مالی' ,width:'120px' },
			{ dataIndex: 'contract_date',key: 'contract_date', title: 'تاریخ قرارداد' ,width:'120px'},
			{dataIndex: 'ag_end_date',key: 'ag_end_date', title: 'تاریخ اتمام اولیه' ,width:'120px'},
			{dataIndex: 'duration',key: 'duration', title: 'مدت تمدید' ,width:'120px'},
			{dataIndex: 'extension_end_date',key: 'extension_end_date', title: 'خاتمه قرارداد با احتساب تمدید' ,width:'120px'},
			{dataIndex: 'record_letter_date',key: 'record_letter_date', title: 'تاریخ تصویب طرح' ,width:'120px'},
			{dataIndex: 'no_id',key: 'no_id', title: 'شماره صورت حساب تأیید شده مدیر طرح' ,width:'120px'},
			{dataIndex: 'period_start_date',key: 'period_start_date', title: 'تاریخ شروع دوره' ,width:'120px'},
			{dataIndex: 'period_end_date',key: 'period_end_date', title: 'تاریخ پایان دوره' ,width:'120px'},
			{dataIndex: 'letter_date_branch',key: 'letter_date_branch', title: 'تاریخ نامه مشاور' ,width:'120px'},
			{dataIndex: 'letter_date_manager',key: 'letter_date_manager', title: 'تاریخ نامه مدیر طرح' ,width:'120px'},
			{dataIndex: 'letter_date_employer',key: 'letter_date_employer', title: 'تاریخ ارسال معاون فنی به مالی' ,width:'120px'},
	        {dataIndex: 'pay_date',key: 'pay_date', title: 'تاریخ پرداخت' ,width:'120px'},
			{dataIndex: 'manager_price',key: 'manager_price', title: 'مبلغ تایید مدیر طرح' , render: function (text) { return   text?parseInt(text).toLocaleString():0} ,width:'120px'},
			{dataIndex: 'approve_price',key: 'approve_price', title: 'مبلغ تایید معاون فنی' , render: function (text) { return   text?parseInt(text).toLocaleString():0} ,width:'120px'},
            {dataIndex: 'Pay_price',key: 'Pay_price', title: 'مبلغ پرداخت' , render: function (text) { return   text?parseInt(text).toLocaleString():0} ,width:'120px'},
            {dataIndex: 'during_manager',key: 'during_manager', title: 'مدت زمان رسیدگی مدیر طرح' ,width:'120px'},
            {dataIndex: 'during_technical',key: 'during_technical', title: 'مدت زمان رسیدگی معاونت فنی' ,width:'120px'},
			{dataIndex: 'during_mali',key: 'during_mali', title: 'مدت زمان رسیدگی واحد مالی' ,width:'120px'},
		
			

            ];
        getAllItem("Report/Webs", { reportId: 'Web_invoice_consultant' }).then((response) => {
            let data = response.data.map((a,i)=>({...a,id:i}));
           
            this.setState({ isFetching: false, rows: data, columns,
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
                                        مالی مشاورین
                                        </div>
                                       
                                    </div>
                                </div>
                                <div className="card-body">
                                <Grid columns={this.state.columns} rows={this.state.rows}>
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