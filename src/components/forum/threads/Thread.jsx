import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Post from '../posts/Post';

import CreatePost from '../posts/CreatePost';
import observer from '../../../infrastructure/observer';
import {
  saveThreadInUser,
  createThread,
  getThreadById,
  deleteThread,
  deleteThreadInUser,
  getPostsByThreadId
} from './../../../api/threads';
import {
  getCurrentUserId,
  getCurrentUserDisplayName,
  isAuthenticated,
  getUserById,
  isAdmin
} from '../../../api/auth'


class Thread extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isAuth: false,
      redirect: false,
      redirectToForum: false,
      thread: null,
      posts: null
    }

    observer.subscribe(observer.events.logoutUser, this.onLogoutUser)
  }

  componentDidMount = () => {
    if (isAuthenticated() != true) {
      this.setState({
        redirect: true
      })
      return;
    }

    this.setState({
      isAuth: isAuthenticated(),
      uid: getCurrentUserId()
    })

    let id = this.props.match.params.id;

    getThreadById(id)
      .then((thread) => {
        let uid = thread.uid;

        getUserById(uid)
          .then((user) => {
            thread.user = user;

            getPostsByThreadId(id)
              .then((posts) => {
                posts = posts ? Object.values(posts).reverse() : [];

                // Get all threads owners usernames
                let promises = posts.map((post, index) => {
                  let uid = post.uid;
                  return getUserById(uid)
                    .then((user) => {
                      post.user = user;
                      return post;
                    })
                });

                Promise.all(promises).then((res) => {
                  this.setState({
                    thread,
                    posts
                  })
                })
              })
          })
      })
      .catch(console.error)
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

  deleteThread = () => {
    deleteThread(this.state.thread.tid)
      .then(() => {
        deleteThreadInUser(this.state.thread.tid, this.state.thread.uid)
          .then(() => {
            this.setState({
              redirectToForum: true
            })
            console.log(`Thread deleted`);
          })
      })
  }

  refresh = () => {
    this.componentDidMount();
  }

  render = () => {
    let posts = [];
    let index = 0;
    if (this.state.posts && this.state.posts.length > 0) {
      for (const post of this.state.posts) {
        posts.push(
          <div className="container bg-light p-5">
            <Post key={index}
              thread={post}
              refresh={this.refresh}
              refresh={this.refresh}></ Post>
          </div>
        );

        index++;
      }
    }

    return (
      <div className="container" >
        <br />
        <div className="row bg-light p-5">
          {this.state.thread ?
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-10">
                    <h1 className="text-center">{this.state.thread.title}</h1>
                    <hr />
                  </div>
                  <div className="col-md-2">
                    {this.state.thread.uid === getCurrentUserId() || sessionStorage.getItem('admin')  ?
                      <a className="btn btn-md btn-outline-danger"
                        href="javascript:void(0)"
                        onClick={this.deleteThread}>❌
                        Delete
                      </a> : <div></div>
                    }
                  </div>
                </div>
                <div>
                </div>
                <div className="container bg-seccondary rounded-top p-1">
                  <Post thread={this.state.thread}></Post>
                  <hr />
                </div>
                <div className="container bg-light rounded-bottom">
                  <CreatePost threadId={this.state.thread.tid} addPost={this.refresh}></CreatePost>
                </div>
                <div className="container bg-light rounded">
                  {posts}
                </div>
              </div>
            </div>
            : <div className="col-md-8 text-center">
              <h3>Loading...</h3>
            </div>
          }
        </div>
        {this.state.redirect ? <Redirect to="/signin" ></Redirect> : <div></div>}
        {this.state.redirectToForum ? <Redirect to="/threads"></Redirect> : <div></div>}
      </div >
    );
  }
}

export default Thread;