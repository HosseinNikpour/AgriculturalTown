import React, { useState, useEffect } from 'react';
import { getAllItem } from '../../api/index';
import moment from 'moment-jalaali';
import {actions} from './statics'

const History = (props) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        getAllItem('approve', { item_id: props.item.id, entity_name: props.entityName }).then(res => {
            setData(res.data);
        })
    }, []);

    // if (props.item && props.item.status === 'در انتظار تایید' && props.item.current_user_id === JSON.parse(localStorage.getItem('user')).id)
    return (
        <div className="col">
            <div className="card">
                <div className="card-header">
                    سوابق گردش کار
                    </div>
                <div className="card-body">
                    <table className='table table-striped table-bordered'>
                        <thead>
                            <tr>
                                <th>ردیف</th>
                                <th>وضعیت</th>
                                <th>کاربر</th>
                                <th>تاریخ</th>
                                <th>توضیحات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, i) => {
                                return <tr key={i}>
                                    <td><label className='tableSpan'>{i + 1}</label></td>
                                    <td><label className='tableSpan'>{actions[item.action]} اطلاعات</label></td>
                                    <td><label className='tableSpan'>{item.creator}</label></td>
                                    <td><label className='tableSpan'>{moment(item.create_date).format('jYYYY/jMM/jDD')}</label></td>
                                    <td><label className='tableSpan'>{item.comment}</label></td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    )
    //  return ('')
}

export default History;