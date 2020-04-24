import React, { Component } from 'react';
import moment from 'moment-jalaali'
import DatePicker from 'react-datepicker2';

class Test extends Component {
    constructor(prop) {
        super(prop);
        this.state = { value: moment('2020-04-22 13:13:09.404+04:30') };
    }
    render() {
        return (<div className="mainContent">

            <div className='boxHeader'>
                شناسنامه شرکت ها
            </div>
            <div className='boxContent'>


                dsffs
                DASFSDFSDFS
                DASFSDFSDFSSF
            <br />
            SDF
            SD      <br />
            fromSDF      <br />
            DS
            fromSDFDS      <br />
            F
            DS      <br />
            fromSDFDSF      <br />
            SD
            F      <br />
            dsffsFD      <br />
            F
            SD      <br />
            </div>

            <DatePicker
                isGregorian={false}
                value={this.state.value}
                onChange={value => this.setState({ value })}
            />
        </div>)
    }
}
export default Test;