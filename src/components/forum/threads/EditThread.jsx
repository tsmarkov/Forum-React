import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'

import observer from '../../../infrastructure/observer';

import { updateThread, getThreadById } from './../../../api/threads';
import {
  getCurrentUserId,
  isAuthenticated
} from '../../../api/auth'

class EditThread extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isAuth: false,
      redirectToLogin: false,
      redirectToForum: false,
      currentUserId: null,
      uid: null,
      tid: null,
      title: '',
      category: '',
      description: ''
    }

    observer.subscribe(observer.events.logoutUser, this.onLogoutUser)
  }

  componentDidMount = () => {
    this.setState({
      isAuth: isAuthenticated(),
      currentUserId: getCurrentUserId()
    })

    let threadId = this.props.match.params.id;
    getThreadById(threadId)
      .then((thread) => {
        let uid = thread.uid;
        let tid = thread.tid;
        let title = thread.title;
        let description = thread.description;
        let category = thread.category;

        this.setState({
          uid,
          tid,
          title,
          description,
          category
        })
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
      currentUserId: null,
      redirectToLogin: true
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
    let tid = this.state.tid;
    let uid = this.state.uid;

    updateThread(tid, title, description, category)
      .then((res) => {
        console.log('Thread edited');
        this.setState({
          redirectToForum: true
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
            <h1 >Thread edit page</h1>
            <hr />
            {this.state.title ?
              <form onSubmit={this.handleSubmit}>
                <fieldset>
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input className="form-control"
                      placeholder="Title"
                      name="title"
                      type="text"
                      value={this.state.title}
                      onChange={this.handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input className="form-control"
                      placeholder="Category"
                      name="category"
                      type="text"
                      value={this.state.category}
                      onChange={this.handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea className="form-control"
                      placeholder="Description"
                      name="description"
                      value={this.state.description}
                      onChange={this.handleChange} />
                  </div>
                  <button type="submit" className="btn btn-md btn-primary">Edit</button>
                </fieldset>
              </form> :
              <div>
                <p>Loading...</p>
              </div>
            }
          </div>
        </div>
        {this.state.redirectToLogin ? <Redirect to="/signin"></Redirect> : <div></div>}
        {this.state.redirectToForum ? <Redirect to="/threads"></Redirect> : <div></div>}
      </div>
    );
  }
}

export default EditThread;