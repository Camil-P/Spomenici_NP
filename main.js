
class Sight {
  constructor(name, description, category, streetLocation, city, latitude, longitude, images) {
    this.name = name;
    this.description = description;
    this.category = category;
    this.streetLocation = streetLocation;
    this.city = city;
    this.latitude = latitude;
    this.longitude = longitude;
    this.images = images;
  }

  display(img){
    var txt = `<div class="gallery">`
    if(img){      
      txt += `<img alt="${this.name}" class="mainPhoto" src="${img}" alt="hahu">`;
    }
    else{      
      txt += `<img alt="${this.name}" class="mainPhoto" src="${this.images[0]}" alt="hahu">`;
    }
    txt += `<div class="photoContainer">`
    this.images.forEach(i => {
      txt +=`<img alt="${this.name}" onclick="loadMainPhoto(this)" class="mainPhoto" src="${i}" alt="hahu">`;
    })    
              
    txt +=  `</div>
          </div>

          <div class="description">
              <h1>${this.name}</h1>
              <h3>${this.category}</h3>
              <h4>${this.streetLocation}</h4>
              <h4>${this.city}</h4>
              <p>${this.description}</p>
          </div>
          <button id="modalClosing" onclick="closeModal()">X</button>`;
    return txt;
  }
}

var alreadyLoadedLists = [];

const MAP = L.map('map').setView([20.515304, 43.135457], 14.54);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={pk.eyJ1IjoiY2FtaWwtcCIsImEiOiJja2xsZDA1bjcyYXJoMnVwcmNoeDJvazVsIn0.ZudGmBS8VAQfuJa7t1KKBg}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY2FtaWwtcCIsImEiOiJja2xsZDA1bjcyYXJoMnVwcmNoeDJvazVsIn0.ZudGmBS8VAQfuJa7t1KKBg'
}).addTo(MAP);
const DATA_DISPLAY = document.getElementById('dataDisplay');

window.addEventListener('keyup', (event)=>{
  if(event.which === 27){
    closeModal();
  }
})

function displayModal(name){
  input = name ? name : document.getElementById('search').value;

  const searchSight = SIGHTS.find(s => s.name.toLowerCase().includes(input.toLowerCase()));
  if(searchSight){
    document.getElementById('modalContent').innerHTML = searchSight.display();
    document.getElementById('modal').style.display = 'flex';
  }
}

function loadMainPhoto(imgElement){
  displayedSight = SIGHTS.find(s => s.name === imgElement.alt);
  document.getElementById('modalContent').innerHTML = displayedSight.display(imgElement.src);
}

function categoryListLoading(filterName, listName) {
  var isAlreadyLoaded = alreadyLoadedLists.find(loadedList => loadedList === listName);

  const LIST = document.getElementById(listName);
  if (LIST.style['display'] == '' || LIST.style['display'] == 'none') {
    if (!isAlreadyLoaded) {
      while (!SIGHTS) {
        console.log("No array");
      }

      SIGHTS.forEach(sight => {
        if (sight.category === filterName) {
          const liElement = document.createElement('li');
          liElement.innerHTML = '<a onclick="displayModal(this.innerHTML)">' + sight.name + '</a>';
          LIST.appendChild(liElement);
        }
      });
      alreadyLoadedLists.push(listName);
    }
    LIST.style['display'] = 'block';
  }
  else {
    LIST.style['display'] = 'none';
  }
}

function cityListLoading(filterName, listName) {
  var isAlreadyLoaded = alreadyLoadedLists.find(loadedList => loadedList === listName);

  const LIST = document.getElementById(listName);
  if (LIST.style['display'] == '' || LIST.style['display'] == 'none') {
    if (!isAlreadyLoaded) {
      while (!SIGHTS) {
        console.log("No array");
      }

      SIGHTS.forEach(sight => {
        if (sight.city === filterName) {
          const liElement = document.createElement('li');
          liElement.innerHTML = '<a onclick="displayModal(this.innerHTML)">' + sight.name + '</a>';
          LIST.appendChild(liElement);
        }
      });
      alreadyLoadedLists.push(listName);
    }
    LIST.style['display'] = 'block';
  }
  else {
    LIST.style['display'] = 'none';
  }
}

function closeModal(){
  document.getElementById('modal').style.display = 'none';
}

function fillDataList(sights) {
  const list = document.getElementById('names');
  sights.forEach(s => {
    var option = document.createElement('option');
    option.value = s.name;
    list.appendChild(option);
  });
}

function openTab(evt, cityName) {
  var i, tabContent, tabLinks;
  tabContent = document.getElementsByClassName("tabContent");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }
  tabLinks = document.getElementsByClassName("tabLinks");
  for (i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.className += " active";
}

openTab(document.getElementById('City'), 'City');

