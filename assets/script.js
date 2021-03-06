//Beginning Variables
var restaurantList = {};
var eventList = {};
var usedRandomNumbersRestaurant = [];
var usedRandomNumbersEvent = [];
var saveDay;
var city; 
//Constants used throughout
//BTN section
const newDateBtn = document.querySelector(".new-date-btn")
const savedDateBtn = document.querySelector(".saved-date-btn")
const nextBtn = document.querySelector(".next-btn")
const createBtn = document.querySelector(".create-date-btn")
const saveBtn = document.querySelector(".save-date-btn")
const deleteBtn = document.querySelector(".delete-date-btn")
const restartBtn = document.querySelector(".restart-btn")
const shuffleBtn = document.querySelector(".shuffle-btn")
//Page section
const titlePage = document.querySelector(".title-page")
const filterPage = document.querySelector(".filter-page")
const criteriaPage = document.querySelector(".criteria-page")
const newDatePage = document.querySelector(".new-date-page")
const savedDatePage = document.querySelector(".saved-date-page")
//Filter Variables
var restaurantCheckBox;
var eventsCheckBox;
//Modal/Loading Icon Variables
var closeModalButtons = document.querySelector("[data-close-button]");
var overlay = document.getElementById("overlay");
var modal = document.getElementById("modal");
//Constants for User input
const dayInput = document.querySelector('#day-of');
const cityInput = document.querySelector('#city');
//Empty savedDate
var savedDate = JSON.parse(localStorage.getItem('savedDate'))
if (savedDate===null){
    savedDate= []; 
}


