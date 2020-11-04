import React, { Component } from 'react';
import { getAllItem } from '../../api/index'
import Grid from '../../components/common/grid3';
import Loading from '../../components/common/loading';

class notif_pishraft extends Component {
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
          
            { dataIndex: 'diff', key: 'diff', title: 'اختلاف', width: '120px' ,render(text, record) {
                return {
                  props: {
                    style: { background: parseInt(text) >30 ? "red":'white' }
                  },
                  children: <div  style={{ fontSize: '24px' }}>{text.toFixed(0)}</div>
                };
              }},
           

        ];
      getAllItem("Report/dash", { reportId: 'notif_pishraft'}).then((response) => {
            let data = response.data.map((a,i)=>({...a,id:i}));
            data=data.map(a=>({...a,diff:a.plan-a.actual}));
            data=data.filter(a=>a.diff>10);
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
                                        پیمان هایی که اختلاف درصد پیشرفت  واقعی نسبت به درصد پیشرفت  برنامه ایی آنها بیش از 10 درصد باشد
                                        </div>

                                    </div>
                                </div>
                                <div className="card-body">
                                    <div style={{textAlign:'center',marginBottom: '20px'}}>
                                         <lable>رنگ قرمز نمایانگر پیمان هایی است که اختلاف بین درصد پیشرفت برنامه ای و درصد پیشرفت واقعی آنها بیش از 30 درصد باشد</lable>
                                       
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
export default notif_pishraft;