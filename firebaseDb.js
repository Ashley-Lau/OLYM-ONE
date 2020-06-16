import * as firebase from 'firebase';
import firestore from 'firebase/firestore';
import "@firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDl4ihavOp4FMJlxmsMtCKvSFkmN9Lx6kA",
    authDomain: "olymone-f5d56.firebaseapp.com",
    databaseURL: "https://olymone-f5d56.firebaseio.com",
    projectId: "olymone-f5d56",
    storageBucket: "olymone-f5d56.appspot.com",
    messagingSenderId: "867975676509",
    appId: "1:867975676509:web:ff76411a9197ec9d2983b4",
    measurementId: "G-4KL4BDH3SP"

}

firebase.initializeApp(firebaseConfig);
firebase.firestore();
export default firebase
