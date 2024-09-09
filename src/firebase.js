import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';  // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyAzGdD3HFe-w7VB6kHqfnGn0a0pDsaeimk",
  authDomain: "all-in-one-messaging-app.firebaseapp.com",
  projectId: "all-in-one-messaging-app",
  storageBucket: "all-in-one-messaging-app.appspot.com",
  messagingSenderId: "847087789931",
  appId: "1:847087789931:web:9d61bd0eccfc7b6af58e2e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app); 

export { db, auth, provider, storage };
