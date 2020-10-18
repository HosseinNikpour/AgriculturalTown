import React, { useState, useEffect } from 'react';
import { getAllItem } from '../../api/index'
import Grid from '../../components/common/grid3';
import Loading from '../../components/common/loading';

const ReportWeb11 = (props) => {
    const [loaded, setLoaded] = useState(false);
    const [gridData, setGridData] = useState([]);
    let columns = [
         { dataIndex: 'town',key: 'town', title: 'نام شهرک ' }, 
         { dataIndex: 'title',key: 'title', title: 'موضوع پیمان' },
         { dataIndex: 'contract_no',key: 'contract_no', title: 'شماره پیمان' }, 
         { dataIndex: 'company',key: 'company', title: 'نام پیمانکار' },
         { dataIndex: 'initial_amount',key: 'initial_amount', title: 'مبلع اولیه پیمان' , render: function (text) { return   text?parseInt(text).toLocaleString():0}},
         { dataIndex: 'contract_new_price',key: 'contract_new_price', title: 'مبلغ پیمان (با احتساب تغییر مقادیر)', render: function (text) { return   text?parseInt(text).toLocaleString():0 }  },
         { dataIndex: 'ChangePrecent',key: 'ChangePrecent', title: 'درصد تغیرات پیمان'}, 
         { dataIndex: 'MaxInvoice',key: 'MaxInvoice', title: 'شماره آخرین صورت وضعیت (تایید مدیر طرح)' },
         { dataIndex: 'end_date',key: 'end_date', title: 'تاریخ پایان کارکرد ' },
         { dataIndex: 'manager_price',key: 'manager_price', title: 'مبلغ تایید مدیر طرح '},
         { dataIndex: 'letter_date_manager',key: 'letter_date_manager', title: 'تایخ نامه مدیر طرح' },
         { dataIndex: 'pishraft_phisical',key: 'pishraft_phisical', title: 'پیشرفت فیزیکی عملکرد' },
         { dataIndex: 'pishraft_mali',key: 'pishraft_mali', title: 'پیشرفت مالی تایید شده مدیر طرح' },
         ];
         getAllItem("Report/Webs", { reportId: 'Web_Invoice_Contractor' }).then((response) => {
            let data = response.data;
            setGridData(data);
            setLoaded(true);
         });
    return (

        <div className="rpt-parent">
            {!loaded&&<Loading></Loading>}

            <Grid columns={columns} rows={gridData}></Grid>
        </div>
    )
}
export default ReportWeb1;