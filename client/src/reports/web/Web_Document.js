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
            { dataIndex: 'town', key: 'town', title: 'نام شهرک', width: '120px' },
            { dataIndex: 'contract', key: 'contract', title: 'عنوان پیمان', width: '320px' },
            { dataIndex: 'contract_no', key: 'contract_no', title: 'شماره پیمان', width: '120px' },
            { dataIndex: 'file_dxf',key: 'file_dxf', title: 'بارگذاری فایل کروکی DXF ',width:'120px',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
            { dataIndex: 'file_kmz',key: 'file_kmz', title: 'بارگذاری فایل کروکی KMZ ' ,width:'120px',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
            { dataIndex: 'file_plan',key: 'file_plan', title: 'بارگذاری فایل پی دی اف پلان شهرک',width:'120px',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
            { dataIndex: 'con_file_agreement',key: 'con_file_agreement', title: 'موافقتنامه' ,width:'120px',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
            { dataIndex: 'con_file_announcement',key: 'con_file_announcement', title: 'نامه ابلاغ ' ,width:'120px',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
            { dataIndex: 'file_delivery',key: 'file_delivery', title: 'صورتجلسه تحویل زمین',width:'120px',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
            { dataIndex: 'vc_file_signification',key: 'vc_file_signification', title: 'نامه ابلاغ تغییر مقادیر' ,width:'120px',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
            { dataIndex: 'ex_file_signification',key: 'ex_file_signification', title: 'سند ابلاغ تمدید' ,width:'120px',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
            { dataIndex: 'file_late',key: 'file_late', title: 'سند لایحه تاخیرات' ,width:'120px',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
            { dataIndex: 'file_plan_pdf',key: 'file_plan_pdf', title: 'بارگذاری فایل پی دی اف برنامه زمانبندی',width:'120px' ,render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
            { dataIndex: 'file_plan_msp',key: 'file_plan_msp', title: 'بارگذاری فایل msp برنامه زمانبندی',width:'120px' ,render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
            { dataIndex: 'cc_file_record',key: 'cc_file_record', title: 'نامه ابلاغ (تعلیق، خاتمه، فسخ)' ,width:'120px',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
            { dataIndex: 'in_file_contract',key: 'in_file_contract', title: 'بارگذاری قرارداد',width:'120px' ,render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
            { dataIndex: 'in_App_file_contract',key: 'in_App_file_contract', title: 'بارگذاری الحاقیه' ,width:'120px',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
            { dataIndex: 'td_file_record',key: 'td_file_record', title: 'سند صورتجلسه' ,width:'120px',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
            { dataIndex: 'file_defect',key: 'file_defect', title: 'لیست نواقص',width:'120px' ,render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
            { dataIndex: 'file_elimination_defects',key: 'file_elimination_defects', title: 'صورتجلسه رفع نقص',width:'120px' ,render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
            { dataIndex: 'delivery_file_record',key: 'delivery_file_record', title: 'سند صورتجلسه',width:'120px' ,render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
            { dataIndex: 'inv_file_letter_manager',key: 'inv_file_letter_manager', title: 'بارگذاری نامه مدیر طرح' ,width:'120px',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
            { dataIndex: 'inv_file_invoice',key: 'inv_file_invoice', title: 'روکش صورت وضعیت' ,width:'120px',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
            { dataIndex: 'file_letter_employer',key: 'file_letter_employer', title: 'بارگذاری نامه دفتر فنی کارفرما به مالی' ,width:'120px',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
      
            { dataIndex: 'file_invoice_pay',key: 'file_invoice_pay', title: 'بارگذاری سند مالی' ,width:'120px',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
          
            ];
        getAllItem("Report/Webs", { reportId: 'Web_Document', reportFilter: '' }).then((response) => {
            let data = response.data;
           
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
                                        مستندات بارگذاری شده
                                        </div>
                                       
                                    </div>
                                </div>
                                <div className="card-body">
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