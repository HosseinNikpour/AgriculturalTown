import React from 'react';
import ReactDOM from 'react-dom';
//import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import App from './App';
//import * as serviceWorker from './serviceWorker';
import { ConfigProvider } from 'antd';
import FA from 'antd/es/locale/fa_IR';


ReactDOM.render(
  <React.StrictMode>
     <ConfigProvider locale={FA}>
        <App />
        </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
