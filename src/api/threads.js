import * as firebase from 'firebase'
import { generateName } from './helpers/uniqueNamesGenerator';

export const getAllThreads = () => {
  return firebase.database()
    .ref('threads/')
    .once('value')
    .then((snapshot) => {
      return snapshot.val();
    })
}

export const getThreadsByCategory = (category) => {
  return firebase.database()
    .ref('threads/')
    .child('category')
    .isEqual(category)
    .then((snapshot) => {
      return snapshot.val();
    })
}

export const getThreadById = (id) => {
  return firebase.database()
    .ref('threads/')
    .child(id)
    .once('value')
    .then((snapshot) => {
      return snapshot.val();
    })
}

export const createThread = (title, description, category, uid) => {
  let tid = generateName();
  let creationDate = getCurrentDateAndTime();

  let props = { tid, creationDate }

  return firebase.database()
    .ref(`threads/${tid}`)
    .set({
      title,
      description,
      category,
      uid,
      tid,
      creationDate
    }).then(() => props)
}

export const updateThread = (tid, title, description, category) => {
  return firebase.database()
    .ref(`threads/${tid}`)
    .update({
      title,
      description,
      category
    })
}

export const saveThreadInUser = (tid, uid, creationDate) => {
  return firebase.database()
    .ref(`users/${uid}/threads`)
    .child(tid)
    .set({
      tid
    })
}

export const deleteThread = (tid) => {
  return firebase.database()
    .ref(`threads`)
    .child(tid)
    .remove()
}

export const deleteThreadInUser = (tid, uid) => {
  return firebase.database()
    .ref(`users/${uid}/threads/${tid}`)
    .remove()
}

export const getPostsByThreadId = (tid) => {
  return firebase.database()
    .ref(`threads/${tid}`)
    .child('posts')
    .once('value')
    .then((snapshot) => snapshot.val())
}

export const getPostsByThreadIdAndPostId = (tid, pid) => {
  return firebase.database()
    .ref(`threads/${tid}/posts/${pid}`)
    .once('value')
    .then((snapshot) => snapshot.val())
}


export const addPost = (tid, uid, description) => {
  let postId = generateName(tid);
  let date = getCurrentDateAndTime();

  return firebase.database()
    .ref(`threads/${tid}/posts/${postId}`)
    .set({
      pid: postId,
      tid,
      uid,
      description,
      creationDate: date
    })
    .then(() => {
      return {
        pid: postId,
        tid,
        uid,
        description,
        creationDate: date
      }
    })
}

export const editPost = (postId, tid, uid, description) => {
  return firebase.database()
    .ref(`threads/${tid}/posts/${postId}`)
    .update({
      description
    })
}

export const deletePost = (postId, tid, uid) => {
  console.log(`threads/${tid}/posts/${postId}`)
  return firebase.database()
    .ref(`threads/${tid}/posts/${postId}`)
    .remove()
}

const getCurrentDateAndTime = () => {
  let date = new Date();
  return `${date.toDateString()} ${date.toLocaleTimeString()}`;
}

