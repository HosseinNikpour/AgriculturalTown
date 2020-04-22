import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link,Redirect } from "react-router-dom";
// import { verifyToken } from './api/index';
// import { withRouter } from "react-router";

import './assets/css/bootstrapV441.rtl.css';
import './assets/css/fontawesome.css';
//import './assets/css/animate.css';

import './assets/css/custom.css';

import logo from './assets/img/abg.png'
import farm from './assets/img/farm.png'

import SubMenu from './components/common/subMenu';
//per 
import PrivateRoute from './components/security/PrivateRoute'
import Login from './components/security/login'

//super admin level

//admin level
import User from './forms/admin/user/index';
import BaseInfo from './forms/baseInfo/baseInfo/index';
import PermissionStructure from './forms/admin/perStructure/index'

//user level
import Company from './forms/contracts/company/index'
import Town from './forms/contracts/town/index'
import Contract from './forms/contracts/contract/index'

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
    this.topMenuHandleBlur = this.topMenuHandleBlur.bind(this);
    this.topMenuHandleHover = this.topMenuHandleHover.bind(this);
    this.topMenuHandleClick = this.topMenuHandleClick.bind(this);
    this.settingClick = this.settingClick.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }
  onLogout() {
    localStorage.clear();
    this.setState({ currentUser: {} });
  }
  onLogin() {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : undefined;
    if (user)
      this.setState({ currentUser: { name: user.name, lastLoginDate: user.last_login } });

  }
  componentDidMount() {
    this.onLogin();
    // var originalSetItem = localStorage.setItem;
    // localStorage.setItem = function () {
    //   document.createEvent('Event').initEvent('itemInserted', true, true);
    //   originalSetItem.apply(this, arguments);
    // //  this.onLogin();
    // }

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
  render() {
    // if (!this.state.currentUser.name){
    //   console.log('22222')
    //   return (<Router><Switch><Redirect to={{ pathname: '/login', state: { from: '/' } }}/></Switch></Router>)
    // }
    // else
      return (
        <Router>
          <div className=" main-ribon"> سامانه مدیریت پروژه شرکت شهرک های کشاورزی  </div>
          <div className='container-fluid' dir="RTL">
            <div className='row topRiboon'>

              <div className="col-1 ml-auto">

                <i className="fas fa-tools" style={{ margin: '12px', cursor: 'pointer', color: '#bdbdbd' }} onClick={this.settingClick}></i>

                <div className={this.state.showSettingMenu ? "dropdown-menu show" : "dropdown-menu"}>
                  <Link onClick={() => this.setState({ showSettingMenu: false })} className="dropdown-item" to="/baseinfo" >اطلاعات پایه</Link>
                  <Link onClick={() => this.setState({ showSettingMenu: false })} className="dropdown-item" to="/user" >مدیریت کاربران ها</Link>
                  <Link onClick={() => this.setState({ showSettingMenu: false })} className="dropdown-item" to="/permissionStructure" >مدیریت دسترسی ها</Link>
                </div>

              </div>
              <div className="col-1">
                <div className='top-left'>
                  <i className="fas fa-user" style={{ color: '#bdbdbd', margin: '11px 10px 7px' }}></i>
                  {this.state.currentUser.name}
                </div>
                {this.state.currentUser.name && <div className="logout" onClick={this.onLogout} style={{ marginTop: '-34px' }}>
                  خروج
            </div>}
              </div>
            </div>
            <div className='row navagition'>
              <div className='col-3'>
                <img src={logo} style={{ width: '50px', marginTop: '-24px' }} />
                <div className='logoName'> مهندسین مشاور آبگستران میهن</div>

              </div>
              <div className='col-7'>
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
                      <i className="fa fa-wrench" ></i>
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
                      <i className="fas fa-university" ></i>
                        مالی
                  </div>
                  </li>
                  <li>
                    <div className={this.menuClassNames(5)} onMouseEnter={() => this.topMenuHandleHover(5)} onMouseLeave={this.topMenuHandleBlur} onClick={() => this.topMenuHandleClick(5)}>
                      <i className="fa fa-balance-scale" ></i>
                          مناقصه
                  </div>
                  </li>
                  <li>
                    <div className={this.menuClassNames(6)} onMouseEnter={() => this.topMenuHandleHover(6)} onMouseLeave={this.topMenuHandleBlur} onClick={() => this.topMenuHandleClick(6)}>
                      <i className="fas fa-chart-bar" ></i>
                  گزارشات
                  </div>
                  </li>


                </ul>
              </div>
              <div className='col-2'>
                <img className='farmlogo' src={farm} style={{ width: '77px', marginTop: "10px" }} />
              </div>
            </div>
            <div className='row subNavagition'>
              <SubMenu type={this.state.topMenuClicked}></SubMenu>
            </div>
            <div className='row content'>
              <Switch>
                <PrivateRoute path="/baseInfo" component={BaseInfo} role="admin" />
                <PrivateRoute path="/user" component={User} role="admin" />
                <PrivateRoute path="/permissionStructure" component={PermissionStructure} role="admin" />

                <PrivateRoute path="/company" component={Company} />
                <PrivateRoute path="/town" component={Town} />
                <PrivateRoute path="/contract" component={Contract} />
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