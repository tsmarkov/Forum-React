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
              <h2>Quis autem vel eum iure reprehenderit </h2>
              <p>Ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.</p>
              <p><Link className="btn btn-secondary" to="/thread/1535615620028" role="button">View details »</Link></p>
            </div>
            <div className="col-md-4">
              <h2>At vero eos et accusamus et iusto odio dignissimos.</h2>
              <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
              <p><Link className="btn btn-secondary" to="/thread/1535615620028" role="button">View details »</Link></p>
            </div>
            <div className="col-md-4">
              <h2> First Thread</h2>
              <p> Om, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laboru </p>
              <p><Link className="btn btn-secondary" to="/thread/1535610336290" role="button">View details »</Link></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;