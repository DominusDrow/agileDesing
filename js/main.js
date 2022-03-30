import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js"; 
import { collection } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import { db, auth, provider } from "./firebase.js";

const d = document;
const singup = d.getElementById("singup-form");
const googleLogin = d.getElementById("googleLogin");
const singin = d.getElementById("login-form");
const logout = d.getElementById("logout");
const singupModal = new bootstrap.Modal(d.getElementById("singupModal"));
const singinModal = new bootstrap.Modal(d.getElementById("singinModal"));

const infoSec = d.querySelector(".info-section");
const proyectsList = d.querySelector(".proyects");

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
      infoSec.classList.add("hide");
    })
})

//REGISTRARSE CON GOOGLE
googleLogin.addEventListener("click", e => {
  signInWithPopup(auth, provider)
    .then(result => {
      alert("si se pudo");
      singup.reset();
      singupModal.hide(); 
      d.querySelector(".modal-backdrop").classList.remove("modal-backdrop");
      infoSec.classList.add("hide");
    })
    .catch(err => {
      alert("no se pudo");
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
      infoSec.classList.add("hide");
    })
  
})

logout.addEventListener("click", e => {
  e.preventDefault();
  auth.signOut().then(() => {
    infoSec.classList.remove("hide");
  })
})

//MOSTRAR PROYECTOS DE USUARIO




//EVENTOS
const loginCheck = user => {
  if(user){
    d.querySelectorAll(".logged-in").forEach(link => link.classList.add("hide"))
    d.querySelectorAll(".logged-out").forEach(link => link.classList.remove("hide"))
  }
  else{
    d.querySelectorAll(".logged-in").forEach(link => link.classList.remove("hide"))
    d.querySelectorAll(".logged-out").forEach(link => link.classList.add("hide"))
  }
}

//comprobar usuario autentificado
auth.onAuthStateChanged(user => {
  if(user){
    loginCheck(user);
    alert("un usuario registrado");
  }
  else{
    loginCheck(user);
    alert("nadie registrado");
  }
})
