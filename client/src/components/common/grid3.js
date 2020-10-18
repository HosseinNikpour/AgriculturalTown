import React, { useState, useEffect } from 'react';
import '../../assets/css/antd.rtl.css'
import { Table, Popconfirm } from 'antd';


function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }
    // const varA = a[key];
    // const varB = b[key];
    const varA = (Number(a[key])) ?Number(a[key]) : a[key];
    const varB = (Number(b[key])) ?Number(b[key]) : b[key];
   // console.log(varA);
    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else  if (varA < varB) {
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
  }, [props.rows]);
  const [orgRows, setOrgRows] = useState(props.rows);
  useEffect(() => {
    setOrgRows(props.rows)
  }, [props.rows]);
  const [columns, setColumns] = useState();
  useEffect(() => {

    let cols = props.columns;
    cols.forEach(c => {
      c.sorter = compareValues(c.key);
     // if(c.width)c
    })
    let cc = cols.filter(a => a.dataIndex === 'operation');
    //  console.log(props);
    if (cc >= 0 && (props.editClick || props.displayClick || props.deleteClick)) {
      cols.push({
        title: '',
        dataIndex: 'operation',
        width:'120px',
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
  },[]);


  const onSearch = (searchText) => {
    //debugger;
   // console.log(searchText);
    if (searchText === '')
      setRows(orgRows)
    else {

      let matched = [];
      orgRows.forEach(record => {
        columns.filter(a => a.dataIndex !== 'operation').forEach(c => {
          //    console.log(record[c.dataIndex]);
          if (record[c.dataIndex] && record[c.dataIndex].toString().indexOf(searchText) >= 0 
              &&!matched.find(a=>a.id===record.id)) {
           
            matched.push(record);
            
          }
        })
      })
      console.log(matched)
      setRows(matched);

    }

  }
  return (
    <div>
      جستجو : <input className='form-control' onChange={e => onSearch(e.target.value)}
        style={{ width: '200px', display: 'inline', marginBottom: '20px' }} />

{props.description &&<lable className='form-control' 
        style={{ fontSize: 'larger',textAlign: 'center',width: '40%',float: 'left',backgroundColor: '#91f59d' }}>{props.description}</lable> }

      <Table dataSource={rows} columns={columns} rowKey="id"
        scroll={{ y: 350 ,x:800}} bordered pagination={false} />
    </div>
  )
}

export default Grid;