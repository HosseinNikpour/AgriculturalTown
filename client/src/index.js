import React from 'react';
import ReactDOM from 'react-dom';
//import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import App from './App';
import * as serviceWorker from './serviceWorker';

// import { LocaleProvider } from 'antd';
// import fa_IR from 'antd/lib/locale-provider/fa_IR';
// import 'moment/locale/fa';
// import moment from 'moment';
// moment.locale('fa');

ReactDOM.render(
  <React.StrictMode>
     {/* <LocaleProvider locale={fa_IR}> */}
        <App />
    {/* </LocaleProvider> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
