
import React, { Component } from 'react';
import { login } from '../../api/index'
//import { useLocation, useHistory } from 'react-router-dom';
import { withRouter } from "react-router";
// import PropTypes from "prop-types";

class Login extends Component {

    _isMounted = false;
    // static propTypes = {
    //     match: PropTypes.object.isRequired,
    //     location: PropTypes.object.isRequired,
    //     history: PropTypes.object.isRequired
    // };
    constructor(prop) {
        super(prop);
        this.state = {
            obj: {
                username: '', password: ''
            }
        };
        this.handelLogin = this.handelLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        // this.setState({ username: '', password: '' });
        this._isMounted = true;
    }
    componentWillUnmount() {
        //this.setState({ username: '', password: '' });
        this._isMounted = false;
    }
    handleChange(e, name) {
        // debugger;
        let ob = this.state.obj;
        if (!name)
            ob[e.target.name] = e.target.value;
        else
            ob[name] = e;
        if (this._isMounted)
            this.setState({ obj: ob });
    }
    handelLogin() {
        console.log('im here')
        login({ username: this.state.obj.username, password: this.state.obj.password }).then((response) => {
            if (response.data.message === 'ok') {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
                let url = '/';
                const location = this.props.location;
                const history = this.props.history;
                if (location && location.state && location.state.from && location.state.from.pathname)
                    url = location.state.from.pathname;
                console.log(url);
            //    history.push(url);
            }
        }).catch((error) => console.log(error))
    }
    render() {
        return (
            <div className="app-main col-12" >
                <div className="row" >
                    <div className="col-4"></div>
                    <div className="col-4">
                        <div className="card">
                            <div className="card-header">
                                <div className='row'>
                                    <div className='col'>
                                        سامانه مدیریت پروژه
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <form>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="username" className="">نام کاربری</label>
                                                <input name="username" className="form-control" onChange={this.handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="password" className="">کلمه عبور</label>

                                                <input name="password" className="form-control" onChange={this.handleChange}
                                                    type="password" />

                                            </div>
                                        </div>
                                    </div>
                                    <input type="button" className="btn btn-primary" style={{ margin: "10px" }}
                                        onClick={this.handelLogin} value="ورود" />
                                    <input type="button" className="btn btn-outline-primary" style={{ margin: "10px" }} value="بستن" />

                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-4"></div>
                </div>
            </div>

        );
    }
};

export default withRouter(Login);