import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import observer from '../../infrastructure/observer'
import * as auth from '../../api/auth';

class SignIn extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email: null,
      password: null,
      redirect: false
    }
  }

  componentDidMount() {
    if (auth.isAuthenticated()) {
      this.setState({
        redirect: true
      })
    }
  }

  handleChange = (event) => {
    let fieldName = event.target.name
    let fieldValue = event.target.value

    this.setState({
      [fieldName]: fieldValue
    })
  }

  signIn = (event) => {
    event.preventDefault()

    let email = event.target.email.value;
    let password = event.target.password.value;

    auth.login(email, password)
      .then((data) => {
        observer.trigger(observer.events.loginUser, data);
        console.log('Sign in successfull');

        this.setState({
          redirect: true
        })
      })
      .catch((err) => {
        console.error(err);
      })
  }

  render() {
    return (
      <div className="container">
        <br />
        {this.state.redirect ?
          <Redirect to="/" /> :
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <div className="login-panel panel panel-default">
                <div className="panel-heading text-center">
                  <h3 className="panel-title">Sign In</h3>
                  <hr />
                </div>
                <div className="panel-body">
                  <form method="POST" onSubmit={this.signIn}>
                    <fieldset className="text-center">
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
                      <button type="submit" className="btn btn-md btn-primary">Sign In</button>
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-4"></div>
          </div>
        }
      </div >
    )
  }
}

export default SignIn
