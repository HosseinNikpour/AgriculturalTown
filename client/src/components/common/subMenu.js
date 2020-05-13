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
                return (<div style={{ paddingTop:'8px' ,marginRight: '50px', fontSize: '13px' }}> </div>)
            case 1:
                return (<ul>
                    <li className={this.menuClassNames(1)} onMouseEnter={() => this.menuHandleHover(1)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(1)}> <Link to="/company" > شناسنامه شرکتها </Link></li>
                    <li className={this.menuClassNames(2)} onMouseEnter={() => this.menuHandleHover(2)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(2)}> <Link to="/town" > شناسنامه شهرکها </Link></li>
                    <li className={this.menuClassNames(3)} onMouseEnter={() => this.menuHandleHover(3)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(3)}> <Link to="/project" > شناسنامه پروژه </Link></li>
                    <li className={this.menuClassNames(4)} onMouseEnter={() => this.menuHandleHover(4)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(4)}> <Link to="/contract" > شناسنامه قرارداد </Link></li>
                    {/* <li className={this.menuClassNames(5)} onMouseEnter={() => this.menuHandleHover(5)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(5)}> <Link to="/" > تغییر مقادیر </Link></li>
                    <li className={this.menuClassNames(6)} onMouseEnter={() => this.menuHandleHover(6)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(6)}> <Link to="/" > ابلاغ افزایش قرارداد </Link></li> */}
                    <li className={this.menuClassNames(7)} onMouseEnter={() => this.menuHandleHover(7)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(7)}> <Link to="/extension" > تمدید مدت قرارداد </Link></li>
                    {/* <li className={this.menuClassNames(8)} onMouseEnter={() => this.menuHandleHover(8)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(8)}> <Link to="/" > چرخه پیمان </Link></li>
                    <li className={this.menuClassNames(9)} onMouseEnter={() => this.menuHandleHover(9)} onMouseLeave={this.menuHandleBlur} onClick={() => this.menuHandleClick(9)}> <Link to="/" > بیمه </Link></li> */}
                </ul>)
                 case 2:
                    return (<ul>
                        <li className={this.menuClassNames(1)}  onClick={() => this.menuHandleClick(1)}> <Link to="/wbs" > ساختار شکست</Link></li>
                        <li className={this.menuClassNames(2)}  onClick={() => this.menuHandleClick(2)}> <Link to="/weeklyOperation" > گزارش هفتگی عملیات اجرایی </Link></li>
                        <li className={this.menuClassNames(3)}  onClick={() => this.menuHandleClick(3)}> <Link to="/weeklyOperationPlan" > برنامه عملیات هفتگی</Link></li>
                    
                    </ul>)
                      case 3:
                        return (<ul>
                            <li className={this.menuClassNames(1)}  onClick={() => this.menuHandleClick(1)}> <Link to="/tempDelivery" > تحویل موقت </Link></li>
                            <li className={this.menuClassNames(2)}  onClick={() => this.menuHandleClick(2)}> <Link to="/delivery" >تحویل قطعی </Link></li>                       
                        </ul>)
            default:
                return (<div></div>)
        }
    }

}

export default SubMenu;