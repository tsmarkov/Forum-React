import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import observer from '../../infrastructure/observer'
import * as auth from './../../api/auth';

const DEFAULT_PROFILE_PIC = 'http://olc.org/wp-content/uploads/2018/06/user_profile.jpg';

class SignUp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: null,
      password: null,
      redirect: false,
      error: false
    }
  }

  componentDidMount() {
    if (auth.isAuthenticated()) {
      this.setState({
        redirect: true
      })
      return;
    }
  }

  handleChange = (event) => {
    let fieldName = event.target.name
    let fieldValue = event.target.value

    this.setState({
      [fieldName]: fieldValue
    })
  }

  signUp = (event) => {
    event.preventDefault();

    let displayName = event.target.username.value;
    let email = event.target.email.value;
    let password = event.target.password.value;
    let passwordConfirm = event.target.password_confirm.value;


    if (password !== passwordConfirm) {
      this.setState({
        error: 'Passwords must match'
      })

      setTimeout(() => {
        this.setState({
          error: false
        })
      }, 5000)
    }

    auth.register(email, password, displayName, DEFAULT_PROFILE_PIC)
      .then((regRes) => {
        auth.updateUser(displayName, DEFAULT_PROFILE_PIC)
          .then((upRes) => {
            auth.login(email, password)
              .then((logRes) => {

                observer.trigger(observer.events.loginUser, logRes);

                console.log('Sign up successfull')
                this.setState({
                  redirect: true
                })
              })
          })
      })
      .catch((err) => console.error(err.message))
  }

  render() {
    return (
      <div className="container">
        <br />
        {this.state.redirect ?
          <Redirect to="/" /> :
          <div className="row">
          <br/>
            {this.state.error !== false ?
              <div className="p-5 text-red text-center">
                <h1 style="color: red">{this.state.error}</h1>
              </div>
              : <div></div>
            }
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <div className="login-panel panel panel-default">
                <div className="panel-heading text-center">
                  <h3 className="panel-title">Sign Up</h3>
                  <hr />
                </div>
                <div className="panel-body">
                  <form onSubmit={this.signUp}>
                    <fieldset className="text-center">
                      <div className="form-group">
                        <input className="form-control"
                          placeholder="Full Name"
                          name="username"
                          type="text"
                          onChange={this.handleChange} />
                      </div>
                      <div className="form-group">
                        <input className="form-control"
                          placeholder="E-mail"
                          name="email"
                          type="email"
                          onChange={this.handleChange} />
                      </div>
                      <div className="form-group">
                        <input className="form-control"
                          placeholder="Password"
                          name="password"
                          type="password"
                          onChange={this.handleChange} />
                      </div>
                      <div className="form-group">
                        <input className="form-control"
                          placeholder="Confirm Password"
                          name="password_confirm"
                          type="password"
                          onChange={this.handleChange} />
                      </div>
                      <button type="submit" className="btn btn-md btn-primary">Sign Up</button>
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-4"></div>
          </div>
        }
      </div>
    );
  }
}

export default SignUp;