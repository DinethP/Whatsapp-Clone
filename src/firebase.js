import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAAN7tg90KjhZIR90kukZoHodD8kGcnugk",
  authDomain: "whatsapp-mern-e5f2a.firebaseapp.com",
  databaseURL: "https://whatsapp-mern-e5f2a.firebaseio.com",
  projectId: "whatsapp-mern-e5f2a",
  storageBucket: "whatsapp-mern-e5f2a.appspot.com",
  messagingSenderId: "227450814912",
  appId: "1:227450814912:web:bdcd071582981f3927c825",
  measurementId: "G-JYEN957F09",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
