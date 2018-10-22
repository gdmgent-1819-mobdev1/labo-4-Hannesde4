//defining my variables
const buttonLike = document.getElementById("like");
const buttonDislike = document.getElementById("dislike");
const status = document.getElementById("check");
const list = document.getElementsByClassName('personChoice')[0];
let countStorage = 1;
let clickCounter = 1;

//to add the map data on location 0 in the localstorage
getMap(1,1);

//als er geklikt wordt op like, dan wordt de functie changeLike opgeroepen
buttonLike.onclick = function(){
    changeLike("like");
};


//als er geklikt wordt op dislike, dan wordt de functie changeLike opgeroepen
buttonDislike.onclick = function(){
    changeLike("dislike");
};


//als er op de status button wordt geklikt, dan wordt de functie statusShow aangeroepen
status.onclick = function(){
    //defining my variables
    let containerDiv = document.getElementsByClassName("container")[0];
    let statusDiv = document.getElementsByClassName("status")[0]
    //als er nog geen likes of dislikes zijn aangeklikt, dan krijg je een alert
    if(clickCounter !== 1){
        //wisselt de class not-visible over de 2 div's
        containerDiv.classList.toggle('not-visible');
        statusDiv.classList.toggle('not-visible');
    }else{
        alert("Maak eerst je keuze bij je eerste match voordat je een overzicht krijgt van de reeds doorlopen personen");
    }
    statusShow();
};


//functie die iedereen in localstorage overloopt en naar de forFunction doorstuurd
function statusShow(){
    //defining my variables
    let storedAmount = localStorage.length;
    list.innerHTML ="";
    //kijkt wie er geliked is
    for(let a = 1; a < storedAmount; a++){
        showListLiked("like", a); 
    };
    //kijkt wie er gedisliked wordt
    for(let a = 1; a < storedAmount; a++){
        showListLiked("dislike", a);
    };
};


//eventlistener, als er geklikt wordt op een element binnen mijn ol
document.getElementById("personChoice").addEventListener("click", function(e) {
    //er wordt gekeken of er geklikt is op een i-element
    if(e.target && e.target.nodeName == "I"){
        let key = e.target.id;
        let res = parseInt(key.substr(3));
        let person = JSON.parse(localStorage[res]);
        let status = person.choice
        //switch van like naar dislike of dislike naar like
        if(status == "like"){
            status = "dislike";
        }else if(status == "dislike"){
            status = "like";
        }
        //plaatst nieuwe keuze in de localStorage
        person.choice = status;
        let dataPerson = JSON.stringify(person);
        localStorage[res] = dataPerson;
        //refresht de personen
        statusShow();
    }
})


setTimeout(function() { getData(); }, 200);