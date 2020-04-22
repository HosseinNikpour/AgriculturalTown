import React, { useState, useEffect } from 'react';
import { DatePicker as DT } from 'react-advance-jalaali-datepicker';



const DatePicker = (props) => {

    const [obj, setObj] = useState();
    useEffect(() => {
      let o={preSelected:props.preSelected ,status:props.status}
        setObj(o)
    });

  

    return (
      <DT onChange={props.onChange} preSelected={obj.preSelected} 
      disabled={obj.status === 'display'} 
      className="form-control"   placeholder="انتخاب تاریخ" format="jYYYY/jMM/jDD" />
    )
}

export default DatePicker;