import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import observer from '../../infrastructure/observer';
import * as auth from '../../api/auth'

class User extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isAuth: false,
      user: null,
      displayName: null,
      redirect: false
    }

    observer.subscribe(observer.events.loginUser, this.onLoginUser)
    observer.subscribe(observer.events.logoutUser, this.onLogoutUser)
  }

  componentDidMount() {
    this.setState({
      isAuth: auth.isAuthenticated(),
      displayName: auth.getCurrentUserDisplayName()
    })

    if (auth.isAuthenticated()) {
      let uid = auth.getCurrentUserId();

      auth.getUserById(uid)
        .then((res) => {
          this.setState({
            user: res
          })
        })
    } else {
      this.setState({
        redirect: true
      })
    }
  }

  componentWillUnmount() {
    observer.unsubscribe(observer.events.loginUser, this.onLoginUser);
    observer.unsubscribe(observer.events.logoutUser, this.onLogoutUser);
  }

  onLoginUser = (data) => {
    this.setState({
      isAuth: true,
      displayName: auth.getCurrentUserDisplayName()
    })
  }

  onLogoutUser = () => {
    this.setState({
      isAuth: false,
      displayName: null
    })
  }

  render = () => {
    return (
      <div>
        <section className="jumbotron text-center">
          <div className="container">
            {this.state.isAuth ?
              <div>
                {this.state.user ?
                  <div className="container">
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <br />
                        <p>Email: {this.state.user.email}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-md-4"></div>
                      <div className="col-md-4 text-center">
                        <img src={this.state.user.photoURL} className="img-fluid" alt="profile pic" />
                      </div>
                      <div className="col-md-4"></div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <h1>{this.state.user.displayName}</h1>
                        <br />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4"></div>
                      <div className="col-md-4 text-center">
                        {this.state.user.location ?
                          <p>Location: {this.state.user.location}</p>
                          : <div hidden></div>
                        }
                      </div>
                      <div className="col-md-4"></div>
                    </div>
                    <div className="row">
                      <div className="col-md-4"></div>
                      <div className="col-md-4 text-center">
                        {this.state.user.admin ?
                          <span className="badge-info">Admin</span>
                          : <div hidden></div>
                        }
                      </div>
                      <div className="col-md-4"></div>
                    </div>
                    <div className="row">
                      <div className="col-md-4"></div>
                      <div className="col-md-4 text-center">
                        {this.state.user.website ?
                          <p>Website: {this.state.user.website}</p>
                          : <div hidden></div>
                        }
                      </div>
                      <div className="col-md-4"></div>
                    </div>
                  </div>
                  : <div><h2>Loading...</h2></div>
                }
              </div>
              :
              <p><Link to="/signin" className="btn btn-primary my-2">Join now</Link></p>
            }
          </div>
        </section>
      </div>
    );
  }
}

export default User;