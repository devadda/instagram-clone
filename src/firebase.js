import firebase from 'firebase'
const firebaseConfig = {
    apiKey: "AIzaSyAZSOlKWUyH8h1Xpt_6mFWjs6huuat8iDk",
    authDomain: "instagram-devadda.firebaseapp.com",
    databaseURL: "https://instagram-devadda.firebaseio.com",
    projectId: "instagram-devadda",
    storageBucket: "instagram-devadda.appspot.com",
    messagingSenderId: "763600546356",
    appId: "1:763600546356:web:a0cc49200eeb6b5a1e3861",
    measurementId: "G-57JRECJHKZ"
};

const firebaseApp= firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};
