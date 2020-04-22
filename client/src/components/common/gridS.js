import React, { Component } from 'react';
import '../../assets/css/table.css'
class GridS extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: props.columns.filter(a => !a.dontShow),
            rows: props.rows,
        }
        this.generateHeader = this.generateHeader.bind(this);
        this.generateTableData = this.generateTableData.bind(this);
    }
    componentWillReceiveProps({ rows, columns }) {
        this.setState({ rows, columns: columns.filter(a => !a.dontShow) })
        // console.log('in componentWillReceiveProps')
        // console.log(rows)
    }
    render() {
        return (
            <div style={{ direction: "rtl", height: '500px', overflow: 'scroll' }}>
                <table className="table table-striped table-bordered fixed_header">
                    <thead>
                        <tr>
                            {this.generateHeader()}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.generateTableData()}
                    </tbody>
                </table>

            </div>
        )
    }
    generateHeader() {
        return this.state.columns.map((c, i) => (<th key={i}>{c.headerName}</th>));
    }
    generateTableData() {

        return this.state.rows.map((r, i) => {

            let res = this.state.columns.map((c, j) => (
                <td key={i + " " + j}>{r[c.field]}</td>
            ))
            return (<tr key={i}>{res}<td style={{ width: '130px' }}>
                <i className="fa fa-edit" onClick={() => this.props.editClick(i, r)}  ></i>
                <i className="fa fa-trash" onClick={() => this.props.deleteClick(i, r)}></i>
                {/* <i className="fa fa-trash" onClick={() => this.props.displayClick(i, r)}></i> */}

            </td></tr>)
        })
    }

}

export default GridS;
