import React, { Component } from 'react';
import observer from '../../infrastructure/observer'

import {
  isAuthenticated,
  getCurrentUserDisplayName,
  logout,
  getCurrentUserId
} from './../../api/auth';

import { Link } from 'react-router-dom'

class Header extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isAuth: false,
      displayName: null,
      uid: null
    }

    observer.subscribe(observer.events.loginUser, this.loginUser)
  }

  componentDidMount = () => {
    this.setState({
      isAuth: isAuthenticated()
    })

    if (isAuthenticated()) {
      this.setState({
        displayName: getCurrentUserDisplayName(),
        uid: getCurrentUserId()
      })
    }
  }

  loginUser = (data) => {
    this.setState({
      isAuth: true,
      displayName: getCurrentUserDisplayName()
    })
  }

  signOut = () => {
    logout()
      .then((data) => {
        observer.trigger(observer.events.logoutUser, data)
        this.setState({ isAuth: false, displayName: null });
        console.log('Logout successfull')
      })
  }

  render = () => {
    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
          <Link className="navbar-brand" to="/">Free Forum</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarsExampleDefault">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link className="nav-link" to="/">Home
                 <span className="sr-only">(current)</span>
                </Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="/threads">
                  Threads
                </Link>
              </li>
            </ul>
            {this.state.displayName ?
              <div className="my-2 my-lg-0">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item" aria-controls="navbarsExampleDefault"
                    aria-expanded="false"
                    aria-label="Toggle navigation" data-target="#navbarsExampleDefault"
                    data-toggle="collapse">
                    <Link className="nav-link" to="/user" >
                      {this.state.displayName}
                    </Link>
                  </li>
                  <li className="nav-item" aria-controls="navbarsExampleDefault"
                    aria-expanded="false"
                    aria-label="Toggle navigation" data-target="#navbarsExampleDefault"
                    data-toggle="collapse">
                    <Link className="nav-link" to="/" onClick={this.signOut}>
                      Sign Out
                   </Link>
                  </li>
                </ul>
              </div>
              :
              <div className="my-2 my-lg-0">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item"
                    aria-controls="navbarsExampleDefault" aria-expanded="false"
                    aria-label="Toggle navigation"
                    data-target="#navbarsExampleDefault" data-toggle="collapse">
                    <Link className="nav-link" to="/signin">
                      Sign in
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link">
                      or
                    </a>
                  </li>
                  <li className="nav-item" aria-controls="navbarsExampleDefault"
                    aria-expanded="false"
                    aria-label="Toggle navigation" data-target="#navbarsExampleDefault"
                    data-toggle="collapse">
                    <Link className="nav-link" to="/signup">
                      Sign up
                    </Link>
                  </li>
                </ul>
              </div>
            }
          </div>
        </nav>
      </div>
    )
  }
}

export default Header; 
