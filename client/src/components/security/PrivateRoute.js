import React, { Component } from 'react';
import { Route, Redirect } from "react-router-dom";
import { verifyToken } from '../../api/index'

class PrivateRoute extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authenticated: 0
        }
    }
    componentDidMount() {

        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : undefined,
            token = localStorage.getItem('token') ? localStorage.getItem('token') : undefined;
        if (!user || !token) {
            this.setState({ authenticated: -1 });
        }
        else {
            verifyToken({ user, token }).then(response => {
                //todo : handel permission for admin role ===>props.role=='admin'
                //todo : check the response and then if it is  ok set state
                ///    console.log(response);
              //  console.log("user.role", user);
             //   console.log("page.role", this.props.role);

                if (typeof this.props.onLogin === 'function')
                    this.props.onLogin(5);
                if (this.props.role && this.props.role === 'admin')
                    if (user.role === 'admin' || user.role === 'superadmin')
                        this.setState({ authenticated: 1 });
                    else
                        this.setState({ authenticated: -1 });
                else
                    this.setState({ authenticated: 1 });
            }).catch((error) => {
                console.log(error);
                this.setState({ authenticated: -1 });
            });

        }
    }
    render() {
        if (this.state.authenticated === -1)
            return (<Redirect to={{ pathname: '/login', state: { from: this.props.location } }} />)

        if (this.state.authenticated > 0)
            return (<Route {...this.props} />)
        return (<div></div>)
    }
}
export default PrivateRoute;