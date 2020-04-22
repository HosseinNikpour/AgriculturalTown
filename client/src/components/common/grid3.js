import React, { useState, useEffect } from 'react';
import '../../assets/css/antd.rtl.css'
import { Table, Popconfirm } from 'antd';


function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
  
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];
  
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

const Grid = (props) => {

    const [rows, setRows] = useState();
    useEffect(() => {
        setRows(props.rows)
    });

    const [columns, setColumns] = useState();
   
    useEffect(() => {
        let cols = props.columns;
        cols.forEach(c=>{
            c.sorter=compareValues(c.key)
        })
      //  console.log(props);
        if (props.editClick || props.displayClick || props.deleteClick) {
            cols.push({
                title: '',
                dataIndex: 'operation',
                render: (text, record) =>
                    props.rows.length >= 1 ? (<div>

                        {props.editClick && <i className="fa fa-edit" onClick={() => props.editClick(record)}  ></i>}
                        {props.deleteClick && <Popconfirm title="  آیا از حذف مطمئن هستید ؟" okText="تایید" cancelText="عدم تایید"
                            onConfirm={() => props.deleteClick(record, text)}>
                            <i className="far fa-trash-alt" style={{ marginRight: '8px' }}></i>
                        </Popconfirm>}
                        {props.displayClick && <i className="far fa-eye" onClick={() => props.displayClick(record)} style={{ marginRight: '8px' }} ></i>}
                    </div>

                    ) : null,
            });
        }
        setColumns(cols)
    }, []);

    return (
        <Table dataSource={rows} columns={columns} rowKey="id"
            scroll={{ y: 350 }} bordered pagination={false} />
    )
}

export default Grid;