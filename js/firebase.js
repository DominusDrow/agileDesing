import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js"; 

const firebaseConfig = {
  apiKey: "AIzaSyC_p8of2iJyzdMlzL0ArLIpeuGGaIouEbo",
  authDomain: "agiledesing.firebaseapp.com",
  projectId: "agiledesing",
  storageBucket: "agiledesing.appspot.com",
  messagingSenderId: "549079134362",
  appId: "1:549079134362:web:b95f3d2f061913fdb06f23"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(app);

export {db, auth, provider};
