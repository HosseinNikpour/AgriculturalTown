import React, { useState, useEffect } from 'react';
import { getAllItem } from '../../api/index'


const ReportExcels = (props) => {
    const reports = [
        { title: 'گزارش شرکت ها', value: 'company' },
        { title: 'گزارش شهرک ها ', value: 'town' },
        { title: 'شناسنامه پیمان ', value: 'contract' },
        { title: 'شناسنامه قرارداد ', value: 'agreement' },
        { title: 'تغییر مقادیر', value: 'valueChange' },
        { title: 'مناقصه', value: 'tender' },
        { title: 'گزارش صورت وضعیت ها', value: 'invoiceContractor' },
        { title: 'گزارش صورت حساب', value: 'invoiceConsultant' },  
        { title: 'پیش بینی اعتبار', value: 'creditPredict' },
        { title: 'گزارش هفتگی', value: 'weeklyOperation' }, 
        //{ title: 'گزارش کارگاه', value: 'weekly_Weather' },
        { title: 'پیشرفت مطالعات', value: 'studyOperation' },
        { title: 'بیمه', value: 'insurance' },
       { title: 'چرخه عمر پیمان', value: 'contractCycle' },
       { title: 'چرخه عمر قرارداد', value: 'projectCycle' },

        
    ]
    
   
    const [getFile, setGetFile] = useState({});

    const clickReport = (i) => {
        
        getAllItem("Report/excels", { reportId: reports[i].value }).then((response) => {
            let data = response.data;

          //  console.log(data);
       
            const link = document.createElement('a');
            link.href = data;
            link.download=reports[i].title+'.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }).catch((error) => console.log(error))

    }
    return (
        <div className="rpt-parent">
            {reports.map((a, i) =>
                <div className="rpt-item" key={i} onClick={() => clickReport(i)}>{a.title}</div>
            )}
           

        </div>
    )
}
export default ReportExcels;