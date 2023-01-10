import firebase from "firebase/app";
import "firebase/auth";

export const auth = firebase.initializeApp( {
    apiKey: "AIzaSyBamHlvOpGwJXWNg6NbWKxG0CGG7fvUaFE",
    authDomain: "cling-2a1a8.firebaseapp.com",
    projectId: "cling-2a1a8",
    storageBucket: "cling-2a1a8.appspot.com",
    messagingSenderId: "685841603769",
    appId: "1:685841603769:web:048e7671299053c3edcf68"
  }).auth();