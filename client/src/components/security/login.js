
import React, { useState } from 'react';
import { login } from '../../api/index'
import { useLocation, useHistory } from 'react-router-dom';
// const emptyItem = { username: '', password: '' };

const Login = (props) => {
    const location = useLocation();
    const history = useHistory();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handelLogin = () => {
        login({ username, password }).then((response) => {
            if (response.data.message === 'ok') {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
                let url = '/';
                if (location && location.state && location.state.from && location.state.from.pathname)
                    url = location.state.from.pathname;

                history.push(url);
            }
        }).catch((error) => console.log(error))
    }

    return (
        <div className="app-main col-12">
            <div className="row" >
                <div className="col-4"></div>
                <div className="col-xs-9 col-md-4">
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
                                            <input name="username" className="form-control" onChange={(e) => setUsername(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="password" className="">کلمه عبور</label>

                                            <input name="password" className="form-control" onChange={(e) => setPassword(e.target.value)}
                                                type="password" />

                                        </div>
                                    </div>
                                </div>
                                <input type="button" className="btn btn-primary" style={{ margin: "10px" }}
                                    onClick={() => handelLogin()} value="ورود" onKeyPress={event => {
                                        if (event.key === 'Enter') {
                                            handelLogin()
                                        }
                                    }} />
                                <input type="button" className="btn btn-outline-primary" style={{ margin: "10px" }} value="بستن" />

                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-4"></div>
            </div>
        </div>

    );

};

export default Login;