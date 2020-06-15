import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";


import './assets/css/bootstrapV441.rtl.css';
import './assets/css/fontawesome.css';

import './assets/css/custom.css';

import logo from './assets/img/abg.png'
import farm from './assets/img/arm.png'

import SubMenu from './components/common/subMenu';
//per 
import PrivateRoute from './components/security/PrivateRoute'
import Login from './components/security/login'

//super admin level

//admin level
import User from './forms/admin/user/index';
import BaseInfo from './forms/baseInfo/baseInfo/index';
import Period from './forms/baseInfo/period/index';
import Operation from './forms/baseInfo/operation/index'
import WBS from './forms/execution/wbs/index'
import PermissionStructure from './forms/admin/perStructure/index'

//user level
import Company from './forms/contracts/company/index'
import Town from './forms/contracts/town/index'
import Contract from './forms/contracts/contract/index'
import Agreement from './forms/contracts/agreement/index'
import Project from './forms/contracts/project/index'
import Extension from './forms/contracts/extension/index'
import ValueChange from './forms/contracts/valueChange/index'
import ContractCycle from './forms/contracts/contractCycle/index'
import ProjectCycle from './forms/contracts/projectCycle/index'
import Insurance from './forms/contracts/insurance/index'
import InsuranceAppendix from './forms/contracts/insuranceAppendix/index'

import Tender from './forms/tender/tender/index'

import Delivery from './forms/delivery/delivery/index'
import TempDelivery from './forms/delivery/tempDelivery/index'

import WeeklyOperation from './forms/execution/weeklyOperation/index'
import WeeklyWeather from './forms/execution/weeklyWeather/index'
import WeeklyUser from './forms/execution/weeklyUser/index'
import WeeklyMachine from './forms/execution/weeklyMachine/index'

import CreditPredict from './forms/financial/creditPredict/index'
import InvoiceConsultant from './forms/financial/invoiceConsultant/index'
import InvoiceContractor from './forms/financial/invoiceContractor/index'
import PayInvoiceConsultant from './forms/financial/payInvoiceConsultant/index'
import PayInvoiceContractor from './forms/financial/payInvoiceContractor/index'


import Home from './components/home'
import Test from './components/test'

