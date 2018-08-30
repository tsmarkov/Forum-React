import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom'


import Header from './components/shared/Header';
import Home from './components/Home';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Forum from './components/forum/Forum';
import CreateThread from './components/forum/threads/CreateThread';
import Thread from './components/forum/threads/Thread';
import EditThread from './components/forum/threads/EditThread';
import User from './components/user/User';
import Notifications, { notify } from 'react-notify-toast';

class App extends Component {
  render = () => {
    return (
      <main role="main">
        <Notifications />
        <Header />
        <Switch>
          {/* Home */}
          <Route path='/' exact component={Home} />

          {/* Authentication */}
          <Route path='/signup' exact component={SignUp} />
          <Route path='/signin' exact component={SignIn} />

          {/* Forum  */}
          <Route path='/threads' exact component={Forum} />
          <Route path='/thread/create' exact component={CreateThread} />
          <Route path='/thread/:id' exact component={Thread} />
          <Route path='/thread/edit/:id' exact component={EditThread} />

          {/* User */}
          <Route path='/user' exact component={User} />
        </Switch>
      </main >
    );
  }
}

export default App;