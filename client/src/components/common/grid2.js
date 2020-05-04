import React, { useState, useEffect } from 'react';
import '../../assets/css/antd.rtl.css'
import { Table, Popconfirm, Modal, Checkbox, Select } from 'antd';
import { selectDefaultProp } from '../statics'


function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }
    // const varA = a[key];
    // const varB = b[key];
    const varA = (Number(a[key])) ? Number(a[key]) : a[key].toString();
    const varB = (Number(b[key])) ? Number(b[key]) : b[key].toString();
    // console.log(varA);
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
  const [orgRows, setOrgRows] = useState([]);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(props.rows)
    setOrgRows(props.rows)
  }, [props.rows]);


  const [searchColumns, setSearchColumns] = useState([]);
  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    onSearch();
  }, [searchColumns, searchText]);

  const [refreshColumns, setrefreshColumns] = useState(false);
  const [tempColumns, setTempColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    let cols = props.columns.map((a, i) => ({ ...a, index: a.selected?i:50, sorter: compareValues(a.key) }));
    cols=cols.sort(compareValues('index'));
    cols=cols.map((a,i)=>({...a,index:i+1}));
    console.log(cols);
    
    setColumns(cols);

    let cc = cols.filter(a => a.dataIndex === 'operation');
    if (cc >= 0 && (props.editClick || props.displayClick || props.deleteClick)) {
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

    setSelectedColumns(cols.filter(a => a.selected));
    setTempColumns(cols.filter(a => a.selected));
  }, [props.columns,refreshColumns]);
  const [showColumnModal, setShowColumnModal] = useState(false);


  const addOptions = (value) => {
    setSearchColumns(value);
    // onSearch();
  }
  const serchTextChange = (txt) => {
    setSearchText(txt);
    // onSearch();
  }
  const onSearch = () => {
    //debugger;
    // console.log(searchText);
    if (searchText == '')
      setRows(orgRows)
    else {
      debugger;
      let col = columns.filter(a => a.dataIndex !== 'operation');
      if (searchColumns.length > 0) {
        let tmp = []
        searchColumns.forEach(a => {
          tmp.push(columns.filter(x => x.key == a)[0]);
        })
        col = tmp;
      }

      let matched = [];
      orgRows.forEach(record => {
        col.forEach(c => {
          //    console.log(record[c.dataIndex]);
          if (record[c.dataIndex] && record[c.dataIndex].toString().indexOf(searchText) >= 0) {
            matched.push(record);
            return;
          }
        })
      })
      //  console.log(matched)
      setRows(matched);

    }

  }
  const handleOk = () => {
    console.log('handleOk');
    setSelectedColumns(tempColumns);
    setrefreshColumns(true);
    setShowColumnModal(false)
  }
  const handleCancel = () => {
    console.log('handleCancel')
    setTempColumns(selectedColumns);
    setShowColumnModal(false)
  }

  const handleChangeChk = (e, item) => {
    //console.log(item.title, e.target.checked);
//debugger;
    if (e.target.checked) {
      let c = columns.filter(a => a.key === item.key)[0];
      let tmp = tempColumns;
      tmp.push(c);
      setTempColumns(tmp);
    }
    else {
      let c = tempColumns.findIndex(a => a.key === item.key);
      let tmp = tempColumns;
      tmp.splice(c, 1);
      setTempColumns(tmp);
    }
  }
  const handleChangeSlc = (e, item) => {
    var index = e.nativeEvent.target.selectedIndex;
    let v = e.nativeEvent.target[index].text;
    let c = tempColumns.findIndex(a => a.key === item.key);
    if (c !== -1) {
      let tmp = tempColumns;
      tmp[c].index = v;
      setTempColumns(tmp);

    }
  }
  return (
    <div>

      جستجو : <input className='form-control' onChange={e => serchTextChange(e.target.value)}
        style={{ width: '200px', display: 'inline', marginBottom: '20px' }} />

      <Select options={selectedColumns.map(a => ({ key: a.key, value: a.key, label: a.title }))}
        mode="multiple" style={{ width: '200px' }} value={searchColumns}
        onChange={(values) => addOptions(values)}
      />

      <button onClick={() => setShowColumnModal(true)}>انتخاب ستون ها</button>


      <Table dataSource={rows} columns={selectedColumns} rowKey="id"
        scroll={{ y: 350 }} bordered pagination={false} />

      <Modal title="انتخاب ستون ها"
        visible={showColumnModal}
        onOk={handleOk}
        onCancel={handleCancel}
      ><div style={{ direction: 'rtl' }} >
          {columns.map(a =>
            <div><input type='Checkbox' defaultChecked={a.selected} onClick={(e) => handleChangeChk(e, a)} /><label>{a.title}</label>
              <select onChange={(e) => handleChangeSlc(e, a)}>{columns.map((x, i) => <option key={i+1} selected={a.index == i+1}>{i+1}</option>)}</select>

            </div>)}
        </div>
      </Modal>

    </div>
  )
}

export default Grid;