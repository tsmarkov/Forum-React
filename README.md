
# Forum-React
"ReactJs Fundamentals - July 2018" Project Defense

*github: https://github.com/tsmarkov/Forum-React*

## Project Specification

**“Forum React”** is a web application for blog posts, sharing and discover answers to your question.
The client side of the app is built with **React.js 16.4.2**.
For backend are used **Firebase Realtime Database**. 

## Functionality

#### • User authentication
    ◦ Sign in existing user with email and password
    ◦ Sign up new user with email, full name and password
    ◦ Sign out from the application
    
#### • User profile
    ◦ Add or edit optional properties
    ◦ Delete profile
    
#### • Threads
    ◦ Upload
    ◦ Edit
    ◦ Delete
    ◦ Comment
        - write
        - edit
        - delete
        
        
## Starting the project
##### • Download the project
```
◦ git clone "https://github.com/tsmarkov/Forum-React.git"
```

##### • Setting up dependencies
    ◦ Open "Forum-React" folder
    ◦ npm install -E
    
##### • Setting up Firebase
    ◦ Create file "constants.js" in "./src/config"
    ◦ Add new project in https://console.firebase.google.com/
    
#### • Copy your automaticly generated "Web Setup" configs and place it in "constants.js" coresponding properties
    ◦ export const firebaseConfig = {
          apiKey: "put-your-apiKey-here",
          authDomain: "your-authDomain-here",
          databaseURL: "put-your-databaseURL-here",
          projectId: "put-your-projectId-here",
          storageBucket: "put-your-storageBucket-here",
          messagingSenderId: "put-your-messagingSenderId-here"
      }
    
##### • Run it
    ◦ npm start
    ◦ Starts on localhost:3000
