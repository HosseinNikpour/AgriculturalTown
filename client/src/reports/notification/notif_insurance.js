import React, { Component } from 'react';
import { getAllItem } from '../../api/index'
import Grid from '../../components/common/grid3';
import Loading from '../../components/common/loading';

class notif_insurance extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            columns: [], rows: [],
            isFetching: true,
        }
 }

    fetchData() {

        let columns = [
            { dataIndex: 'province', key: 'province', title: 'استان' },
            { dataIndex: 'town', key: 'town', title: 'نام شهرک' },
            { dataIndex: 'contract', key: 'contract', title: 'عنوان پیمان', width: '500px' },
            { dataIndex: 'contract_no', key: 'contract_no', title: 'شماره پیمان' },
            { dataIndex: 'company', key: 'company', title: 'پیمانکار' },
          
           

        ];
      getAllItem("Report/dash", { reportId: 'notif_insurance'}).then((response) => {
            let data = response.data;
            this.setState({
                isFetching: false, rows: data, columns,
            });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {

        this.fetchData();

    }

   
    render() {
        const { isFetching } = this.state;
        if (isFetching) {
            return (<Loading></Loading>)
        }

        else {
            return (
                <div className="app-main col-12" >
                    <div className="row" >
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col">
                                        پیمان های جاری که فاقد سند بیمه تمام خطر می باشند.
                                        </div>

                                    </div>
                                </div>
                                <div className="card-body">
                                    <div style={{textAlign:'center',marginBottom: '20px'}}>
                                        {/* <lable>رنگ زرد نمایانگر اختلاف زمانی بین 20 تا 30 روز بین تاریخ بررسی صورت وضعیت توسط مدیریت طرح و تاریخ بررسی توسط دفتر فنی کارفرما می باشد. </lable>
                                        <br></br>
                                        <label>رنگ قرمز نمایانگر اختلاف زمانی بیش از 30 روز بین تاریخ بررسی صورت وضعیت توسط مدیریت طرح و تاریخ بررسی توسط دفتر فنی کارفرما می باشد.</label>
                                        */}
                                    </div>
                                    <Grid columns={this.state.columns} rows={this.state.rows} >
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )
        }
    }

}
export default notif_insurance;