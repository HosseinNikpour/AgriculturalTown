import React, { Component } from 'react';
import { getAllItem } from '../../api/index'
import Loading from '../../components/common/loading';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Select } from 'antd';
import { selectDefaultProp } from '../../components/statics'
import moment from 'moment-jalaali';

class DashboardExecute extends Component {
    constructor(props) {
        super(props);

        this.state = {
            info: {}, wbs: [], inv: [],
            isFetching: true, showReport: false,
            selectedContract: undefined, selectedPeriod: undefined,
            chartOptions: {
                style: {
                    direction: 'rtl'
                },
                credits: {
                    enabled: false
                  },
                chart: {
                    height: 500,
                   
                },
                title: {
                    text: 'نمودار پیشرفت فیزیکی و ریالی'
                },
                yAxis: {
                    title: {
                        text: 'درصد پیشرغت'
                    },
                    min: 0,
                    max: 100
                },
                xAxis: {
                    categories: [],
                    labels: {
                        rotation: -45,
                        useHTML: true,
                        rtl: true
                    }
                },
                plotOptions: {
                    line: {
                        connectNulls: true,
                        dataLabels: {
                            enabled: true
                        },
                      //  enableMouseTracking: false,
                    },
                   // spline: {
                        // connectNulls: true,
                        // dataLabels: {
                        //     enabled: true
                        // } 
                        // }
                },
                 tooltip: {
                    enabled: false
                //     useHTML: true,
                //     formatter: function () {

                //         return this.x;
                //     }
                 },
                series: [{
                    name: 'برنامه',
                    data: [],
                    color: '#0c37d4'
                }, {
                    name: 'پیشرفت فیزیکی',
                    data: [],
                    color: '#f12424'
                }
                    , {
                    name: 'پیشرفت مالی',
                    data: [],
                    color: '#31a202',// type: 'spline',
                }
                ]
            }
        }
    }
    fetchData() {
        Promise.all([getAllItem("Report/dash", { reportId: 'exec', p_cid: this.state.selectedContract }),
        getAllItem("Report/dash", { reportId: 'plan', p_cid: this.state.selectedContract }),
        getAllItem("Report/dash", { reportId: 'info', p_cid: this.state.selectedContract }),
        getAllItem("Report/dash", { reportId: 'wbs', p_cid: this.state.selectedContract, p_pid: this.state.selectedPeriod }),
        getAllItem("Report/dash", { reportId: 'invoice', p_cid: this.state.selectedContract })]).then((response) => {

            let exec = response[0].data;
            let plan = response[1].data;
            let info = response[2].data[0];
            let wbs = response[3].data;
            let inv = response[4].data;
            let periods = this.state.periods;

            for (let i = 1; i < exec.length; i++) {
                exec[i].done = parseInt(exec[i].done) + parseInt(exec[i - 1].done)
            }





            let chartOptions = this.state.chartOptions;

            let startPeriod = 0, endPeriod = 0;

            if (plan.length == 0 && exec.length != 0) {
                startPeriod = exec[0].period_id;
                endPeriod = exec[exec.length - 1].period_id;
            }
            else if (exec.length == 0 && plan.length != 0) {
                startPeriod = plan[0].period_id;
                endPeriod = plan[plan.length - 1].period_id;
            }
            else if (exec.length != 0 && plan.length != 0) {
                startPeriod = plan[0].period_id < exec[0].period_id ? plan[0].period_id : exec[0].period_id;
                endPeriod = plan[plan.length - 1].period_id > exec[exec.length - 1].period_id ? plan[plan.length - 1].period_id : exec[exec.length - 1].period_id;
            }

            // if (inv.length>0){
            //     startPeriod = inv[0].period_id < startPeriod ? inv[0].period_id : startPeriod;
            //     endPeriod = inv[inv.length - 1].period_id > endPeriod ? inv[inv.length - 1].period_id : endPeriod;
            // }
            for (let i = 0; i < inv.length; i++) {
                let x = periods.find(a =>
                    moment(a.start_date).isSameOrBefore(moment(inv[i].inv_end_date, 'jYYYY-jMM-jDD')) &&
                    moment(a.end_date).isSameOrAfter(moment(inv[i].inv_end_date, 'jYYYY-jMM-jDD')));
                if (x) {
                    inv[i].period_id = x.key;
                    startPeriod = x.key < startPeriod ?x.key: startPeriod;
                    endPeriod = x.key > endPeriod ? x.key : endPeriod;
                }

            }


            let filterdPeriod = periods.filter(a => a.key >= startPeriod && a.key <= endPeriod);


            chartOptions.series[0].data = []
            chartOptions.series[1].data = [];
            chartOptions.series[2].data = [];

            let contractPrice = info.contract_new_price ? parseFloat(info.contract_new_price) : parseFloat(info.initial_amount);

            filterdPeriod.forEach(e => {
                chartOptions.xAxis.categories.push(e.label);

                let p = plan.find(a => a.period_id == e.key);
                let a = exec.find(a => a.period_id == e.key);
              //  let f = inv.find(a => moment(a.inv_end_date, 'jYYYY-jMM-jDD').isSameOrAfter(moment(e.start_date), 'days') && moment(a.inv_end_date, 'jYYYY-jMM-jDD').isSameOrBefore(moment(e.end_date), 'days'));
              let f=inv.find(a=>a.period_id==e.key);
                chartOptions.series[0].data.push(p ? Math.round(parseFloat(p.done) )   : null)
                chartOptions.series[1].data.push(a ? Math.round(parseFloat(a.done) ) : null)
                chartOptions.series[2].data.push(f ? Math.round(f.inv_manager_price / contractPrice * 100 )  : null)
            });
            inv.forEach(e => {
                e.diff1 = Math.round(e.inv_manager_price / contractPrice * 100 * 100) / 100;
                // e.diff1 = moment(e.inv_letter_date_manager, 'jYYYY-jMM-jDD').diff(moment(e.inv_letter_date_branch, 'jYYYY-jMM-jDD'), 'days');
                // e.diff2 = moment(e.inv_app_letter_date_employer, 'jYYYY-jMM-jDD').diff(moment(e.inv_letter_date_manager, 'jYYYY-jMM-jDD'), 'days');
                // e.diff3 = moment(e.inv_pay_pay_date, 'jYYYY-jMM-jDD').diff(moment(e.inv_app_letter_date_employer, 'jYYYY-jMM-jDD'), 'days');

            });

            this.setState({
                isFetching: false, chartOptions, info, wbs, inv, showReport: true,
            });
        }).catch((error) => console.log(error))
    }
    componentDidMount() {
        Promise.all([getAllItem('contract/vw'), getAllItem('period')]).then((response) => {

            let contracts = response[0].data.map(a => { return { key: a.id, label: a.contract_no + ' - ' + a.company, value: a.id, title: a.title } });
            let periods = response[1].data.map(a => { return { key: a.id, label: a.title, value: a.id, start_date: a.start_date, end_date: a.end_date } });
            let x = periods.filter(a => moment(a.start_date).isSameOrBefore(moment(), 'day') && moment(a.end_date).isSameOrAfter(moment(), 'day'))

            this.setState({
                isFetching: false, contracts, periods, selectedPeriod: x[0] ? x[0].key : undefined
            });
        }).catch((error) => console.log(error))
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
                                        <div className="col" style={{ fontSize: '30px' }}>
                                            داشبورد اجرا
                                        </div>

                                    </div>
                                </div>
                                <div className="card-body">
                                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                        <lable> پیمان : </lable>
                                        <Select  {...selectDefaultProp} options={this.state.contracts} className='form-control' style={{ width: '400px' }}
                                            value={this.state.selectedContract} onSelect={(e) => this.setState({ selectedContract: e })} />
                                        <lable style={{ marginRight: '13px' }}> دوره گزارش : </lable>
                                        <Select  {...selectDefaultProp} options={this.state.periods} className='form-control' style={{ width: '300px' }}
                                            value={this.state.selectedPeriod} onSelect={(e) => this.setState({ selectedPeriod: e })} />


                                        <input type="button" value="اعمال فیلتر" style={{ marginRight: '13px', height: '35px' }} onClick={() => { this.setState({ isFetching: true }); this.fetchData(); }} />
                                    </div>
                                    <hr style={{ width: '2px' }}></hr>
                                    {this.state.showReport && <div className='dashMain'>
                                        <h3>شناسنامه پیمان</h3>
                                        <div className='row'>
                                            <div className='col rptCol'>
                                                <label >موضوع پیمان</label>
                                                <span className='form-control'>{this.state.info.title}</span>
                                            </div>
                                        </div>
                                        <div className='row' style={{ marginTop: '16px' }}>
                                            <div className='col rptCol'>
                                                <label >شهرک</label>
                                                <span className='form-control'>{this.state.info.town}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label >استان</label>
                                                <span className='form-control'>{this.state.info.province}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label >شماره پیمان</label>
                                                <span className='form-control'>{this.state.info.contract_no}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label >تاریخ پیمان </label>
                                                <span className='form-control'>{this.state.info.contract_date}</span>
                                            </div>
                                        </div>
                                        <div className='row' style={{ marginTop: '16px' }}>
                                            <div className='col rptCol'>
                                                <label >پیمانکار</label>
                                                <span className='form-control'>{this.state.info.company}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label >ناریخ تحویل زمین</label>
                                                <span className='form-control'>{this.state.info.con_land_delivery_date}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label >مدت اولیه پیمان</label>
                                                <span className='form-control'>{this.state.info.duration}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label >تاریخ اتمام اولیه</label>
                                                <span className='form-control'>{this.state.info.con_end_date}</span>
                                            </div>
                                        </div>
                                        <div className='row' style={{ marginTop: '16px' }}>
                                            <div className='col rptCol'>
                                                <label >مدت تمدید</label>
                                                <span className='form-control'>{this.state.info.ex_total_duration}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label style={{ fontSize: '18px', paddingRight: '5px' }}>خاتمه قرارداد بر اساس تمدید </label>
                                                <span className='form-control'>{this.state.info.ex_end_date}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label >مشاور ناظر</label>
                                                <span className='form-control'>{this.state.info.monitoring}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label >شماره قرارداد ناظر</label>
                                                <span className='form-control'>{this.state.info.monitoring_no}</span>
                                            </div>
                                        </div>
                                        <div className='row' style={{ marginTop: '16px' }}>
                                            <div className='col rptCol'>
                                                <label >تاریخ قرارداد ناظر</label>
                                                <span className='form-control'>{this.state.info.monitoring_contract_date}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label >وسعت شهرک </label>
                                                <span className='form-control'>{this.state.info.gross_area ? parseFloat(this.state.info.gross_area).toLocaleString() : ''}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label >تاریخ تحویل موقت</label>
                                                <span className='form-control'>{this.state.info.td_commision_date}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label >تاریخ تحویل قطعی</label>
                                                <span className='form-control'>{this.state.info.d_commision_date}</span>
                                            </div>
                                        </div>
                                        <div className='row' style={{ marginTop: '16px' }}>
                                            <div className='col rptCol' >
                                                <label >مشاور طراح</label>
                                                <span className='form-control'>{this.state.info.study}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label >شماره قرارداد طراح</label>
                                                <span className='form-control'>{this.state.info.study_no}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label>تاریخ قرارداد طراح</label>
                                                <span className='form-control'>{this.state.info.study_contract_date}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label >وضعیت</label>
                                                <span className='form-control'>{this.state.info.state_id}</span>
                                            </div>
                                        </div>
                                        <div className='row' style={{ marginTop: '16px' }}>
                                            <div className='col rptCol'>
                                                <label >نوع عملیات</label>
                                                <span className='form-control'>{this.state.info.operation_type}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label>تاریخ انقضا بیمه تمام خطر</label>
                                                <span className='form-control'>{this.state.info.insurance_date}</span>
                                            </div>
                                            <div className='col rptCol' >
                                                <label >مبلغ پیمان</label>
                                                <span className='form-control'>{this.state.info.initial_amount ? parseFloat(this.state.info.initial_amount).toLocaleString() : ''}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label >مبلغ بر اساس آخرین تغییر مقادیر</label>
                                                <span className='form-control'>{this.state.info.contract_new_price ? parseFloat(this.state.info.contract_new_price).toLocaleString() : ''}</span>
                                            </div>

                                        </div>
                                        <div className='row' style={{ marginTop: '16px' }}>
                                            <div className='col rptCol'>
                                                <label >مبلغ آخرین صورت وضعیت تأیید شده</label>
                                                <span className='form-control'>{this.state.info.manager_price ? parseFloat(this.state.info.manager_price).toLocaleString() : ''}</span>
                                            </div>

                                            <div className='col rptCol' >
                                                <label >مبلغ آخرین صورت وضعیت پرداخت شده</label>
                                                <span className='form-control'>{this.state.info.price ? parseFloat(this.state.info.price).toLocaleString() : ''}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label >پیشرفت فیزیکی</label>
                                                <span className='form-control'>{this.state.info.pishraft_phisical}</span>
                                            </div>
                                            <div className='col rptCol'>
                                                <label >پیشرفت ریالی تایید شده</label>
                                                <span className='form-control'>{this.state.info.pishraft_percent_approve}</span>
                                            </div>
                                        </div>
                                        <div className='row' style={{ marginTop: '16px' }}>
                                            <div className='col rptCol'>
                                                <label >پیشرفت ریالی پرداخت شده</label>
                                                <span className='form-control'>{this.state.info.pishraft_percent_pay}</span>
                                            </div>
                                            <div className='col'></div>
                                            <div className='col'></div>
                                            <div className='col'></div>

                                        </div>
                                        <br></br>
                                        <br></br>
                                        <h3>نمودار پیشرفت</h3>
                                        <div>
                                            <HighchartsReact highcharts={Highcharts} options={this.state.chartOptions} />
                                        </div>
                                        <br></br>
                                        <br></br>
                                        <h3>جدول  ساختار شکست </h3>
                                        <div>
                                            <table className="table table-striped table-bordered">
                                                <thead>
                                                    <tr>
                                                        <td>ردیف</td>
                                                        <td>شرح عملیات اصلی</td>
                                                        <td>واحد</td>
                                                        <td>مبلغ  پیمان</td>
                                                        <td>وزن کل </td>
                                                        <td>مقدار کل</td>
                                                        <td>مقدار انجام شده</td>
                                                        <td>درصد انجام شده</td>
                                                        <td>پیشرفت فیزیکی</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.wbs.map((a, i) => <tr key={i}><td>{i + 1}</td>
                                                        <td>{a.operation_title}</td>
                                                        <td>{a.unit}</td>
                                                        <td>{parseFloat(a.price_change).toLocaleString()}</td>
                                                        <td>{a.wieght}</td>
                                                        <td>{parseFloat(a.value_change).toLocaleString()}</td>
                                                        <td>{parseFloat(a.done).toLocaleString()}</td>
                                                        <td>{(a.done / a.value_change * 100).toLocaleString()}%</td>
                                                        <td>{(a.done / a.value_change * a.wieght).toLocaleString()}%</td>
                                                    </tr>)}
                                                </tbody>
                                            </table>
                                        </div>
                                        <br></br>
                                        <br></br>
                                        <h3>گزارش مالی اجرا</h3>
                                        <div>
                                            <table className="table table-striped table-bordered">
                                                <thead>
                                                    <tr>
                                                        <td style={{ width: '50px' }}>شماره ص و</td>
                                                        <td style={{ width: '130px' }}> شروع دوره</td>
                                                        <td style={{ width: '130px' }}> پایان دوره</td>
                                                        <td style={{ width: '130px' }}> نامه مدیر شعبه</td>
                                                        <td style={{ width: '130px' }}> نامه مدیر طرح</td>
                                                        <td style={{ width: '130px' }}> نامه معاون فنی</td>
                                                        <td style={{ width: '130px' }}>تاریخ پرداخت</td>
                                                        <td>مبلغ تایید مدیر طرح</td>
                                                        <td>مبلغ تایید معاون فنی</td>
                                                        <td>مبلغ پرداخت</td>
                                                        <td style={{ width: '50px' }}>پیشرفت مالی</td>
                                                        {/* <td>مدت زمان رسیدگی معاونت فنی</td>
                                                        <td>مدت زمان رسیدگی واحد مالی</td> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.inv.map((a, i) => <tr key={i}>
                                                        <td>{a.no_id}</td>
                                                        <td>{a.inv_start_date}</td>
                                                        <td>{a.inv_end_date}</td>
                                                        <td>{a.inv_letter_date_branch}</td>
                                                        <td>{a.inv_letter_date_manager}</td>
                                                        <td>{a.inv_app_letter_date_employer}</td>
                                                        <td>{a.inv_pay_pay_date}</td>
                                                        <td>{parseFloat(a.inv_manager_price) ? parseFloat(a.inv_manager_price).toLocaleString() : ''}</td>
                                                        <td>{parseFloat(a.inv_app_price) ? parseFloat(a.inv_app_price).toLocaleString() : ''}</td>
                                                        <td>{parseFloat(a.inv_pay_price) ? parseFloat(a.inv_pay_price).toLocaleString() : ''}</td>
                                                        <td>{a.diff1}</td>
                                                        {/* <td>{a.diff2}</td>
                                                        <td>{a.diff3}</td> */}
                                                    </tr>)}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )
        }
    }
}

export default DashboardExecute;