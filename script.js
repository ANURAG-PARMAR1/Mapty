'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const btnClear = document.querySelector('.remove');

// Start 

// Geolocation API and map
let coords = [];
let userData = {};
let workoutType;
let workoutDis;
let clkCoord;
let workouts = [];
let map;
const zoom = 17;
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const date = new Date();



// Local storage

const setLocalStorage = function() {
  //localStorage.setItem('data',JSON.stringify(workouts));
  localStorage.setItem('data',JSON.stringify(workouts));
};

const getLocalStorage = function() {
  const data = localStorage.getItem("data");
  
  if(!data) return;

  const prevWorkouts = JSON.parse(data);
  workouts=prevWorkouts;

};

getLocalStorage();

// Display Workouts
const displayWork = function (userData) {
  let html;
  workoutType = userData.type;
  userData.type = userData.type[0].toUpperCase() +  inputType.value.slice(1);
  workoutDis = `${userData.type} on ${ month[date.getMonth()]} ${date.getDate()}`;
  if(userData.type == "Running") {
      html = `<li class="workout workout--running" data-id=${userData.id}>
      <h2 class="workout__title">${userData.type} on ${ month[date.getMonth()]} ${date.getDate()}</h2>
      <div class="workout__details">
        <span class="workout__icon">🏃‍♂️</span>
        <span class="workout__value">${userData.dist}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${userData.time}</span>
        <span class="workout__unit">min</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${Math.trunc(userData.time/userData.dist)}</span>
        <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${userData.cade}</span>
        <span class="workout__unit">spm</span>
      </div>
    </li>`;
  }
  else {
      html =`<li class="workout workout--cycling" data-id=${userData.id}>
      <h2 class="workout__title">${userData.type} on ${ month[date.getMonth()]} ${date.getDate()}</h2>
      <div class="workout__details">
        <span class="workout__icon">🚴‍♀️</span>
        <span class="workout__value">${userData.dist}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${userData.time}</span>
        <span class="workout__unit">min</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${Math.trunc(userData.dist/userData.time)}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${userData.elev}</span>
        <span class="workout__unit">m</span>
      </div>
    </li>
  </ul>` ;
  }

  form.insertAdjacentHTML('afterend',html);
}


const fn1 = function (pos) {
    const {latitude,longitude} = pos.coords;
    coords = [latitude,longitude];
    

    // Map Loading
     map = L.map('map').setView(coords, zoom);

    L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

// Marker 
const mark = function(a) {
  L.marker(a)
      .addTo(map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workoutType}-popup`,
        })
      )
      .setPopupContent(
        `${workoutType === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workoutDis}`
      )
      .openPopup();
};

// Displaying Workouts
workouts.forEach(elm => {
  displayWork(elm);
  mark(elm.coordinates);
});

// Form Submission

form.addEventListener('submit',function(l) {
  l.preventDefault();
  userData = {
   type : inputType.value,
   dist :Number (inputDistance.value),
   time : Number(inputDuration.value),
   cade : Number(inputCadence.value),
   elev : Number(inputElevation.value),
   id: (Date.now() + '').slice(-10),
   coordinates: clkCoord,
  
  };

  // Constrains on Inputs
  if(userData.dist < 0 || userData.time< 0 ) {
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value ="";
    return alert("Plz input a +ve Number");
  }
  if(!Number.isFinite(userData.dist) || !Number.isFinite(userData.time) || !Number.isFinite(userData.cade) || !Number.isFinite(userData.elev) ) {
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value ="";
    return alert("Plz input a valid Number");
  }
  if(!userData.dist || !userData.time) return alert("Plz fill all blocks");

  if(userData.type === "running") {
    if(userData.cade <0) return alert("Plz input a +ve Number");
    if (!userData.cade) return alert("Plz fill all blocks");
  }
  if(userData.type === "cycling") {
    if (!userData.elev) return alert("Plz fill all blocks");
  }

  workouts.push(userData);
  setLocalStorage();
  form.classList.add("hidden");
  let html;
  workoutType = userData.type;
  userData.type = userData.type[0].toUpperCase() +  inputType.value.slice(1);
  workoutDis = `${userData.type} on ${ month[date.getMonth()]} ${date.getDate()}`;
  if(userData.type == "Running") {
      html = `<li class="workout workout--running" data-id=${userData.id}>
      <h2 class="workout__title">${userData.type} on ${ month[date.getMonth()]} ${date.getDate()}</h2>
      <div class="workout__details">
        <span class="workout__icon">🏃‍♂️</span>
        <span class="workout__value">${userData.dist}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${userData.time}</span>
        <span class="workout__unit">min</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${Math.trunc(userData.time/userData.dist)}</span>
        <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${userData.cade}</span>
        <span class="workout__unit">spm</span>
      </div>
    </li>`;
  }
  else {
      html =`<li class="workout workout--cycling" data-id=${userData.id}>
      <h2 class="workout__title">${userData.type} on ${ month[date.getMonth()]} ${date.getDate()}</h2>
      <div class="workout__details">
        <span class="workout__icon">🚴‍♀️</span>
        <span class="workout__value">${userData.dist}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${userData.time}</span>
        <span class="workout__unit">min</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${Math.trunc(userData.dist/userData.time)}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${userData.elev}</span>
        <span class="workout__unit">m</span>
      </div>
    </li>
  </ul>` ;
  }

  form.insertAdjacentHTML('afterend',html);

  
  inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value ="";

  mark(clkCoord); 
 
});


map.on('click',function(e) {

     const markCoord = [e.latlng.lat,e.latlng.lng];
     clkCoord = markCoord;
  
    form.classList.remove("hidden");

   
});


};

const fn2 = function() {
    alert ("plz allow access to your location");
};

navigator.geolocation.getCurrentPosition(fn1,fn2);



inputType.addEventListener('change', function(e) {;
  e.preventDefault();

  const toRem = inputCadence.closest(".form__row");
  const toAdd = inputElevation.closest(".form__row");


  toRem.classList.toggle("form__row--hidden");
  toAdd.classList.toggle("form__row--hidden");
});

// Moving popup
const movePopup = function(e){
 
  if (!map) return;

  const workOutElm = e.target.closest('.workout');
 
  if (!workOutElm) return;

  const workOut = workouts.find(work => work.id === workOutElm.dataset.id);
  if(!workOut) return;
  map.setView(workOut.coordinates,zoom,{  
    animate: true,
    pan: {
      duration: 1,
    },
  });
};

const deleteLocalStorage = function() {
  localStorage.clear();
  location.reload();
}

containerWorkouts.addEventListener('click',movePopup);
btnClear.addEventListener('click',deleteLocalStorage);













