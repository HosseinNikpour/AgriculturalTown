import React, { Component } from 'react';
import { getAllItem } from '../../api/index'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Select } from 'antd';
import { selectDefaultProp } from '../../components/statics'
import Loading from '../../components/common/loading';

class ReportDelivery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [], provinces: [], towns: [], filterdTowns: [],
            isFetching: true,
            selectedProvince: -100,
            selectedTown: -100,
            chartOptions: {
                style: {
                    direction: 'rtl'
                },
                credits: {
                    enabled: false
                },
                chart: {
                    type: 'column'
                },
                title: {
                    
                    text:'<span style="font-size: 1.5rem">نمودار تعداد پیمانها به تفکیک سال</span>'
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                legend: {
                    shadow: false
                },
                tooltip: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        grouping: false,
                        shadow: false,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: 'تعداد پیمان',
                    color: '#b3afaf',
                   // borderColor:'#ffffff',
                    data: [],
                    pointPadding: 0.35,
                    pointPlacement: 0
                }, {
                    name: 'تحویل موقت شده',
                    color: '#c3ecc3',
                    data: [],
                    pointPadding: 0.35,
                    pointPlacement: 0

                }, {
                    name: 'تحویل قطعی شده',
                    color: '#087f08',
                    data: [],
                    pointPadding: 0.35,
                    pointPlacement: 0
                }, {
                    name: 'خاتمه یافته',
                    color: 'blue',
                    data: [],
                    pointPadding: 0.35,
                    pointPlacement: 0

                }, {
                    name: 'فسخ شده',
                  color: 'red',
                    data: [],
                    pointPadding: 0.35,
                    pointPlacement: 0

                }]
            }
        }


    }

    fetchData() {
        let f = this.state.selectedProvince != -100 ? ` and province_id =${this.state.selectedProvince}` : '';
        f += this.state.selectedTown != -100 ? ` and town_id =${this.state.selectedTown}` : '';

        getAllItem("Report/Dash", { reportId: 'delivery', p_where: f }).then((response) => {
            let data = response.data;
            let c = data.filter(a => a.type == 'contract');
            let t = data.filter(a => a.type == 'temp_delivery');
            let d = data.filter(a => a.type == 'delivery');
            let n = data.filter(a => a.type == 'ended');
            let l = data.filter(a => a.type == 'cancel');

            let tblHead = c.map(a => a.year);
            let tblData = [];
            let cc = [], tt = [], dd = [], nn = [], ll = [];
            //let cc = ['تعداد پیمان'], tt = ['تحویل موقت شده'], dd = ['تحویل قطعی شده'], nn = ['خاتمه یافته'], ll = ['فسخ شده'];
            for (let i = 0; i < c.length; i++) {

                cc[i] = c.find(a => a.year == tblHead[i]) ? c.find(a => a.year == tblHead[i]).count : 0;
                tt[i] = t.find(a => a.year == tblHead[i]) ? t.find(a => a.year == tblHead[i]).count : 0;
                dd[i] = d.find(a => a.year == tblHead[i]) ? d.find(a => a.year == tblHead[i]).count : 0;
                nn[i] = n.find(a => a.year == tblHead[i]) ? n.find(a => a.year == tblHead[i]).count : 0;
                ll[i] = l.find(a => a.year == tblHead[i]) ? l.find(a => a.year == tblHead[i]).count : 0;
            }
         

            let chartOptions = this.state.chartOptions;
   
            chartOptions.xAxis.categories = c.map(a => a.year);//.splice(1)
            chartOptions.series[0].data = JSON.parse(JSON.stringify(cc)).map(a => parseInt(a));
            chartOptions.series[1].data = JSON.parse(JSON.stringify(tt)).map(a => parseInt(a));
            chartOptions.series[2].data = JSON.parse(JSON.stringify(dd)).map(a => parseInt(a));
            chartOptions.series[3].data = JSON.parse(JSON.stringify(nn)).map(a => parseInt(a));
            chartOptions.series[4].data = JSON.parse(JSON.stringify(ll)).map(a => parseInt(a));

            cc.push(cc.reduce((a, b) => parseInt(a) +  parseInt(b), 0));
            tt.push(tt.reduce((a, b) => parseInt(a)  + parseInt(b), 0));
            dd.push(dd.reduce((a, b) => parseInt(a)  + parseInt(b), 0));
            nn.push(nn.reduce((a, b) => parseInt(a)  + parseInt(b), 0));
            ll.push(ll.reduce((a, b) => parseInt(a)  + parseInt(b), 0));

            tblHead.push('جمع');
            cc.unshift('تعداد پیمان');
            tt.unshift('تحویل موقت شده');
            dd.unshift('تحویل قطعی شده');
            nn.unshift('خاتمه یافته');
            ll.unshift('فسخ شده');
            tblData.push(cc);
            tblData.push(tt);
            tblData.push(dd);
            tblData.push(nn);
            tblData.push(ll);
            tblHead.unshift('');
            

            this.setState({
                isFetching: false, rows: data, tblHead, tblData, chartOptions
            });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        Promise.all([getAllItem('BaseInfo/vw'), getAllItem('town/vw')]).then((response) => {

            let provinces = response[0].data.filter(a => a.groupid === 1).map(a => { return { key: a.id, label: a.title, value: a.id } });
            provinces.push({ key: -100, label: 'همه موارد', value: -100 })
            let towns = response[1].data.map(a => { return { key: a.id, label: a.title, value: a.id, province: a.province_id } });
            towns.push({ key: -100, label: 'همه موارد', value: -100 })
            this.setState({
                provinces, filterdTowns: towns, towns
            });
            this.fetchData();
        }).catch((error) => console.log(error))
    }
    changeProvince(value) {
        let filterdTowns = this.state.towns.filter(a => a.province == value);
        filterdTowns.push({ key: -100, label: 'همه موارد', value: -100 })
        this.setState({ selectedProvince: value, filterdTowns })
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
                                         
                                        </div>

                                    </div>
                                </div>
                                <div className="card-body">
                                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                        <lable> استان : </lable>
                                        <Select  {...selectDefaultProp} options={this.state.provinces} className='form-control' style={{ width: '300px' }}
                                            value={this.state.selectedProvince} onSelect={(e) => this.changeProvince(e)} />
                                        <lable style={{ marginRight: '13px' }}> شهرک : </lable>
                                        <Select  {...selectDefaultProp} options={this.state.filterdTowns} className='form-control' style={{ width: '400px' }}
                                            value={this.state.selectedTown} onSelect={(e) => this.setState({ selectedTown: e })} />


                                        <input type="button" value="اعمال فیلتر" style={{ marginRight: '13px', height: '35px' }} onClick={() => { this.setState({ isFetching: true }); this.fetchData(); }} />
                                    </div>
                                    <hr style={{ width: '2px' }}></hr>
                                    <div style={{ border: 'solid 1px  #9e0909' }}>
                                        <HighchartsReact highcharts={Highcharts} options={this.state.chartOptions} />
                                    </div>
                                    <br></br>
                                    <hr style={{ width: '2px' }}></hr>
                                   <center> <h4>جدول وضعیت پیمانها</h4></center>
                                    <div style={{ border: 'solid 1px  #9e0909',direction: 'ltr',textAlign: 'center',fontSize: '24px' }}>
                                        <table className="table table-striped table-bordered">
                                            <thead>
                                                <tr style={{backgroundColor:'#40a9ff',fontWeight:"bold",fontSize:'26px'}}>

                                                    {this.state.tblHead.map(a => <td>{a}</td>)}
                                                 
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.tblData.map((a, j) => <tr key={j}>
                                                    {this.state.tblHead.map((b, i) => <td>{a[i]}</td>)}
                                                </tr>)}
                                            </tbody>
                                        </table>

                                    </div> </div>
                            </div>
                        </div>
                    </div>
                </div>

            )
        }
    }

}
export default ReportDelivery;