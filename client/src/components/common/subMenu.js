import React, { Component } from 'react';
import { Link } from "react-router-dom";

class SubMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            menuHovered: 0,
            menuClicked: 0,
        }
        this.menuHandleBlur = this.menuHandleBlur.bind(this);
        this.menuHandleHover = this.menuHandleHover.bind(this);
        this.menuHandleClick = this.menuHandleClick.bind(this);
    }
    componentWillReceiveProps({ type }) {
        this.setState({ type })
    }
    menuHandleClick(i) {
        this.setState({ menuClicked: i });
    }
    menuHandleHover(i) {
        // this.setState({ menuHovered: i });
    }
    menuHandleBlur() {
        // this.setState({ menuHovered: 0 });
    }
    menuClassNames(i) {
        let names = [''];
        if (this.state.menuHovered === i)
            names.push('animated', 'bounceIn');
        if (this.state.menuClicked === i)
            names.push('activeSubMenu');
        return names.join(' ');
    }
    render() {
        switch (this.state.type) {
            case 0:
                return (<div style={{ paddingTop: '8px', marginRight: '50px', fontSize: '13px' }}> </div>)
            case 1:
                return (<ul>
                    <li className={this.menuClassNames(1)} onMouseEnter={() => this.menuHandleHover(1)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(1)}> <Link to="/company" > شناسنامه شرکتها </Link></li>
                    <li className={this.menuClassNames(2)} onMouseEnter={() => this.menuHandleHover(2)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(2)}> <Link to="/town" > شناسنامه شهرکها </Link></li>
                    <li className={this.menuClassNames(3)} onMouseEnter={() => this.menuHandleHover(3)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(3)}> <Link to="/contract" > شناسنامه پیمان </Link></li>
                    <li className={this.menuClassNames(4)} onMouseEnter={() => this.menuHandleHover(4)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(4)}> <Link to="/agreement" > شناسنامه قرارداد </Link></li>
                    <li className={this.menuClassNames(5)} onMouseEnter={() => this.menuHandleHover(5)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(5)}> <Link to="/valuechange" > تغییر مقادیر </Link></li>
                    <li className={this.menuClassNames(7)} onMouseEnter={() => this.menuHandleHover(7)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(7)}> <Link to="/extension" > تمدید مدت قرارداد </Link></li>
                    <li className={this.menuClassNames(8)} onMouseEnter={() => this.menuHandleHover(8)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(8)}> <Link to="/contractCycle" > چرخه پیمان </Link></li>
                    <li className={this.menuClassNames(6)} onMouseEnter={() => this.menuHandleHover(6)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(6)}> <Link to="/projectCycle" > چرخه قرارداد </Link></li>

                    <li className={this.menuClassNames(9)} onMouseEnter={() => this.menuHandleHover(9)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(9)}> <Link to="/insurance" > بیمه </Link></li>
                    <li className={this.menuClassNames(10)} onMouseEnter={() => this.menuHandleHover(10)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(10)}> <Link to="/insuranceAppendix" > الحاقیه بیمه </Link></li>
                </ul>)
            case 2:
                return (<ul>
                    <li className={this.menuClassNames(1)} onClick={() => this.menuHandleClick(1)}> <Link to="/wbs" > ساختار شکست</Link></li>
                    <li className={this.menuClassNames(2)} onClick={() => this.menuHandleClick(2)}> <Link to="/weeklyOperation" > گزارش هفتگی عملیات اجرایی </Link></li>
                    <li className={this.menuClassNames(3)} onClick={() => this.menuHandleClick(3)}> <Link to="/weeklyWeather" > گزارش هفتگی وضعیت جوی</Link></li>
                    <li className={this.menuClassNames(4)} onClick={() => this.menuHandleClick(4)}> <Link to="/weeklyUser" > گزارش هفتگی نیروی انسانی</Link></li>
                    <li className={this.menuClassNames(5)} onClick={() => this.menuHandleClick(5)}> <Link to="/weeklyMachine" > گزارش هفتگی ماشین آلات</Link></li>
                    <li className={this.menuClassNames(6)} onClick={() => this.menuHandleClick(6)}> <Link to="/studyWbs" > ساختار شکست مطالعات</Link></li>
                    <li className={this.menuClassNames(7)} onClick={() => this.menuHandleClick(7)}> <Link to="/studyOperation" > پیشرفت مطالعات</Link></li> 
                    <li className={this.menuClassNames(8)} onClick={() => this.menuHandleClick(8)}> <Link to="/weeklyOperationPlan" > برنامه زمانبندی عملیات اجرایی </Link></li>
                </ul>)
            case 3:
                return (<ul>
                    <li className={this.menuClassNames(1)} onClick={() => this.menuHandleClick(1)}> <Link to="/tempDelivery" > تحویل موقت </Link></li>
                    <li className={this.menuClassNames(2)} onClick={() => this.menuHandleClick(2)}> <Link to="/delivery" >تحویل قطعی </Link></li>
                </ul>)
            case 4:
                return (<ul>
                    <li className={this.menuClassNames(1)} onClick={() => this.menuHandleClick(1)}> <Link to="/invoiceContractor" >صورت وضعیت - مدیر طرح</Link></li>
                    <li className={this.menuClassNames(3)} onClick={() => this.menuHandleClick(3)}> <Link to="/invoiceContractorApprove" >صورت وضعیت - تایید کارفرما</Link></li>
                    <li className={this.menuClassNames(6)} onClick={() => this.menuHandleClick(6)}> <Link to="/invoiceContractorPay" >  صورت وضعیت - پرداخت</Link></li>
                    <li className={this.menuClassNames(2)} onClick={() => this.menuHandleClick(2)}> <Link to="/invoiceConsultant" > صورت حساب - مدیر طرح</Link></li>
                    <li className={this.menuClassNames(4)} onClick={() => this.menuHandleClick(4)}> <Link to="/invoiceConsultantApprove" >صورت حساب - تایید کارفرما</Link></li>
                    <li className={this.menuClassNames(7)} onClick={() => this.menuHandleClick(7)}> <Link to="/invoiceConsultantPay" >صورت حساب - پرداخت </Link></li>
                    <li className={this.menuClassNames(5)} onClick={() => this.menuHandleClick(5)}> <Link to="/creditPredict" >پیش بینی اعتبار</Link></li>
                </ul>)
            case 5:
                return (<ul>
                    <li className={this.menuClassNames(1)} onClick={() => this.menuHandleClick(1)}> <Link to="/tender" >مناقصه</Link></li>

                </ul>)
            case 6:
                return (<ul>
                    <li className={this.menuClassNames(1)} onClick={() => this.menuHandleClick(1)}> <Link to="/report-excel" >گزارشات اکسلی</Link></li>
                    <li className={this.menuClassNames(2)} onClick={() => this.menuHandleClick(2)}> <Link to="/report-web" >گزارشات آنلاین</Link></li>
                    {/* <li className={this.menuClassNames(3)} onClick={() => this.menuHandleClick(3)}> <Link to="/report-table" >گزارشات جدولی</Link></li> */}
                    <li className={this.menuClassNames(4)} onClick={() => this.menuHandleClick(4)}> <Link to="/report-dashboard" >داشبرد پیمان</Link></li>
                </ul>)
                 case 7:
                    return (<ul>
                        <li className={this.menuClassNames(1)} onClick={() => this.menuHandleClick(1)}> <Link to="/notif_invoice" >صورت وضعیت</Link></li>
                        <li className={this.menuClassNames(2)} onClick={() => this.menuHandleClick(2)}> <Link to="/notif_insurance" >بیمه</Link></li>
                        <li className={this.menuClassNames(3)} onClick={() => this.menuHandleClick(3)}> <Link to="/notif_zamin" >تحویل زمین</Link></li>                        
                        <li className={this.menuClassNames(4)} onClick={() => this.menuHandleClick(4)}> <Link to="/notif_extension" >تمدید</Link></li>
                        <li className={this.menuClassNames(5)} onClick={() => this.menuHandleClick(5)}> <Link to="/notif_pishraft" >پیشرفت فیزیکی</Link></li>
                    </ul>)
            default:
                return (<div></div>)
        }
    }

}

export default SubMenu;