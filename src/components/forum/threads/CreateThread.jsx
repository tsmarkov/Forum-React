import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'

import observer from '../../../infrastructure/observer';
import Notifications, { notify } from 'react-notify-toast';
import { saveThreadInUser, createThread } from './../../../api/threads';
import {
  getCurrentUserId,
  getCurrentUserDisplayName,
  isAuthenticated
} from '../../../api/auth'
import toastr from 'toastr'

class CreateThread extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isAuth: false,
      redirectToLogin: false,
      redirectToForum: false,
      title: '',
      description: '',
      category: '',
      uid: null
    }

    observer.subscribe(observer.events.logoutUser, this.onLogoutUser)
  }

  componentDidMount = () => {
    this.setState({
      isAuth: isAuthenticated(),
      uid: getCurrentUserId()
    })
  }

  //  Unsubscribe 
  componentWillUnmount = () => {
    observer.unsubscribe(observer.events.logoutUser, this.onLogoutUser);
  }

  // Redirect after logout
  onLogoutUser = () => {
    this.setState({
      isAuth: false,
      redirect: true
    })
  }

  // Update state on change of input fields
  handleChange = (event) => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;

    this.setState({
      [fieldName]: fieldValue
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let title = this.state.title;
    let description = this.state.description;
    let category = this.state.category;
    let uid = this.state.uid;


    createThread(title, description, category, uid)
      .then((res) => {
        let tid = res.tid;
        let creationDate = res.creationDate;

        saveThreadInUser(tid, uid, title, creationDate)
          .then(() => {

            console.log('SUccess');

            toastr.success('Suc ces').show()

            // let myColor = { background: '#0E1717', text: "#FFFFFF" };
            // notify.show("this is sample text", "custom", 5000, myColor);

            this.setState({
              redirectToForum: true
            })
          })
      })
      .catch(console.error)
  }

  render = () => {
    return (
      <div className="container">
        <br />
        <div className="row bg-light p-5">
          <div className="col-md-12">
            <h1>Thread create page</h1>
            <hr />
            <form onSubmit={this.handleSubmit}>
              <fieldset className="text-center">
                <div className="form-group">
                  <input className="form-control"
                    placeholder="Title"
                    name="title"
                    type="text"
                    onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <input className="form-control"
                    placeholder="Category"
                    name="category"
                    type="text"
                    onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <textarea className="form-control"
                    placeholder="Description"
                    name="description"
                    onChange={this.handleChange} />
                </div>
                <button type="submit" className="btn btn-md btn-primary">Create</button>
              </fieldset>
            </form>
          </div>
        </div>
        {this.state.redirectToLogin ? <Redirect to="/signin"></Redirect> : <div></div>}
        {this.state.redirectToForum ? <Redirect to="/threads"></Redirect> : <div></div>}
      </div>
    );
  }
}

export default CreateThread;