import React, { Component } from 'react';
import { isAuthenticated, getUsernameById } from '../../api/auth';
import { Redirect, Link } from 'react-router-dom';
import { getAllThreads } from './../../api/threads';

class Forum extends Component {
  constructor(props) {
    super(props)

    this.state = {
      threads: null
    }
  }

  componentDidMount = () => {
    getAllThreads()
      .then((threads) => {
        threads = threads ?
          Object.values(threads).reverse() : [];

        // Get all threads owners usernames
        let promises = threads.map((thread, index) => {
          let uid = thread.uid;
          return getUsernameById(uid)
            .then((username) => {
              thread.displayName = username;
              return thread;
            })
        });

        Promise.all(promises).then((res) => {
          console.log(res);
          this.setState({
            threads
          })
        })
      })
      .catch(console.error)
  }

  render = () => {
    let rows = [];

    if (this.state.threads) {
      let threadsCopy = this.state.threads.slice(0);

      if (threadsCopy.length > 0) {
        let index = 0;
        for (const thread of threadsCopy) {
          rows.push(
            <tr key={index}>
              <td>
                <Link to={`/thread/${thread.tid}`}>
                  <h4>{thread.title}</h4>
                </Link>
                <br />
                Category: {thread.category}
                <br />
                by {thread.displayName}
              </td>
              <td>
                Created on: {thread.creationDate}
              </td>
            </tr>
          )
          index++;
        }
      } else {
        rows.push(<div><h3>No threads yet...</h3></div>)
      }

    }

    return (
      <div className="container" >
        <br />
        <br />
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <Link to="/thread/create"
              className="btn btn-lg btn-secondary">
              + Create new thread
            </Link>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Latest threads</th>
                  <th>Creation date</th>
                </tr>
              </thead>
              <tbody>
                {rows.length > 0 ?
                  rows :
                  <div><h3>Loading...</h3></div>
                }
              </tbody>
            </table>
          </div>
        </div>
        {
          this.state.redirect ?
            <Redirect to="/signin" /> : <div></div>
        }
      </div >
    )
  }
}

export default Forum;