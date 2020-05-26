import React, { useState, useEffect } from 'react';
import { successDuration, successMessage, errorMessage, errorDuration } from '../statics'
import { message } from 'antd';
import { status } from './statics'
import { saveItem } from '../../api/index';
import { findNextStep } from '../../functions/index'

const Approve = (props) => {
    const [comment, setComment] = useState();

    const buttonClick = async(type) => {
        if (type < 0 && !comment)
            message.error("وارد کردن فیلد توضیحات در هنگام عدم تایید اطلاعات ضروری میباشد", errorDuration);
        else {

            let obj = {
                action: type, comment: comment, entity_name: props.entityName, item_id: props.item.id,
                creator_id: JSON.parse(localStorage.getItem('user')).id, create_date: new Date()
            };
            console.log(obj);
            let nextUser =await findNextStep(props.entityName, props.item.contract_id, type === 1 ? "a" : "r", props.item.current_user_id)
            console.log(nextUser);
            let s=nextUser!==-1? status.wait:status.approved;

            saveItem({ obj ,next_user:nextUser,status:s}, 'Approve').then((response) => {
                if (response.data.type !== "Error") {
                    message.success(successMessage, successDuration);
                   // this.fetchData();
                    props.onEnd();
                }
                else {
                    message.error(errorMessage, errorDuration);
                    console.error('error : ', response);
                }
            }).catch((error) => console.log(error));

        }
    }
    if (props.item && props.item.status === status.wait && props.item.current_user_id === JSON.parse(localStorage.getItem('user')).id)
        return (

            <div className="col-4">
                <div className="card">
                    <div className="card-header">
                        تایید/عدم تایید اطلاعات
                    </div>
                    <div className="card-body">
                        <form>
                            <div className='row'>
                                <div className='col'>
                                    <div className="form-group">
                                        <label htmlFor="entity_name" className="">توضیحات</label>
                                        <textarea rows="4" className="form-control" onChange={e => setComment(e.target.value)}></textarea>
                                    </div>
                                </div>
                            </div>
                            <input type='button' value='تایید' className='btn btn-success btn-lg' onClick={() => buttonClick(1)} />
                            <input type='button' value='عدم تایید' className='btn btn-danger btn-lg' onClick={() => buttonClick(2)} />
                        </form>
                    </div>
                </div>
            </div>

        )
    return ('')
}

export default Approve;