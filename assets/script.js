$(document).ready(function () {
    var input = document.getElementById("cityInput");
    autocomplete = new google.maps.places.Autocomplete(input);
    var cities = [];

    // get from local storage and append
    function getSavedCities(){
        storedCities = JSON.parse(localStorage.getItem("cities"));
        if (storedCities !== null) {
            cities=storedCities;
            index = cities.length -1
            var address = cities[index];
            if (index <0) {
                return
            } else {
                renderWeather(address);
                console.log(index)
            }

        } 
      
    }
    getSavedCities();
 
    // search button click 
$(".search").on("click", function (event) {
    
     event.preventDefault();
    $("#currentForcast").empty();
    $("#fivaDaysForcastTitle").empty();
    $("#card-group").empty();
    var location = $("#cityInput").val();
        $("#cityInput").val("");
    $("#searchTitle").text("Search for city:");
    $("#searchTitle").attr("style", "color:black");  
        // If search field empty tell user to fill it in, otherwise send search
        if (location == "") {
            $("#searchTitle").text("Please enter a city to search:");
            $("#searchTitle").attr("style", "color:red");
          } else {
            console.log("Place chosen:" + location);
            renderWeather(location);

            if (cities.includes(location)){
                return
            } else {
            cities.push(location);
            saveToLS(cities);
            }

             
        }
       
  
});

// function to append the weather cards 
function renderWeather (location){
    var googleURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyCyJX-Kt-KlymneRkWUnMjVk1KrA3bwCD0";
      
    // Google maps ajax request
    $.ajax({
      url: googleURL,
      method: "GET"
    }).then(function (Response) {
      //set var coordinates equal to coordinates object provided by google api
      var coordinates = Response.results[0].geometry.location;
    
      // log Latitude and Longitude of selected location
      console.log("Lat: " + coordinates.lat);
      console.log("Long: " + coordinates.lng);

      // Running Trails api request
      //Set lat and long equal to latitude and longitude from google's coordinates object
      var lat = coordinates.lat;
      var long = coordinates.lng;
      var ApiKey ="1cc97d825b38e7758e87a7875f1d4138"
      //current weater API
      var weatherURl = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=" + ApiKey + "&units=imperial";

      $.ajax({
          url:weatherURl,
          method: "GET"
      }).then (function(response){
          console.log(response);
          var currentDate = moment.unix(response.dt).format("l");
          var weatherDiv = $("<div class= 'card-body text-white bg-secondary mb-3'>")
          var nameDiv = $('<div class="card-header">');
          var name = $('<h5 class = card-title>')
          name.text(location + ", "+ currentDate );
          nameDiv.append(name);
          var temp = $("<h5>");
          temp.text("Temp: " + (response.main.temp + " °F"));

            
        var feelslike = $("<h5>");
        feelslike.text("Feels like: " + (response.main.feels_like + " °F"));

        var humidity = $("<h5>");
        humidity.text("Humidity: " + response.main.humidity + "%");

            weatherDiv.append(nameDiv, temp, feelslike, humidity);
          
          $("#currentForcast").append(weatherDiv);
      })
      // calling the five day weather forecast API
      var FivDayURl = "https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long +"&exclude=hourly,minutely" + "&appid=" + ApiKey + "&units=imperial";
      $.ajax({
        url:FivDayURl,
        method: "GET"
    }).then (function(response){
        console.log(response)
        var headerDiv = $('<div class=" card-header text-white bg-primary w-100">')
        var cardHeader = $("<h4 class = 'card-title'>");
        cardHeader.text("Five Day Forecast");
        headerDiv.append(cardHeader);
        $("#fivaDaysForcastTitle").append(headerDiv);
        for (var i=0; i < 5; i++){
            var Date = moment.unix(response.daily[i].dt).format("l");
            console.log(Date)



            var forecastDiv = $('<div class=" card text-white bg-primary  col margin w-100">');
            var cardBody = $('<div class = "margin">');
            var cardTitle = $('<h6 class = "card-title">');
            cardTitle.text(Date);

            var imgDiv = $('<img>');
            imgDiv.attr("src", "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon+"@2x.png");

            var tempDay = $('<p class="card-text">');
            tempDay.text("Day: " + response.daily[i].temp.day + " °F");

            var tempNight = $('<p class="card-text">');
            tempNight.text("Night: " + response.daily[i].temp.night + " °F");

            var humidity =$('<p class="card-text">');
            humidity.text("Humidity: " + response.daily[i].humidity + "%");

            var uvi = $('<p class="card-text">');
            uvi.text("UVI: " + response.daily[i].uvi);
            cardBody.append(cardTitle);
             forecastDiv.append(cardBody, imgDiv, tempDay,tempNight,humidity,uvi);
            $("#card-group").append(forecastDiv);

        }
        $("#cities").empty(); 
        
        for (var i = 0; i <cities.length; i++){
            console.log(i)
             var citiesP = $('<p class = "card-text" >');
             
            citiesP.text(cities[i]);
            $("#cities").append(citiesP);
        }
        
    })
    });
    
}
// save to local storage
function saveToLS (arr) {
    
    localStorage.setItem("cities", JSON.stringify(arr))
}

// when click clear history remove the history list
$(".clearHistory").on("click", function (event) {
     event.preventDefault();
     console.log("I am clicked")
    cities=[];
    saveToLS(cities);
    $("#cities").empty();
    $("#currentForcast").empty();
    $("#fivaDaysForcastTitle").empty();
    $("#card-group").empty();
});
});

