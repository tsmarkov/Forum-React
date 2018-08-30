import * as firebase from 'firebase'
import { config } from './../config/constants';
import { generateName } from './helpers/uniqueNamesGenerator';

firebase.initializeApp(config)

export const register = (email, password, displayName, photoURL) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((data) => saveUser(data, displayName, photoURL))
}

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((data) => {
        getUserById(data.user.uid)
          .then((user) => {
            saveToStorage(user.email, user.uid, user.displayName, user.photoURL, user.admin);
            resolve(user);
          })
      })
      .catch(reject)
  })
}

export const logout = () => {
  return firebase.auth().signOut()
    .then(() => clearStorage())
}

export const updateUser = (displayName, photoURL) => {
  return firebase.auth().currentUser.updateProfile({ displayName, photoURL })
    .then()
}

export const updateUserInDB = (userId, displayName, photoURL, location) => {
  return firebase.database()
    .ref(`users/${userId}`)
    .update({
      displayName,
      photoURL,
      location
    })
}

export const resetPassword = (email) => {
  return firebase.auth().sendPasswordResetEmail(email)
}

export const saveUser = (data, displayName, photoURL) => {
  let email = data.user.email;
  let uid = data.user.uid;

  return firebase.database().ref(`users/${data.user.uid}`)
    .set({
      email,
      uid,
      displayName,
      photoURL,
      admin: false
    })
}

export const deleteUser = (userId) => {
  return firebase.database()
    .ref(`users/${userId}`)
    .remove();
}

export const isAuthenticated = () => {
  return sessionStorage.getItem('uid') != null;
}

export const getCurrentUserId = () => {
  return sessionStorage.getItem('uid')
  // let uid = firebase.auth().currentUser.uid;
}

export const getCurrentUserEmail = () => {
  return sessionStorage.getItem('email')
  // return firebase.auth().currentUser.email;
}

export const getCurrentUserDisplayName = () => {
  return sessionStorage.getItem('displayName')
}

export const getCurrentUserPhotoURL = () => {
  return sessionStorage.getItem('photoURL')
}

export const getUserById = (userId) => {
  return firebase.database()
    .ref(`users/${userId}`)
    .once('value')
    .then((snapshot) => {
      return snapshot.val();
    })
}

export const getUsernameById = (userId) => {
  return firebase.database()
    .ref(`users/${userId}`)
    .child('displayName')
    .once('value')
    .then((snapshot) => {
      return snapshot.val();
    })
}

export const uploadProfilePicture = (uploadPhoto) => {
  return new Promise((resolve, reject) => {
    let storageRef = firebase.storage().ref();
    let photoNewName = generateName(uploadPhoto.file.name);

    this.uploadTask = storageRef.child(`profiles/${photoNewName}`)
      .put(uploadPhoto.file);

    this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        uploadPhoto.progress =
          this.uploadTask.snapshot.bytesTransferred / this.uploadTask.snapshot.totalBytes;
      },
      (err) => {
        reject(err.message);
      },
      () => {
        // Get image's download URL
        this.uploadTask.snapshot.ref
          .getDownloadURL()
          .then(downloadURL => {
            resolve(downloadURL);
          });
      })
  });
}

export const isAdmin = () => {
  return sessionStorage.getItem('admin') === true;
}


const saveToStorage = (email, uid, displayName, photoURL, admin) => {
  sessionStorage.setItem('uid', uid);
  sessionStorage.setItem('email', email);
  sessionStorage.setItem('displayName', displayName);
  sessionStorage.setItem('photoURL', photoURL);
  sessionStorage.setItem('admin', admin);
}

const clearStorage = () => {
  sessionStorage.clear();
}