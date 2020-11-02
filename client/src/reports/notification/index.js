import React, { useState, useEffect } from 'react';

import { Link } from "react-router-dom";

const notify = (props) => {
    const reports = [
        { title: 'صورت وضعیت', value: 'notif_invoice' },
        { title: 'بیمه', value: 'notif_insurance'},
        { title: 'تحویل زمین', value: 'notif_zamin' },
        { title: 'تمدید', value: 'notif_extension' },
        { title: 'پیشرفت فیزیکی', value: 'notif_pishraft' },
     
    ]
    
   
   
    return (
        <div className="rpt-parent">
            {reports.map((a, i) =>
              <Link to={a.value} ><div className="rpt-item" key={i} >{a.title}</div></Link> 
            )}
           

        </div>
    )
}
export default notify;