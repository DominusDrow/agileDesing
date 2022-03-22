import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js"; 
import { auth } from "./firebase.js";

const d = document;
const singup = d.getElementById("singup-form");
const singin = d.getElementById("login-form");
const logout = d.getElementById("logout");
const singupModal = new bootstrap.Modal(document.getElementById('singupModal'), {keyboard: false})
const singinModal = new bootstrap.Modal(document.getElementById('singinModal'), {keyboard: false})

//REGISTRARSE
singup.addEventListener("submit", (e) =>{
  e.preventDefault();
  
  const email = d.getElementById("singup-email").value;
  const password = d.getElementById("singup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      //clear form
      singup.reset();
      //close form
      singupModal.hide(); 
      alert("registro correcto!");
    })
})

//INICIAR SECIÓN
singin.addEventListener("submit", (e) =>{
  e.preventDefault();
  
  const email = d.getElementById("login-email").value;
  const password = d.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      //clear form
      singin.reset();
      //close form
      singinModal.hide(); 
      alert("inicio de seción correcto!");
    })
  
})

logout.addEventListener("click", e => {
  e.preventDefault();
  auth.signOut().then(() => {
    alert("seción cerrada")
  })
})
