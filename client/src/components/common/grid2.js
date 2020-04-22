import React, { Component } from 'react';
import 'antd/dist/antd.rtl.css'
import { Table, Popconfirm } from 'antd';


class Grid2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: props.columns.filter(a => !a.dontShow),
            rows: props.rows,
        }

    }
    componentDidMount() {
        let cols = this.state.columns;
        cols.push({
            title: '',
            dataIndex: 'operation',
            render: (text, record) =>
                this.state.rows.length >= 1 ? (<div>
                    <i className="fa fa-edit" onClick={() => this.props.editClick(record)}  ></i>
                    <Popconfirm title="  آیا از حذف مطمئن هستید ؟" okText="تایید" cancelText="عدم تایید"
                        onConfirm={() => this.props.deleteClick(record, text)}>
                        <i className="far fa-trash-alt" style={{ marginRight: '8px' }}></i>
                    </Popconfirm>
                    <i className="far fa-eye" onClick={() => this.props.displayClick(record)} style={{ marginRight: '8px' }} ></i>
                </div>

                ) : null,
        })
        this.setState({ columns: cols });
    }


    componentWillReceiveProps({ rows }) {

        this.setState({ rows });

    }
    render() {
        return (
            <div style={{ direction: "rtl" }}>
                <Table dataSource={this.state.rows} columns={this.state.columns} rowKey="id"
                    scroll={{ y: 350 }} bordered pagination={false} />;
            </div>
        )
    }


}

export default Grid2;