// var isMapOn = true;
// function toggle(){
//     isMapOn = !isMapOn;
//     if(isMapOn){
//         map.style['display'] = '';
//         toggleButton.style['color'] = 'black';
//         toggleButton.style['background-image'] = 'none';
//         toggleButton.style['background-color'] = 'white';
//         DATA_DISPLAY.style['width'] = (window.innerWidth > 599) ? '20%' : '100%';
//     }
//     else{
//         map.style['display'] = 'none';
//         toggleButton.style['background-image'] = 'linear-gradient(to top right, rgb(92, 164, 169), rgb(155, 193, 188))';
//         toggleButton.style['color'] = 'whitesmoke';
//         DATA_DISPLAY.style['width'] = '100%'
//     }
// }



const SIGHTS = [
  new Sight('Arap dzamija', "SAJKDNASKDJ  J NSKJDnsak DNskaN KSND KNS kdSNSK NKK NKS nkN SKKN DKNASK DNASK DNASK NKA  NNSkan kNS kdNa sDS ", 'Islamska kultura', '1. Maj', 'Novi Pazar', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
  new Sight('Altun Alem dzamija', "SAJKDNASKDJ  J NSKJDnsak DNskaN KSND KNS kdSNSK NKK NKS nkN SKKN DKNASK DNASK DNASK NKA  NNSkan kNS kdNa sDS ", 'Islamska kultura', '1. Maj', 'Novi Pazar', 0, 0, ['recourses/', 'recourses/Kulajpg.jpg']),
  new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', 'Hercegovacka', 'Novi Pazar', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
  new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Pravoslavna kultura', '1. Maj', 'Sjenica', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
  new Sight('Arap dzamija', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', '1. Maj', 'Sjenica', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg', 'recourses/Dzamijajpg.jpg', 'recourses/manastirjpg.jpg', 'recourses/Kulajpg.jpg']),
  new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', '1. Maj', 'Tutin', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
  new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Pravoslavna kultura', '1. Maj', 'Raska', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
  new Sight('Arap dzamija', "SAJKDNASKDJ  J NSKJDnsak DNskaN KSND KNS kdSNSK NKK NKS nkN SKKN DKNASK DNASK DNASK NKA  NNSkan kNS kdNa sDS ", 'Islamska kultura', '1. Maj', 'Novi Pazar', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
  new Sight('Altun Alem dzamija', "SAJKDNASKDJ  J NSKJDnsak DNskaN KSND KNS kdSNSK NKK NKS nkN SKKN DKNASK DNASK DNASK NKA  NNSkan kNS kdNa sDS ", 'Islamska kultura', '1. Maj', 'Novi Pazar', 0, 0, ['recourses/', 'recourses/Kulajpg.jpg']),
  new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', 'Hercegovacka', 'Novi Pazar', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
  new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Pravoslavna kultura', '1. Maj', 'Sjenica', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
  new Sight('Arap dzamija', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', '1. Maj', 'Sjenica', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
  new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', '1. Maj', 'Tutin', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
  new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Pravoslavna kultura', '1. Maj', 'Raska', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
  new Sight('Arap dzamija', "SAJKDNASKDJ  J NSKJDnsak DNskaN KSND KNS kdSNSK NKK NKS nkN SKKN DKNASK DNASK DNASK NKA  NNSkan kNS kdNa sDS ", 'Islamska kultura', '1. Maj', 'Novi Pazar', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
  new Sight('Altun Alem dzamija', "SAJKDNASKDJ  J NSKJDnsak DNskaN KSND KNS kdSNSK NKK NKS nkN SKKN DKNASK DNASK DNASK NKA  NNSkan kNS kdNa sDS ", 'Islamska kultura', '1. Maj', 'Novi Pazar', 0, 0, ['recourses/', 'recourses/Kulajpg.jpg']),
  new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', 'Hercegovacka', 'Novi Pazar', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg', 'recourses/Dzamijajpg.jpg', 'recourses/manastirjpg.jpg', 'recourses/Kulajpg.jpg']),
  new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Pravoslavna kultura', '1. Maj', 'Sjenica', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg', 'recourses/Dzamijajpg.jpg', 'recourses/manastirjpg.jpg', 'recourses/Kulajpg.jpg']),
  new Sight('Arap dzamija', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', '1. Maj', 'Sjenica', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg', 'recourses/Dzamijajpg.jpg', 'recourses/manastirjpg.jpg', 'recourses/Kulajpg.jpg']),
  new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', '1. Maj', 'Tutin', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
  new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Pravoslavna kultura', '1. Maj', 'Raska', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg', 'recourses/Dzamijajpg.jpg', 'recourses/manastirjpg.jpg', 'recourses/Kulajpg.jpg']),
]

if (SIGHTS) {
  fillDataList(SIGHTS);
}