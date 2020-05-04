import React, { Component } from 'react';
import moment from 'moment-jalaali'
import DatePicker from 'react-datepicker2';
import { createGroupedOptions } from '../functions/index'
import { message, Select } from 'antd';
import { getAllItem } from '../api/index';
import { selectDefaultProp } from './statics'
import Grid from './common/grid2'
import {columns} from '../forms/contracts/contract/statics'
class Test extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            rows:[]
        };
    }

    componentDidMount() {
        // Promise.all([getAllItem('company'),getAllItem('contract'),getAllItem('user')]).then((response) => {
        // });

        getAllItem('contract').then(response => {
            // let d = response.data.map(a => ({ value: a.id, label: a.title, groupid: a.groupid }));
            // let x = createGroupedOptions(d, 'groupid');
            this.setState({rows:response.data });
        })
    }
    render() {
        return (<div className="mainContent">

           <Grid columns={columns} rows={this.state.rows}></Grid>
        </div>)
    }
}
export default Test;