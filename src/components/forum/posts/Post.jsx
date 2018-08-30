import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import observer from '../../../infrastructure/observer';
import { isAuthenticated, getCurrentUserId, isAdmin } from './../../../api/auth';
import { deletePost, editPost, getPostsByThreadIdAndPostId } from './../../../api/threads';

class Post extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isAuth: false,
      uid: null,
      edit: false,
      editPost: null
    }

    observer.subscribe(observer.events.loginUser, this.onLoginUser)
    observer.subscribe(observer.events.logoutUser, this.onLogoutUser)
  }

  componentDidMount = () => {
    this.setState({
      isAuth: isAuthenticated()
    })

    if (isAuthenticated()) {
      let uid = getCurrentUserId();

      this.setState({
        uid: uid
      })
    }
  }

  componentWillUnmount = () => {
    observer.unsubscribe(observer.events.loginUser, this.onLoginUser);
    observer.unsubscribe(observer.events.logoutUser, this.onLogoutUser);
  }

  onLoginUser = (data) => {
    this.setState({
      isAuth: false,
      uid: getCurrentUserId()
    })
  }

  onLogoutUser = () => {
    this.setState({
      isAuth: false,
      uid: null
    })
  }

  deletePost = (pid, tid) => {
    let postId = pid;
    let threadId = tid;
    let userId = this.state.uid;

    deletePost(postId, threadId, userId)
      .then(() => {
        this.props.refresh();
        console.log('Post deleted');
      })
  }

  handleChange = (event) => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;

    this.setState({
      [fieldName]: fieldValue
    })
  }


  openEdit(pid, tid) {
    getPostsByThreadIdAndPostId(tid, pid)
      .then((post) => {
        this.setState({
          edit: true,
          editPost: post,
          description: post.description
        })
      })
  }

  editPost = (event) => {
    event.preventDefault();

    let description = this.state.description
    let pid = this.state.editPost.pid;
    let tid = this.state.editPost.tid;
    let uid = this.state.editPost.uid;


    editPost(pid, tid, uid, description)
      .then((res) => {
        console.log(res);
        this.setState({
          edit: false
        })
        this.props.refresh()
      })
      .catch(console.error)
  }

  render = () => {
    return (
      <div className="row bg-white p-2 rounded">
        <div className="col-md-2">
          <img src={this.props.thread.user.photoURL}
            alt={this.props.thread.user.displayName}
            className="img-fluid img-thumbnail" />
        </div>
        <div className="col-md-10 bg-transparent">
          <div className="row pt-3">
            <div className="col-md-12">
              {this.state.edit ?
                <form action="post" onSubmit={this.editPost}>
                  <textarea name="description"
                    id="description"
                    cols="30"
                    rows="10"
                    value={this.state.description}
                    onChange={this.handleChange}
                    className="form-control">
                  </textarea>
                  <br />
                  <button type="submit" className="btn btn-success">Submit</button>
                </form>
                : <p><b>{this.props.thread.description}</b></p>
              }
            </div>
          </div>
          <hr />
          <div className="row">
            {(this.props.thread.uid === this.state.uid) || sessionStorage.getItem('admin') ?
              <div className="col-md-6">
                {this.props.thread.pid ?
                  <div>
                    <button className="btn btn-outline-secondary"
                      onClick={() => this.openEdit(this.props.thread.pid, this.props.thread.tid)}>
                      Edit
                    </button>
                    <i>   </i>
                    <button className="btn btn-outline-danger"
                      onClick={() => this.deletePost(this.props.thread.pid, this.props.thread.tid)}>
                      Delete
                  </button>
                  </div> :
                  <Link to={`/thread/edit/${this.props.thread.tid}`}
                    className="btn btn-outline-secondary">
                    Edit
                  </Link>
                }
              </div>
              :
              <div className="col-md-6">
                <Link to={`/user/${this.props.thread.user.uid}`}>
                  {this.props.thread.user.displayName}
                </Link>
              </div>
            }
            <div className="col-md-6">
              <p>{this.props.thread.creationDate}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Post;