//Gets size of an object
Object.size = function(obj) {
    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

//Randomly picks through array of objects, and displays API results
function shuffle(){
    clearContent();
    var restaurantSize = Object.size(restaurantList);
    var eventSize = Object.size(eventList);
    var randomlySelectedRestaurant = Math.floor(Math.random()*restaurantSize);
    var randomlySelectedEvent = Math.floor(Math.random()*eventSize);
    var controller1 = true;
    var controller2 = true;

    //--displays restaurant API results 
    if (restaurantCheckBox == true) {
        while(controller1) {
            if(usedRandomNumbersRestaurant.indexOf(randomlySelectedRestaurant)==-1 && restaurantSize != 0){
                controller1 = false;
                var restaurantInfo = $('<div><p class = "api-text">' + restaurantList[randomlySelectedRestaurant].restaurant_name + '</p></div>');
                var restaurantAddress = $('<div><p class = "api-text">' + restaurantList[randomlySelectedRestaurant].address.formatted + '</p></div>');
                var restaurantPhone = $('<div><p class = "api-text">'+ restaurantList[randomlySelectedRestaurant].restaurant_phone + '</p></div>');
                var storeHours = (restaurantList[randomlySelectedRestaurant].hours);
                var restaurantHours = $('<div><p class = "api-text">'+ storeHours +'</p></div>');
                $('.restaurant-api').append(restaurantInfo, restaurantAddress, restaurantPhone);

                if (storeHours != ""){
                    $('.restaurant-api').append(restaurantHours);
                }
            }
            else if (restaurantSize == 0){
                controller1 = false;
            }
            else if (usedRandomNumbersRestaurant.length==restaurantSize) {
                window.alert("no more to loop through")
                controller1 = true;
            }
            else {randomlySelectedRestaurant = Math.floor(Math.random()*restaurantSize)}
        }
    }

    //--displays events API results
    if (eventsCheckBox == true) {
        while(controller2) {
            if(usedRandomNumbersEvent.indexOf(randomlySelectedEvent)==-1 && eventSize != 0){
                controller2 = false;
                var eventInfo = $('<div><p class = "api-text">'+ eventList[randomlySelectedEvent].name + '</p></div>');
                var eventType = $('<div><p class = "api-text">'+ eventList[randomlySelectedEvent].classifications['indexOf', 0].segment.name + ' ' + eventList[randomlySelectedEvent].classifications['indexOf', 0].subGenre.name + '</p></div>');
                var eventDates = $('<div><p class = "api-text">' + eventList[randomlySelectedEvent].dates.start.localDate + '</p></div>');
                var eventVenueAddress = $('<div><p class = "api-text">' + eventList[randomlySelectedEvent]._embedded.venues['indexOf', 0].address.line1 + ', ' + eventList[randomlySelectedEvent]._embedded.venues['indexOf', 0].city.name + ', ' + eventList[randomlySelectedEvent]._embedded.venues['indexOf', 0].state.name + '</p></div>');
                var priceCheck = eventList[randomlySelectedEvent].priceRanges;
                $('.event-api').append(eventInfo, eventType, eventDates, eventVenueAddress);
                
                if (priceCheck != undefined){
                    var eventPrice = $('<div><p class = "api-text"> $' + eventList[randomlySelectedEvent].priceRanges['indexOf', 0].min + ' each to $' + eventList[randomlySelectedEvent].priceRanges['indexOf', 0].max + ' each</p></div>');
                    $('.event-api').append(eventPrice);
                }
            }
            else if(eventSize == 0){
                console.log("no events")
                controller2 = false;
            }
            else if (usedRandomNumbersEvent.length==eventSize) {
                controller2 = true;
            }
            else {randomlySelectedEvent = Math.floor(Math.random()*eventSize)}
        }
    }
    usedRandomNumbersRestaurant.push(randomlySelectedRestaurant);
    usedRandomNumbersEvent.push(randomlySelectedEvent);
}

//Clears content on "See Anything You Like?" page
function clearContent(){
    var content = document.querySelector('.restaurant-api');
    while(content.firstChild){
        content.removeChild(content.firstChild);
    }
    content = document.querySelector('.event-api');
    while(content.firstChild){
        content.removeChild(content.firstChild);
    }
}

newDateBtn.onclick=()=>{
    filterPage.classList.add("filterActivate");
    titlePage.classList.add("titleDeactivate");
}

deleteBtn.onclick=()=>{
    location.reload();
    localStorage.clear();
}

//Filter approval button
nextBtn.onclick=()=>{
    usedRandomNumbersRestaurant = [];
    usedRandomNumbersEvent = []
    restaurantCheckBox = document.getElementById("Restaurants").checked;
    eventsCheckBox = document.getElementById("Events").checked;
    if (restaurantCheckBox == false && eventsCheckBox == false) {
        openModal("Please select one!")
    }
    else {
        filterPage.classList.remove("filterActivate");
        criteriaPage.classList.add("criteriaActivate");
    }
}

//Shuffle button
shuffleBtn.onclick=()=>{
    shuffle();
}

//API fetch for Create your date button
createBtn.onclick=()=>{
    city = $('#city').val();
    saveDay = dayInput.value;
    document.querySelector(".saved-date-btn").disabled = true;
    //API 1 - a33fecb2f255c04e008c528cf89286a2
    //API 2 - fa0e2d502955fffde3147fb635a2c723
    if(saveDay == ""){
        openModal("Please select a date")
    }
    else{
        displayLoading()
        fetch("https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=fa0e2d502955fffde3147fb635a2c723&q="+city)
        .then(response => response.json())
        .then(function (result){
            eventTest = result
            var lat = result['coord'].lat;
            var lon =  result['coord'].lon;
            

            fetch(
                "https://api.documenu.com/v2/restaurants/search/geo?lat="+lat+"&lon="+lon+"&distance=20&key=7a024a037f7d9e36de172881e2f7b497&size=20"
                )
                .then(function(response) {
                    return response.json();
                })
                .then(function(result) {
                    for(var restaurant in result.data){
                        restaurantList[restaurant] = result.data[restaurant];  
                }
                    var requestOptions = {
                        method: 'GET',
                        redirect: 'follow'
                };
                fetch(
                        "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&&size=20&apikey=0YgrYBljKlaRBH9BoF0vGgKaPYX1A96k&latlong="+lat+","+lon+"", requestOptions
                    )
                    .then(response => response.json())
                    .then(function (result){ 
                        if (result.page.totalElements != 0 ){
                            for(var event in result["_embedded"].events){
                                eventList[event] = result["_embedded"].events[event];
                            }
                        }
                        shuffle();
                        hideLoading()
                        criteriaPage.classList.remove("criteriaActivate");
                        newDatePage.classList.add("newDateActivate");
                    })
                    })
        }).catch(function (result){
            openModal("Invalid City Name!")
            hideLoading()
            document.querySelector(".saved-date-btn").disabled = false;
        });
    }
}

closeModalButtons.addEventListener("click", () => {
    var modals = document.querySelectorAll(".modal.active");
    modals.forEach(modal => {
        closeModal(modal);
    });
});

overlay.addEventListener("click", () => {
    var modals = document.querySelectorAll(".modal.active");
    modals.forEach(modal => {
        closeModal(modal);
    });
});

//open popup window
function openModal(errorMessage){
    var message = $('<p class ="modal-text">'+errorMessage+'</p>');
    $('.modal-text').append(message);

    modal.classList.add("active");
    overlay.classList.add("active");
}
  
  //close popup window
function closeModal(){
    modal.classList.remove("active");
    overlay.classList.remove("active");
    content = document.querySelector('.modal-text');
    while(content.firstChild){
        content.removeChild(content.firstChild);
    }
}
//Save Date button
saveBtn.onclick=()=>{

    var selectedRestaurant =  restaurantList[usedRandomNumbersRestaurant[(usedRandomNumbersRestaurant.length-1)]]
    var selectedEvent = eventList[usedRandomNumbersEvent[(usedRandomNumbersEvent.length-1)]]
    if (restaurantCheckBox == false){
        selectedRestaurant = "none"
    }
    if (eventsCheckBox == false){
        selectedEvent = "none"
    }


    var selectedActivities = {"city":city, "date":saveDay, "restaurant":selectedRestaurant , "event":selectedEvent}  
    localStorage.setItem("savedDate", JSON.stringify(selectedActivities));
    location.reload();

}

//Saved date page button
savedDateBtn.onclick=()=>{
    savedDate = JSON.parse(localStorage.getItem('savedDate'))
    if (savedDate == undefined){
        openModal("No Saved Dates!")
    }

    else{
        if (savedDate["restaurant"] != 'none') {
            var displayDate = $('<p class="date-day">Date Day: <span>'+savedDate.date+'</span></p>')
            var displayCity = $('<p class="date-city">City: <span>'+savedDate.city+'</span></p>')
            $('.date-day-display').append(displayCity,displayDate);

            var restaurantInfo = $('<div><p class = "api-text">' + savedDate["restaurant"].restaurant_name + '</p></div>');
            var restaurantAddress = $('<div><p class = "api-text">' + savedDate["restaurant"].address.formatted + '</p></div>');
            var restaurantPhone = $('<div><p class = "api-text">'+ savedDate["restaurant"].restaurant_phone + '</p></div>');
            var storeHours = (savedDate["restaurant"].hours);
            var restaurantHours = $('<div><p class = "api-text">'+ storeHours +'</p></div>');
            $('.saved-restaurant-api').append(restaurantInfo, restaurantAddress, restaurantPhone);
            if (storeHours != ""){
                $('.saved-restaurant-api').append(restaurantHours);
            }
        }

        if (savedDate["event"] != 'none') {
            var eventInfo = $('<div><p class = "api-text">'+ savedDate["event"].name + '</p></div>');
            var eventType = $('<div><p class = "api-text">'+ savedDate["event"].classifications['indexOf', 0].segment.name + ' ' + savedDate["event"].classifications['indexOf', 0].subGenre.name + '</p></div>');
            var eventDates = $('<div><p class = "api-text">' + savedDate["event"].dates.start.localDate + '</p></div>');
            var eventVenueAddress = $('<div><p class = "api-text">' + savedDate["event"]._embedded.venues['indexOf', 0].address.line1 + ', ' + savedDate["event"]._embedded.venues['indexOf', 0].city.name + ', ' + savedDate["event"]._embedded.venues['indexOf', 0].state.name + '</p></div>');
            var priceCheck = savedDate["event"].priceRanges;
            $('.saved-event-api').append(eventInfo, eventType, eventDates, eventVenueAddress);
    
            if (priceCheck != undefined){
                var eventPrice = $('<div><p class = "api-text"> $' + savedDate["event"].priceRanges['indexOf', 0].min + ' each to $' + savedDate["event"].priceRanges['indexOf', 0].max + ' each</p></div>');
                $('.saved-event-api').append(eventPrice);
            }
        }
        titlePage.classList.add("titleDeactivate");
        savedDatePage.classList.add("savedDateActivate");
    }
    
}

// selecting loading div
const loader = document.querySelector("#loading");

// showing loading
function displayLoading() {
    loader.classList.add("display");
    // to stop loading after some time
    setTimeout(() => {
        loader.classList.remove("display");
    }, 5000);
}

// hiding loading 
function hideLoading() {
    loader.classList.remove("display");
}

//Brings you back to home screen
restartBtn.onclick=()=>{
    location.reload();
}
