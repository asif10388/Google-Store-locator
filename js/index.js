var map;
var markers = [];
var infoWindow;
function initMap() {
    var losAngeles  = {lat: 34.063380, lng: -118.358080};
    map = new google.maps.Map(document.getElementById('map'), {
      center: losAngeles ,
      zoom: 15,
      mapTypeId: 'roadmap',
      styles: [
        {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
        {
          featureType: 'administrative',
          elementType: 'geometry.stroke',
          stylers: [{color: '#c9b2a6'}]
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'geometry.stroke',
          stylers: [{color: '#dcd2be'}]
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'labels.text.fill',
          stylers: [{color: '#ae9e90'}]
        },
        {
          featureType: 'landscape.natural',
          elementType: 'geometry',
          stylers: [{color: '#dfd2ae'}]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [{color: '#dfd2ae'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#93817c'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry.fill',
          stylers: [{color: '#a5b076'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#447530'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#f5f1e6'}]
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry',
          stylers: [{color: '#fdfcf8'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#f8c967'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#e9bc62'}]
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry',
          stylers: [{color: '#e98d58'}]
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry.stroke',
          stylers: [{color: '#db8555'}]
        },
        {
          featureType: 'road.local',
          elementType: 'labels.text.fill',
          stylers: [{color: '#806b63'}]
        },
        {
          featureType: 'transit.line',
          elementType: 'geometry',
          stylers: [{color: '#dfd2ae'}]
        },
        {
          featureType: 'transit.line',
          elementType: 'labels.text.fill',
          stylers: [{color: '#8f7d77'}]
        },
        {
          featureType: 'transit.line',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#ebe3cd'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'geometry',
          stylers: [{color: '#dfd2ae'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [{color: '#b9d3c2'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#92998d'}]
        }
      ]
    });
    infoWindow = new google.maps.InfoWindow();   

    searchStores();
  }


  function searchStores() {
    var searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('click', searchStores)
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;
    if(zipCode){
      for(var store of stores){
        var postal = store['address']['postalCode'].substring(0, 5);
        if(postal == zipCode) foundStores.push(store);
      }
    }else{
      foundStores = stores;
    } 
    clearLocations()
    displayStores(foundStores);
    showStoreMarkers(foundStores);
    setOnClickListener();
  }

  // function searchStoreOnKeyPress(e) {
  //   var searchInput = document.querySelector('.search-input');
  //   if(e.keyCode == 13) searchInput.addEventListener('keydown', searchStores);
  //   console.log(e)
  // }
  // window.addEventListener('keydown', searchStoreOnKeyPress);
  function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
  }

  function setOnClickListener() {
      var storeElements = document.querySelectorAll('.store-container');
      storeElements.forEach(function (elem, index) {
        elem.addEventListener('click', function () {
          new google.maps.event.trigger(markers[index], 'click');
        })        
      })
  }

  function displayStores(stores) {
    var storeHTML = '';
    for (var [index,store] of stores.entries()) {
      var address = store['addressLines'];
      var phone = store['phoneNumber'];

      storeHTML += `
      <div class="store-container" >
                <div class="store-info-container">
                    <div class="store-address"> 
                        <span>${address[0]}</span>
                        <span>${address[1]}</span>
                    </div>
                    <div class="store-phone-number">${phone}</div>
                </div>

                <div class="store-number-container">
                    <div class="store-number">
                        ${index + 1}
                    </div>
                </div>
            </div>

      `
      document.querySelector('.store-list').innerHTML = storeHTML;
    }
  }

  function showStoreMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    for (var [index,store] of stores.entries()) { 
      var latlng = new google.maps.LatLng(
        store["coordinates"]["latitude"],
        store["coordinates"]["longitude"]);

        var name = store["name"];
        var address = store["addressLines"][0];
        var openStatusText = store["openStatusText"];
        var number = store["phoneNumber"]
        bounds.extend(latlng);

        createMarker(latlng, name, address, index+1, openStatusText, number)
      }
      map.fitBounds(bounds);
    }
  
  function createMarker(latlng, name, address, index, openStatusText, number) {
    var html = `
     <div class="info-window-container">
        <div class="info-window-store-name">${name}</div>
        <div class="info-window-opening-time">${openStatusText}</div>

        <div class="info-window-sub-container1">
            <i class="fas fa-map-marked-alt"></i>
            <div class="info-window-address" onclick='window.open("https://www.google.com/maps/dir/?api=1&origin=Your location&destination=${name} + ${address}+WA&travelmode=flight")'>${address}</div>

        </div>
        <div class="info-window-sub-container2">
            <i class="fas fa-phone-square-alt"></i>
            <div class="info-window-number">${number}</div>
        </div>

    </div>`;
    var newIcon = 'https://i.ibb.co/gSLxfjg/shopping-bag-1.png';
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      label:{
        text: index.toString(),
        color: "#eb3a44",
        fontSize: "15px",
        fontWeight: "bold",
      },
      icon: newIcon
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
  }





  

 