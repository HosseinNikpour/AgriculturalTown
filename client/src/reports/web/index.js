import React, { useState, useEffect } from 'react';
import { getAllItem } from '../../api/index'
import { Link } from "react-router-dom";

const ReportWebs = (props) => {
    const reports = [
        { title: 'مالی پیمان', value: 'Web_Invoice_Contractor' },
        // { title: 'مالی مشاورین ', value: 'Web_invoice_consultant'},
        { title: 'بیمه', value: 'Web_insurance' },
        { title: 'چرخه عمر', value: 'Web_contractCycle' },
        { title: 'مناقصه', value: 'Web_tender' },
        { title: 'مستندات بارگذاری شده', value: 'Web_Document' },
        { title: 'شناسنامه پروژه', value: 'Web_contract' },
        // { title: 'خلاصه وضعیت پیمان', value: 'Web_delivery' },  
       /*  { title: 'پیشرفت فیزکی و مالی شهرکها', value: 'creditPredict'},*/
        
    ]
    
   
   
    return (
        <div className="rpt-parent">
            {reports.map((a, i) =>
              <Link to={a.value} ><div className="rpt-item" key={i} >{a.title}</div></Link> 
            )}
           

        </div>
    )
}
export default ReportWebs;