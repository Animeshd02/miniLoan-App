// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD5kD4-qxySJT7XOB3D-TTvR_grCsB0iRo",
  authDomain: "mini-loan-app-afba8.firebaseapp.com",
  projectId: "mini-loan-app-afba8",
  storageBucket: "mini-loan-app-afba8.appspot.com",
  messagingSenderId: "947708879351",
  appId: "1:947708879351:web:e5dfa4b959cad9074a4ef2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };





// // src/firebase.js
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';



// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const firestore = getFirestore(app);

