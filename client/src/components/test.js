import React, { Component } from 'react';
import moment from 'moment-jalaali'
import DatePicker from 'react-datepicker2';
import { createGroupedOptions } from '../functions/index'
import { message, Select } from 'antd';
import { getAllItem } from '../api/index';
import { selectDefaultProp } from './statics'


class Test extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            value: moment('2020-04-22 13:13:09.404+04:30'),
            selectOptions: []
        };
    }

    componentDidMount() {
        // Promise.all([getAllItem('company'),getAllItem('contract'),getAllItem('user')]).then((response) => {
        // });

        getAllItem('baseinfo').then(response => {
            let d=response.data.map(a=>({value:a.id,label:a.title,groupid:a.groupid}));
            let x = createGroupedOptions(d, 'groupid');
            this.setState({ selectOptions: x });
        })
    }
    render() {
        return (<div className="mainContent">

            <div className='boxHeader'>
                شناسنامه شرکت ها
            </div>
            <div className='boxContent'>

            </div>
{console.log( this.state.selectOptions)}
contract : <Select className="form-control" direction="rtl" placeholder='انتخاب ...'
                filterOption={true} optionFilterProp="children" showSearch={true}>
                {this.state.selectOptions}
            </Select>

            <DatePicker
                isGregorian={false}
                value={this.state.value}
                onChange={value => this.setState({ value })}
            />
        </div>)
    }
}
export default Test;