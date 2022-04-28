import {  onAuthStateChanged, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js"; 
import { collection, where, query, doc, getDocs, addDoc, Timestamp, updateDoc, deleteField, arrayUnion, arrayRemove} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import { db, auth, provider } from "./firebase.js";

const d = document;
const googleSingup= d.getElementById("googleSingup");
const logout = d.getElementById("logout");
const addProyect = d.getElementById("newProyect");
const addProyectForm = d.getElementById("new-proyect")
const addProyectModal = new bootstrap.Modal(d.getElementById("addProyect"));
const addColabForm = d.getElementById("new-colab")
const addColabModal = new bootstrap.Modal(d.getElementById("addColab"));

const infoSec = d.querySelector(".info-section");
const proyectsList = d.querySelector(".proyects");

let currentUser = null;
let currentProyect = null;

//REGISTRARSE CON GOOGLE
googleSingup.addEventListener("click",() => {
  signInWithPopup(auth, provider)
    .then()
    .catch(() => {
      alert("La autentificación fallo");
    })
})

//CERRAR SECIÓN
logout.addEventListener("click", e => {
  e.preventDefault();
  auth.signOut().then(() => {
    infoSec.classList.remove("hide");
    d.getElementById("user-info").classList.add("hide");
  })
})

//MOSTRAR PROYECTOS DE USUARIO
const showProyects = list => {
  if(list.docs.length){
    let html = '';
    list.forEach( doc => {
      const proyect = doc.data();
      const li = `
        <div >
          <li class="list-group-item list-group-item-action" style="cursor:pointer" >
            <h2 id="${doc.id}" class="text-center deployProyect">${proyect.title}</h2>
          </li>
        </div>
      `;
      html += li;
    });
    proyectsList.innerHTML = html;
  }
  else
    proyectsList.innerHTML = '<h3 class="text-center">Aún no tienes proyectos</h3>';
}

//CREAR NUEVO PROYECTO
addProyect.addEventListener("click", async (e) =>{
  e.preventDefault();
  
  const titleProyect = d.getElementById("add-proyect").value;

  const docRef = await addDoc(collection(db,"Proyects"),{
    author:currentUser.uid, 
    title: titleProyect,
    initDate: Timestamp.fromDate(new Date()),
    collabs: [null],
    crc_card: [

    ],
    user_storys: [

    ]
  })

    addProyectForm.reset();
    addProyectModal.hide(); 
    d.querySelector(".modal-backdrop").classList.remove("modal-backdrop");
    getProyects(currentUser);
})

//DESPLEGAR UN PROYECTO
d.addEventListener("click", e => {
  
  //Obtener historias de usuario o tarjetas crc
  if(e.target.matches(".deployProyect")){
    const ProyectName = e.target.textContent;
    const currentDiv = e.target.parentElement.parentElement.querySelector("#carouselExampleControlsNoTouching");
    const pather = e.target.parentElement.parentElement;
    //se crea el templete
    if(!currentDiv){
      const template1 = d.querySelector(".stories");
      const template2 = d.querySelector(".crc");
      let sliderUserStory = template1.cloneNode(true);
      let sliderCrcCards = template2.cloneNode(true);
      pather.appendChild(sliderUserStory);
      pather.appendChild(sliderCrcCards);
    }
    const slider1 = pather.querySelector(".stories");
    const slider2 = pather.querySelector(".crc");
    slider1.classList.toggle("hide");
    slider2.classList.toggle("hide");

    getProyect(slider1,slider2,ProyectName);
  }

  //Agregar nueva historia de usuario o tarjeta crc
  if(e.target.matches(".addNewText")){

    let temp;
    const type = e.target.parentElement.parentElement.parentElement.parentElement;

    if(type.parentElement.classList.contains("stories"))
      temp = d.querySelector(".user_story");
    else
      temp = d.querySelector(".crc_card");

    let newComp = temp.cloneNode(true);
    newComp.classList.remove("hide");
    newComp.classList.add("active");
    e.target.parentElement.parentElement.parentElement.classList.remove("active");
    type.insertBefore(newComp,type.querySelector(".addNew"));

  }
  
  //recorrer el carrusel
  if(e.target.matches(".next") || e.target.matches(".fa-arrow-right")){
    let nowNode = e.target.matches(".next")
      ? e.target.parentElement.parentElement.querySelector(".active")
      : e.target.parentElement.parentElement.parentElement.querySelector(".active");

    if(nowNode.nextElementSibling != null){
      nowNode.classList.remove("active");
      nowNode.nextElementSibling.classList.add("active");
    }
  }

  if(e.target.matches(".prev") || e.target.matches(".fa-arrow-left")){
    let nowNode = e.target.matches(".prev")
      ? e.target.parentElement.parentElement.querySelector(".active")
      : e.target.parentElement.parentElement.parentElement.querySelector(".active");
    
    if(nowNode.previousElementSibling != null){
      nowNode.classList.remove("active");
      nowNode.previousElementSibling.classList.add("active");
    }
  }

  //Guardar los datos
  if(e.target.matches(".saveDB")){
    
    let array = null; 
    const sliderMain = e.target.parentElement.parentElement;
    const idProy =  e.target.parentElement.parentElement.parentElement.querySelector(".deployProyect").id; 

    if(sliderMain.classList.contains("stories")){
      array = sliderMain.querySelectorAll(".user_story");
      delateNode(idProy,1);

      array.forEach(el => {
        addNode(el,idProy,1);
      })
    }
    if(sliderMain.classList.contains("crc")){
      array = sliderMain.querySelectorAll(".crc_card");
      delateNode(idProy,2);

      array.forEach(el => {
        addNode(el,idProy,2);
      })
    }
  }

  //Borrar un nodo
  if(e.target.matches(".delateNode")){
    const sliderMain = e.target.parentElement.parentElement.querySelector(".carousel-inner");
    const node = sliderMain.querySelector(".active");
    node.classList.remove("active");
    node.nextElementSibling.classList.add("active");
    sliderMain.removeChild(node);
  }

  //Agregar un colaborador
  if(e.target.matches("#newColab")){
    addColabForm.reset();
    addColabModal.hide(); 
    d.querySelector(".modal-backdrop").classList.remove("modal-backdrop");
  }


})

const delateNode = async ( id,op ) => {
  const proyRef = doc(db,'Proyects',id);

  if(op == 1){
    await updateDoc(proyRef, {
      user_storys : deleteField()
    });
  }

  if(op == 2){
    await updateDoc(proyRef, {
      crc_card : deleteField()
    });
  }
}

const addNode = async ( el,id,op ) => {
  const proyRef = doc(db,'Proyects',id);

  if(op == 1){
    await updateDoc(proyRef, {
      user_storys : arrayUnion({
        story: el.querySelector("#story").value,
        num : el.querySelector("#num").value,
        value : el.querySelector("#value").value,
        date : el.querySelector("#date").value,
        time : el.querySelector("#time").value,
        description : el.querySelector("#description").value,
        obs : el.querySelector("#obs").value
      })
    });
  }

  if(op == 2){
    await updateDoc(proyRef, {
      crc_card : arrayUnion({
        class: el.querySelector("#class").value,
        superClass : el.querySelector("#superClass").value,
        subClass : el.querySelector("#subClass").value,
        respond :  el.querySelector("#respond").value,
        respond1 :  el.querySelector("#respond1").value,
        respond2 :  el.querySelector("#respond2").value,
        colab : el.querySelector("#colab").value,
        colab1 : el.querySelector("#colab1").value,
        colab2 : el.querySelector("#colab2").value,
      })
    });
  }
}


const getProyect = async (slider1,slider2, proy) => {
  const proyect = query(collection(db,"Proyects"), where("author","==",currentUser.uid), where("title","==",proy));
  const querySnapshot = await getDocs(proyect);
  showProyect(slider1,slider2,querySnapshot);
}

const showProyect = (slider1,slider2,list) => {
    list.forEach( doc => {
      const proyect = doc.data();
      const workspace1 = slider1.querySelector(".carousel-inner");
      const workspace2 = slider2.querySelector(".carousel-inner");
      const template1 = d.querySelector(".user_story");
      const template2 = d.querySelector(".crc_card");

      proyect.user_storys.forEach( el => {
        let newUserStory = template1.cloneNode(true);
        workspace1.insertBefore(newUserStory, slider1.querySelector(".carousel-item"));
        
        const userStory = slider1.querySelector(".carousel-item");
        userStory.querySelector("#story").value = el.story;
        userStory.querySelector("#num").value = el.num;
        userStory.querySelector("#value").value = el.value;
        userStory.querySelector("#date").value = el.date;
        userStory.querySelector("#time").value = el.time;
        userStory.querySelector("#description").value = el.description;
        userStory.querySelector("#obs").value = el.obs;

      });

      if(slider1.querySelector(".active") == null)
        slider1.querySelector(".carousel-item").classList.add("active");

      proyect.crc_card.forEach( el => {
        let newCrcCard = template2.cloneNode(true);
        workspace2.insertBefore(newCrcCard, slider2.querySelector(".carousel-item"));
        
        const crcCard = slider2.querySelector(".carousel-item");
        crcCard.querySelector("#class").value = el.class;
        crcCard.querySelector("#superClass").value = el.superClass;
        crcCard.querySelector("#subClass").value = el.subClass;
        crcCard.querySelector("#respond").value = el.respond;
        crcCard.querySelector("#respond1").value = el.respond1;
        crcCard.querySelector("#respond2").value = el.respond2;
        crcCard.querySelector("#colab").value = el.colab;
        crcCard.querySelector("#colab1").value = el.colab1;
        crcCard.querySelector("#colab2").value = el.colab2;

      });

      if(slider2.querySelector(".active") == null)
        slider2.querySelector(".carousel-item").classList.add("active");
      
    });
}

//EVENTOS
const loginCheck = user => {
  if(user){
    const backdrop = d.querySelector(".modal-backdrop");

    d.querySelectorAll(".logged-in").forEach(link => link.classList.add("hide"))
    d.querySelectorAll(".logged-out").forEach(link => link.classList.remove("hide"))

    infoSec.classList.add("hide");
    if(backdrop)
      backdrop.classList.remove("modal-backdrop");

    d.querySelector(".page1User").classList.remove("hide");
  }
  else{
    d.querySelectorAll(".logged-in").forEach(link => link.classList.remove("hide"))
    d.querySelectorAll(".logged-out").forEach(link => link.classList.add("hide"))

    d.querySelector(".page1User").classList.add("hide");
  }
}

//comprobar usuario autentificado
auth.onAuthStateChanged(user => {
  loginCheck(user);
  if(user){
    currentUser = user;
    showUserData(user);
    getProyects(currentUser);
  }
})

//OBTENER PROYECTOS DEL USUARIO
const getProyects = async user => {
  const proyects = query(collection(db,"Proyects"), where("author","==",user.uid));
  const querySnapshot = await getDocs(proyects);
  showProyects(querySnapshot);
}

//MOSTRAR DATOS DEL USUARIO
const showUserData = user => {
  d.getElementById("user-info").innerHTML = `
    <img src="${user.photoURL}" width="100" class="d-block mx-auto rounded-circle">
    <span><h3 class="text-center text-dark">${user.displayName}</h3></span>
  `;
}


