import React, { Component } from 'react';
import { Select } from 'antd';
const { Option, OptGroup } = Select;

const createGroupData = (array, groupField) => {
    let arr = [], groupArr = [];
    array.forEach(e => {
        let i = groupArr.indexOf(e[groupField])
        if (i >= 0) {
            arr[i].child.push(e);
        } else {
            arr.push({ title: e[groupField], child: [] });
            groupArr.push(e[groupField]);
        }
    });
    console.log(arr)
    return arr;
}
export const createGroupedOptions = (array, groupField) => {
    
    let res = [], gArr = createGroupData(array, groupField);
    gArr.forEach(g => {
        res.push(<OptGroup label={g.title}></OptGroup>);
        g.child.forEach(e => {
            res.push(<Option value={e.value}>{e.label}</Option>);
       });
    });
return res;
}