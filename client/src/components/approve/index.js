import React, { useState, useEffect } from 'react';
import { successDuration, successMessage, errorMessage, errorDuration } from '../../../components/statics'
import { message } from 'antd';

const Approve = (props) => {
    const [comment, setComment] = useState();
    // useEffect(() => {
    //     setRows(props.rows)
    // });
    const buttonClick = (type) => {
        if (type < 0 && !comment)
        message.error("وارد کردن فیلد توضیحات در هنگام عدم تایید اطلاعات ضروری میباشد", errorDuration);
        else{
            console.log('we can call server ');
            console.log({type:type,comment:comment,entityName:props.entityName,itemId:props.itemId})
        }
    }
    return (
        <div className='row'>
            <div className="col-12">
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
                            <input type='button' value='تایید' className='btn btn-success btn-lg' onClick={buttonClick(1)} />
                            <input type='button' value='عدم تایید' className='btn btn-danger btn-lg' onClick={buttonClick(-1)} />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Approve;