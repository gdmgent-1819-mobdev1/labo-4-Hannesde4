function getData() {
    //calling my data from an API with fetch
    fetch('https://randomuser.me/api/?results=10')
    .then(function(response) {
        return response.json();
    }).then(function(data){
//        console.log(data.results);
        addToStorage(data);

        personOnScreen();
    });
};


function addToStorage(data){
    //loop to go through al my loaded profiles and to add them to local storage
    for( i = 0; i < 10; i++){
        let personData = { //object with all my data
            id: "key" + countStorage,
            firstName:  data.results[i].name.first,
            secondName: data.results[i].name.last,
            place: data.results[i].location.city,
            age: data.results[i].dob.age,
            gender: data.results[i].gender,
            choice: "none",
            image: data.results[i].picture.large,
            coordinates: data.results[i].location.coordinates
        }
        let dataPerson = JSON.stringify(personData);
        localStorage[countStorage] = dataPerson; //adding the object to localstorage with the key as id
        countStorage++; //add 1 to countStorage
    };
    //when the loop is executed 10 times, then i = 0
    if(i=10){
        i=0;
    };
};


//function that is executed when the like or dislike button is hit and puts that preference in the object
function changeLike(status){
    let person = JSON.parse(localStorage[clickCounter]); //get string from localstorage
    person.choice = status; //change the choice attribute from the opbject
    let dataPerson = JSON.stringify(person); //convert object back to string
    localStorage[clickCounter] = dataPerson; //store the string back in localstorage
    clickCounter++; //add 1 to clickCounter
    personOnScreen();
    if(clickCounter % 10 == 0){ //when we went trough 9 persons getData() wil be executed
        getData();
    };
};


//function that shows my person on the screen
function personOnScreen(){
    //defining my variables
    const image = document.getElementsByClassName("image")[0];
    const place = document.getElementsByClassName("place")[0];
    const name = document.getElementsByClassName("name")[0];
    let person = JSON.parse(localStorage[clickCounter]); 
    name.innerHTML = person.firstName + ', ' + person.age;
    place.innerHTML = person.place;
    image.src = person.image;

    //variables to define my latitude and longitude
    let lat = parseFloat(person.coordinates.latitude);
    let lng = parseFloat(person.coordinates.longitude);
    getMap(lng, lat);
    const distance = document.getElementsByClassName("mapboxgl-ctrl-bottom-right")[1];
    distance.innerHTML = calculateDistance(lng, lat);
};


//function  to show my list of likes and dislikes
function showListLiked(keuze, abc){
    //defining my variables
    let person = JSON.parse(localStorage[abc]);
    
    //if/else statement that lists all my persons with a preference
    if(person.choice == keuze && keuze == "like"){
        userChoice = "fa-heart";
        list.innerHTML += '<li class="personList clearfix"> <img src="' + person.image + '" alt="profile picture"><p>' + person.firstName + ' ' + person.secondName + ', ' + person.age + '</p><p>' + person.place + '</p><i class="personChoiceIcon fas ' + userChoice + '" id="' + person.id + '"></i> </li>';
    }else if(person.choice == keuze && keuze == "dislike"){
        userChoice = "fa-times";
        list.innerHTML += '<li class="personList clearfix"> <img src="' + person.image + '" alt="profile picture"><p>' + person.firstName + ' ' + person.secondName + ', ' + person.age + '</p><p>' + person.place + '</p><i class="personChoiceIcon fas ' + userChoice + '" id="' + person.id + '"></i> </li>';
    };
};


function getMap(lng, lat){
    mapboxgl.accessToken = 'pk.eyJ1IjoiaGFubmVzZGU0IiwiYSI6ImNqbjRpbGk5MTBxZDYzdnJ1cXhxNmJqZWYifQ.IPhQBjaE_o5G4OsCrst0LA';


    //making the map
    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [lng, lat], // starting position as [lng, lat]
        zoom: 14
    });


    //function to show the radius on the map when page is loaded
    map.on('load', function(){
        let radius=80; //radius of the circle
        map.addSource("geomarker", { //making a source for the radius
            "type": "geojson",
            "data": {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                "type": "Point",
                "coordinates": [lng, lat] // starting position as [lng, lat]
                }
            }]
            }
        });
        map.addLayer({ //displaying the radius of the circle
            "id": "geomarker",
            "type": "circle",
            "source": "geomarker",
            "paint": {
            "circle-radius": radius, //radius with the variable radius
            "circle-color": "#3BBB87", //color
            "circle-opacity": 0.5, //opacity
            }
        });
    });


    // disable zoom on map
    map.scrollZoom.disable();
    
}


function calculateDistance(lat1, lon1){
    let lat2 = 0;
    let lon2 = 0;
    let unit = "K";
    const userLocation = navigator.geolocation.watchPosition(function(position) {
        console.log(position.coords.latitude, position.coords.longitude);
        lon2 = position.coords.latitude;
        lat2 = position.coords.longitude; 
    });
    let radlat1 = Math.PI * lat1/180;
        let radlat2 = Math.PI * lat2/180;
        let theta = lon1-lon2;
        let radtheta = Math.PI * theta/180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 };
        if (unit=="N") { dist = dist * 0.8684 };
        return(dist.toFixed(0) + " km");
}