import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'

import observer from '../../../infrastructure/observer';

import { saveThreadInUser, createThread, addPost } from './../../../api/threads';
import {
  getCurrentUserId,
  getCurrentUserDisplayName,
  isAuthenticated
} from '../../../api/auth'
import { Form } from 'react-bootstrap'

class CreatePost extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isAuth: false,
      redirectToLogin: false,
      description: '',
      uid: null,
      tid: null,
      write: false
    }

    observer.subscribe(observer.events.logoutUser, this.onLogoutUser)
  }

  componentDidMount = () => {
    let tid = this.props.threadId;

    this.setState({
      isAuth: isAuthenticated(),
      uid: getCurrentUserId(),
      tid: tid
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

    let tid = this.state.tid;
    let uid = this.state.uid;
    let description = event.target.description.value;

    addPost(tid, uid, description)
      .then((res) => {
        this.props.addPost();
        document.getElementById("description").value = '';

        this.setState({
          write: false
        })
      })
      .catch(console.error)
  }

  write = () => {
    this.setState({
      write: true
    })
  }

  cancelWrite = () => {
    this.setState({
      write: false
    })
  }

  render = () => {
    return (
      <div className="container">
        {this.state.write ?
          <div className="row">
            <div className="col-md-12 text-center">
              <form action="post" className="form-group bg-light p-2 rounded" onSubmit={this.handleSubmit}>
                <textarea name="description"
                  id="description"
                  className="form-control"
                  rows="10"
                  cols="30"
                  onChange={this.handleChange}>
                </textarea>
                <br />
                <button type="submit" className="btn btn-success">Post</button>
                <i> </i>
                <button type="submit" className="btn btn-danger" onClick={this.cancelWrite}>Cancel</button>
              </form>
            </div>
          </div>
          :
          <div className="row">
            <div className="col-md-12 text-center">
              <button className="btn btn-secondary" onClick={this.write}>Write something...</button>
            </div>
          </div>
        }
        {this.state.redirectToLogin ? <Redirect to="/signin"></Redirect> : <div></div>}
        {this.state.redirectToForum ? <Redirect to="/threads"></Redirect> : <div></div>}
      </div>
    );
  }
}

export default CreatePost;