import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js"; 
import { auth } from "./firebase.js";

const d = document;
const singup = d.getElementById("singup-form");
const singin = d.getElementById("login-form");
const logout = d.getElementById("logout");
const singupModal = new bootstrap.Modal(d.getElementById("singupModal"));
const singinModal = new bootstrap.Modal(d.getElementById("singinModal"));

//REGISTRARSE
singup.addEventListener("submit", (e) =>{
  e.preventDefault();
  
  const email = d.getElementById("singup-email").value;
  const password = d.getElementById("singup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      singup.reset();
      singupModal.hide(); 
      d.querySelector(".modal-backdrop").classList.remove("modal-backdrop");
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
      singin.reset();
      singinModal.hide(); 
      d.querySelector(".modal-backdrop").classList.remove("modal-backdrop");
      alert("inicio de seción correcto!");
    })
  
})

logout.addEventListener("click", e => {
  e.preventDefault();
  auth.signOut().then(() => {
    alert("seción cerrada")
  })
})
