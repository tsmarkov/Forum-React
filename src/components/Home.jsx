import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import observer from '../infrastructure/observer';
import {
  getCurrentUserDisplayName,
  isAuthenticated
} from '../api/auth'

class Home extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isAuth: false,
      displayName: null
    }

    observer.subscribe(observer.events.loginUser, this.onLoginUser)
    observer.subscribe(observer.events.logoutUser, this.onLogoutUser)
  }

  componentDidMount() {
    this.setState({
      isAuth: isAuthenticated(),
      displayName: getCurrentUserDisplayName()
    })
  }

  componentWillUnmount() {
    observer.unsubscribe(observer.events.loginUser, this.onLoginUser);
    observer.unsubscribe(observer.events.logoutUser, this.onLogoutUser);
  }

  onLoginUser = (data) => {
    this.setState({
      isAuth: true,
      displayName: getCurrentUserDisplayName()
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
              <h1 className="jumbotron-heading">Welcome {this.state.displayName}!</h1> :
              <p><Link to="/signin" className="btn btn-primary my-2">Join now</Link></p>
            }
            <p className="lead text-muted">Something short and leading about the collection below—its contents, the creator, etc. Make it short and sweet, but not too short so folks don't simply skip over it entirely.</p>
          </div>
        </section>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h2>Heading</h2>
              <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
              <p><a className="btn btn-secondary" href="/" role="button">View details »</a></p>
            </div>
            <div className="col-md-4">
              <h2>Heading</h2>
              <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
              <p><a className="btn btn-secondary" href="/" role="button">View details »</a></p>
            </div>
            <div className="col-md-4">
              <h2>Heading</h2>
              <p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
              <p><a className="btn btn-secondary" href="/" role="button">View details »</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;