import React from 'react';
import ReactDOM from 'react-dom';
//import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import App from './App';
import * as serviceWorker from './serviceWorker';
// import PrivateRoute from './components/security/PrivateRoute'
// import Login from './components/security/login'

ReactDOM.render(
  <React.StrictMode>
    {/* <Router>
      <Switch>
        <PrivateRoute path="/" component={App} />
        <Route path="/login">
                <Login />
              </Route>
      </Switch>
     
    </Router> */}
     <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
