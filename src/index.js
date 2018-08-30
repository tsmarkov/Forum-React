import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom'

import 'react-notifications/lib/notifications.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import 'jquery/dist/jquery.min';
import 'react-popper/dist/index.umd';
import 'bootstrap/dist/js/bootstrap.min';

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