class App extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      topMenuHovered: 0,
      topMenuClicked: 0,
      showSettingMenu: false,
      currentUser: {}
    };
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.topMenuHandleBlur = this.topMenuHandleBlur.bind(this);
    this.topMenuHandleHover = this.topMenuHandleHover.bind(this);
    this.topMenuHandleClick = this.topMenuHandleClick.bind(this);
    this.settingClick = this.settingClick.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }
  onLogout() {
  
    this.setState({ currentUser: {} });
    localStorage.clear();
    window.location.reload();
  }
  onLogin() {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : undefined;
    if (user)
      this.setState({ currentUser: { name: user.name, lastLoginDate: user.last_login, role_id: user.role_id } });

  }
  componentDidMount() {
    this.onLogin();
    document.addEventListener('mousedown', this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  settingClick() {
    this.setState(prevState => ({
      showSettingMenu: !prevState.showSettingMenu
    }));
  }
  topMenuHandleClick(i) {
    this.setState({ topMenuClicked: i });
  }
  topMenuHandleHover(i) {
    this.setState({ topMenuHovered: i });
  }
  topMenuHandleBlur() {
    this.setState({ topMenuHovered: -1 });
  }
  menuClassNames(i) {
    let names = [''];
    if (this.state.topMenuHovered === i)
      names.push('zoom', '');
    if (this.state.topMenuClicked === i)
      names.push('activeMenu');
    return names.join(' ');
  }


  setWrapperRef(node) {
    this.wrapperRef = node;
  }
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      // console.log('You clicked outside of me!');
      //console.log(event.target)
      if (this.state.showSettingMenu)
        this.setState({ showSettingMenu: false })
    }
  }
  render() {
    return (
      <Router>

        <div className='container-fluid' dir="RTL">
          <div className='row topRiboon'>
            <div className=" main-ribon"> سامانه مدیریت پروژه شرکت شهرک های کشاورزی  </div>
            <div className="col-1 ml-auto" >

              <i className={this.state.currentUser.role_id && this.state.currentUser.role_id >3 ? "fas fa-tools" : 'hidden'}
                style={{ margin: '8px', cursor: 'pointer', color: '#bdbdbd' }} onClick={this.settingClick}></i>

              <div className={this.state.showSettingMenu ? "dropdown-menu show" : "dropdown-menu"} ref={this.setWrapperRef}>
                <Link onClick={() => this.setState({ showSettingMenu: false })} className="dropdown-item" to="/baseinfo" >اطلاعات پایه</Link>
                <Link onClick={() => this.setState({ showSettingMenu: false })} className="dropdown-item" to="/period" >دوره ها</Link>
                <Link onClick={() => this.setState({ showSettingMenu: false })} className="dropdown-item" to="/operation" >عملیات اجرایی</Link>
                <Link onClick={() => this.setState({ showSettingMenu: false })} className="dropdown-item" to="/user" >مدیریت کاربران </Link>
                 <Link onClick={() => this.setState({ showSettingMenu: false })} className="dropdown-item" to="/permissionStructure" >مدیریت دسترسی ها</Link> 
              </div>

            </div>
            <div className="col-1">
              <div className='top-left'>
                <i className="fas fa-user" style={{ color: '#bdbdbd', margin: '8px 10px 7px' }}></i>
                <span className='nameofuser'> {this.state.currentUser.name} </span>
              </div>
              {this.state.currentUser.name && <div className="logout" onClick={this.onLogout} style={{ marginTop: '-34px' }}>
                خروج
            </div>}
            </div>
          </div>
          <div className='row navagition'>
            <div className='col-3'>
              <img src={logo} style={{ width: '15%',float:'right' , marginTop: '3%',paddingTop:'3%' }} />
              <div className='logoName'> مهندسین مشاور آبگستران میهن</div>

            </div>
            <div className='col-8'>
              <ul>
                <li >
                  <div className={this.menuClassNames(0)} onMouseEnter={() => this.topMenuHandleHover(0)} onMouseLeave={this.topMenuHandleBlur} onClick={() => this.topMenuHandleClick(0)}>
                    <i className="fa fa-home" ></i>
                    خانه
                  </div>
                </li>
                <li >
                  <div className={this.menuClassNames(1)} onMouseEnter={() => this.topMenuHandleHover(1)} onMouseLeave={this.topMenuHandleBlur} onClick={() => this.topMenuHandleClick(1)}>
                    <i className="far fa-file-contract" ></i>
                    قراردادها
                  </div>
                </li>
                <li >
                  <div className={this.menuClassNames(2)} onMouseEnter={() => this.topMenuHandleHover(2)} onMouseLeave={this.topMenuHandleBlur} onClick={() => this.topMenuHandleClick(2)}>
                    <i className="fas fa-chart-line" ></i>
                        پیشرفت
                  </div>
                </li>
                <li>
                  <div className={this.menuClassNames(3)} onMouseEnter={() => this.topMenuHandleHover(3)} onMouseLeave={this.topMenuHandleBlur} onClick={() => this.topMenuHandleClick(3)}>
                    <i className="fa fa-handshake"></i>
                        تحویل
                  </div>
                </li>
                <li>
                  <div className={this.menuClassNames(4)} onMouseEnter={() => this.topMenuHandleHover(4)} onMouseLeave={this.topMenuHandleBlur} onClick={() => this.topMenuHandleClick(4)}>
                    <i className="fas fa-donate" ></i>
                        مالی
                  </div>
                </li>
                <li>
                  <div className={this.menuClassNames(5)} onMouseEnter={() => this.topMenuHandleHover(5)} onMouseLeave={this.topMenuHandleBlur} onClick={() => this.topMenuHandleClick(5)}>
                    <i className="fas fa-gavel" ></i>
                          مناقصه
                  </div>
                </li>
                <li>
                  <div className={this.menuClassNames(6)} onMouseEnter={() => this.topMenuHandleHover(6)} onMouseLeave={this.topMenuHandleBlur} onClick={() => this.topMenuHandleClick(6)}>
                    <i className="fas fa-file-signature" ></i>
                  گزارشات
                  </div>
                </li>
                <li>
                  <div className={this.menuClassNames(7)} onMouseEnter={() => this.topMenuHandleHover(7)} onMouseLeave={this.topMenuHandleBlur} onClick={() => this.topMenuHandleClick(7)}>
                    <i className="fas fa-bell" ></i>
                  هشدارها
                  </div>
                </li>

              </ul>
            </div>
            <div className='col-1 farmcol'>
              <img className='farmlogo' src={farm} style={{ width: '93px', marginTop: "10px" }} />
            </div>
          </div>
          <div className='row subNavagition'>
            <SubMenu type={this.state.topMenuClicked}></SubMenu>
          </div>
          <div className='row content'>
            <Switch>
              <PrivateRoute path="/baseInfo" component={BaseInfo} role="admin" />
              <PrivateRoute path="/period" component={Period} role="admin" />
              <PrivateRoute path="/operation" component={Operation} role="admin" />
              <PrivateRoute path="/wbs" component={WBS} role="admin" />
              <PrivateRoute path="/user" component={User} role="admin" />
              <PrivateRoute path="/permissionStructure" component={PermissionStructure} role="admin" />

              <PrivateRoute path="/company" component={Company} />
              <PrivateRoute path="/town" component={Town} />
              <PrivateRoute path="/contract" component={Contract} />
              <PrivateRoute path="/agreement" component={Agreement} />
              <PrivateRoute path="/project" component={Project} />
              <PrivateRoute path="/extension" component={Extension} />
              <PrivateRoute path="/tempDelivery" component={TempDelivery} />
              <PrivateRoute path="/delivery" component={Delivery} />
              <PrivateRoute path="/payInvoiceContractor" component={PayInvoiceContractor} />
              <PrivateRoute path="/payInvoiceConsultant" component={PayInvoiceConsultant} />
              <PrivateRoute path="/invoiceContractor" component={InvoiceContractor} />
              <PrivateRoute path="/invoiceConsultant" component={InvoiceConsultant} />
              <PrivateRoute path="/creditPredict" component={CreditPredict} />
              <PrivateRoute path="/weeklyOperation" component={WeeklyOperation} />
              <PrivateRoute path="/weeklyWeather" component={WeeklyWeather} />
              <PrivateRoute path="/weeklyMachine" component={WeeklyMachine} />
              <PrivateRoute path="/weeklyUser" component={WeeklyUser} />

              <PrivateRoute path="/contractCycle" component={ContractCycle} />
              <PrivateRoute path="/projectCycle" component={ProjectCycle} />
              <PrivateRoute path="/valueChange" component={ValueChange} />
              <PrivateRoute path="/tender" component={Tender} />

              <PrivateRoute path="/insurance" component={Insurance} />
               <PrivateRoute path="/insuranceAppendix" component={InsuranceAppendix} />

              <Route path="/test">
                <Test />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <PrivateRoute path="/" component={Home} onLogin={this.onLogin} />
              {/* <Route path="/">
                <Home />
              </Route> */}

            </Switch>
          </div>
        </div>
      </Router>

    );
  }


}

export default App;