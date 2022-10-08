import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
  apiKey: "AIzaSyCIDM9XaZd7JWZ7pcDFma_E61Kq9TZ2deY",
  authDomain: "sistemadechamados-f243c.firebaseapp.com",
  projectId: "sistemadechamados-f243c",
  storageBucket: "sistemadechamados-f243c.appspot.com",
  messagingSenderId: "334589927227",
  appId: "1:334589927227:web:5522a4d5f12a642049211e",
  measurementId: "G-M9VRDY5BSQ"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;