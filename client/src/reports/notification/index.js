import React, { useState, useEffect } from 'react';
import { getAllItem } from '../../api/index'


const ReportNotification = (props) => {
    const [data, setData] = useState({});

    Promise.all([getAllItem("")]).then(response=>{
    setData({data1:response[0].data});
    })
    return (
        <div className="rpt-parent">
            <div className="badge-item">
                <h2>صورت وضعیت اختلاف تاییدمدیریت طرح تادفتر فنی</h2>
                <hr></hr>
                <ul>
                    {data.data1.map((a, i) =>
                        <li> a.title <span class="badge">a.number</span></li>
                    )}
                </ul>
            </div>
        </div>
    )
}
export default ReportNotification;