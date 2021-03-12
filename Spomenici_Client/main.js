
class Sight {
  constructor(name, description, category, streetLocation, city, latitude, longitude, images, videUrl) {
    this.name = name;
    this.description = description;
    this.category = category;
    this.streetLocation = streetLocation;
    this.city = city;
    this.latitude = latitude;
    this.longitude = longitude;
    this.imageUrls = images;
    if (!videUrl)
      this.videUrl = "";
    else
      this.videUrl = videUrl;
  }

  display(img) {
    var txt = `<div class="gallery">`
    if (img) {
      txt += `<img alt="${this.name}" class="mainPhoto" src="${img}" alt="hahu">`;
    }
    else {
      txt += `<img alt="${this.name}" class="mainPhoto" src="${this.imageUrls[0]}" alt="hahu">`;
    }
    txt += `<div class="photoContainer">`
    this.imageUrls.forEach(i => {
      txt += `<img alt="${this.name}" onclick="loadMainPhoto(this)" class="mainPhoto" src="${i}" alt="hahu">`;
    })

    txt += `</div>
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

var displayedInfoWindow = null;
var alreadyLoadedLists = [];
var SIGHTS = [];
var MARKERS = [];

function loadSights() {
  const url = "http://localhost/Spomenici-Projekat/Spomenici_Backend/sights.php?mode=SIGHTS";
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const response = this.responseText.replace(/(<([^>]+)>)/gi, "");   // Remove HTML tags from RESPONSE
      JSON.parse(response).forEach(r => SIGHTS.push(new Sight(r.name, r.description, r.category, r.streetLocation, r.city, r.latitude,
        r.longitude, r.imageUrls, r.videUrl)));
      fillDataList(SIGHTS);
      makeMarkerArray();
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send('json');
}

// loadSights();

// Making a Leaflet map ------------------------------------------------------------------------------------

const ZOOM_LVL = 14;
const LATITUDE = 43.135457;
const LONGITUDE = 20.515304;
function initMap() {
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: ZOOM_LVL,
    center: { lat: LATITUDE, lng: LONGITUDE },
    mapId: 'f55b320e52c3f82d',
    mapTypeControl: false,
    fullScreenControl: false,
    streetViewControl: false,
    maxZoom: 17,
    minZoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });

  for (let i = 0; i < MARKERS.length; i++) {
    const currMarker = MARKERS[i];

    const marker = new google.maps.Marker({
      position: { lat: parseFloat(currMarker[1]), lng: parseFloat(currMarker[2]) },
      map,
      title: currMarker[0],
      icon: {
        url: currMarker[5],
        scaledSize: new google.maps.Size(currMarker[3], currMarker[4]),
      },
      animation: google.maps.Animation.DROP,
    });

    const currSight = SIGHTS.find(s => s.name === currMarker[0]);
    const iconContent = `<button type="button" id="${currSight.name}"
                               style="width:170px; height:170px; margin:5.6px 0 5.6px 5.6px; border-radius:8px 8px 8px 8px; background-color: Transparent; background-repeat:no-repeat; border:none; cursor:pointer; overflow: hidden; outline:none; padding:0">
                                  <img src="${currSight.imageUrls[0]}" alt="${currSight.name}" style="width:140px;height:100px;border-top-left-radius:8px;border-top-right-radius:8px">
                                  <div>
                                    <h4 style="margin:0 0 10px 4px"><b>${currSight.name}</b></h4>
                                    <p style="margin:0 0 4px 4px">${currSight.category}</p>
                                    <p style="margin:0 0 4px 4px">${currSight.city}  |  ${currSight.streetLocation}</p>
                                  </div>
                                </button>`;

    const infoWindow = new google.maps.InfoWindow({
      content: iconContent,
    });

    marker.addListener('click', () => {
      if(displayedInfoWindow){
        displayedInfoWindow.close();
      }
      infoWindow.open(map, marker);
      displayedInfoWindow = infoWindow;
    });

    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
      document.getElementById(currSight.name).addEventListener('click', () => {
        displayModal(currSight.name);
      });
    });
  }
}

// Name
// Latitude, Longitude
// scaledSize width, height
// Icon URL
function makeMarkerArray() {
  SIGHTS.forEach(s => {
    const marker = [s.name, s.latitude, s.longitude, 38, 31];
    switch (s.category) {
      case 'Islamska kultura':
        marker.push('recourses/tower_icon.png');
        break;
      case 'Pravoslavna kultura':
        marker.push('recourses/tower_icon.png');
        break;
      case 'Kulturno istorijski spomenici':
        marker.push('recourses/tower_icon.png');
        break;
      case 'Poruseni objekti':
        marker.push('recourses/tower_icon.png');
        break;
      case 'Prirodne lepote':
        marker.push('recourses/tower_icon.png');
        break;
      case 'Gradske zanimljivosti':
        marker.push('recourses/tower_icon.png');
        break;
    }
    MARKERS.push(marker);
  })
}

// ----------------------------------------------------------------------------------------------------------

const DATA_DISPLAY = document.getElementById('dataDisplay');

window.addEventListener('keyup', (event) => {
  if (event.which === 27) {
    closeModal();
  }
})

function displayModal(name) {
  input = name ? name : document.getElementById('search').value;

  const searchSight = SIGHTS.find(s => s.name.toLowerCase().includes(input.toLowerCase()));
  if (searchSight) {
    document.getElementById('modalContent').innerHTML = searchSight.display();
    document.getElementById('modal').style.display = 'flex';
  }
}

function loadMainPhoto(imgElement) {
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

function closeModal() {
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



// SIGHTS = [
//   new Sight('Arap dzamija', "SAJKDNASKDJ  J NSKJDnsak DNskaN KSND KNS kdSNSK NKK NKS nkN SKKN DKNASK DNASK DNASK NKA  NNSkan kNS kdNa sDS ", 'Islamska kultura', '1. Maj', 'Novi Pazar', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
//   new Sight('Altun Alem dzamija', "SAJKDNASKDJ  J NSKJDnsak DNskaN KSND KNS kdSNSK NKK NKS nkN SKKN DKNASK DNASK DNASK NKA  NNSkan kNS kdNa sDS ", 'Islamska kultura', '1. Maj', 'Novi Pazar', 0, 0, ['recourses/', 'recourses/Kulajpg.jpg']),
//   new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', 'Hercegovacka', 'Novi Pazar', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
//   new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Pravoslavna kultura', '1. Maj', 'Sjenica', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
//   new Sight('Arap dzamija', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', '1. Maj', 'Sjenica', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg', 'recourses/Dzamijajpg.jpg', 'recourses/manastirjpg.jpg', 'recourses/Kulajpg.jpg']),
//   new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', '1. Maj', 'Tutin', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
//   new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Pravoslavna kultura', '1. Maj', 'Raska', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
//   new Sight('Arap dzamija', "SAJKDNASKDJ  J NSKJDnsak DNskaN KSND KNS kdSNSK NKK NKS nkN SKKN DKNASK DNASK DNASK NKA  NNSkan kNS kdNa sDS ", 'Islamska kultura', '1. Maj', 'Novi Pazar', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
//   new Sight('Altun Alem dzamija', "SAJKDNASKDJ  J NSKJDnsak DNskaN KSND KNS kdSNSK NKK NKS nkN SKKN DKNASK DNASK DNASK NKA  NNSkan kNS kdNa sDS ", 'Islamska kultura', '1. Maj', 'Novi Pazar', 0, 0, ['recourses/', 'recourses/Kulajpg.jpg']),
//   new Sight('Djurdjevi Stupovi', "Opis FOpis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', 'Hercegovacka', 'Novi Pazar', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
//   new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Pravoslavna kultura', '1. Maj', 'Sjenica', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
//   new Sight('Arap dzamija', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', '1. Maj', 'Sjenica', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
//   new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', '1. Maj', 'Tutin', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
//   new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Pravoslavna kultura', '1. Maj', 'Raska', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
//   new Sight('Arap dzamija', "SAJKDNASKDJ  J NSKJDnsak DNskaN KSND KNS kdSNSK NKK NKS nkN SKKN DKNASK DNASK DNASK NKA  NNSkan kNS kdNa sDS ", 'Islamska kultura', '1. Maj', 'Novi Pazar', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
//   new Sight('Altun Alem dzamija', "SAJKDNASKDJ  J NSKJDnsak DNskaN KSND KNS kdSNSK NKK NKS nkN SKKN DKNASK DNASK DNASK NKA  NNSkan kNS kdNa sDS ", 'Islamska kultura', '1. Maj', 'Novi Pazar', 0, 0, ['recourses/', 'recourses/Kulajpg.jpg']),
//   new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', 'Hercegovacka', 'Novi Pazar', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg', 'recourses/Dzamijajpg.jpg', 'recourses/manastirjpg.jpg', 'recourses/Kulajpg.jpg']),
//   new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Pravoslavna kultura', '1. Maj', 'Sjenica', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg', 'recourses/Dzamijajpg.jpg', 'recourses/manastirjpg.jpg', 'recourses/Kulajpg.jpg']),
//   new Sight('Arap dzamija', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', '1. Maj', 'Sjenica', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg', 'recourses/Dzamijajpg.jpg', 'recourses/manastirjpg.jpg', 'recourses/Kulajpg.jpg']),
//   new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Islamska kultura', '1. Maj', 'Tutin', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg']),
//   new Sight('Djurdjevi Stupovi', "Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis Opis ", 'Pravoslavna kultura', '1. Maj', 'Raska', 0, 0, ['recourses/Arap_Dzamija.jpg', 'recourses/Kulajpg.jpg', 'recourses/Dzamijajpg.jpg', 'recourses/manastirjpg.jpg', 'recourses/Kulajpg.jpg']),
// ]

// if (SIGHTS) {
//   fillDataList(SIGHTS);
// }