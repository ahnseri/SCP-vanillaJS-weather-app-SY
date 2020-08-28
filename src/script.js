// get timestamp and format date
function formatDay(timestamp) {
  let date = new Date(timestamp);
  let daysIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = daysIndex[date.getDay()];
  return day;
}
function formatMonth(date) {
  let monthIndex = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = monthIndex[date.getMonth()];
  return month;
}
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let getDate = date.getDate();
  let getTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formatDay(timestamp)}., ${formatMonth(
    date
  )}. ${getDate} | ${getTime}`;
}

let now = new Date();
document.querySelector("#timestamp").innerHTML = formatDate(now);

//get and show weather forecast
function getForecastFahrenheit() {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/onecall?";
  let apiUrl = `${apiEndpoint}lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}&exclude=minutely,hourly`;
  axios.get(apiUrl).then(showForecast);
}
function getForecastCelsius() {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/onecall?";
  let apiUrl = `${apiEndpoint}lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}&exclude=minutely,hourly`;
  axios.get(apiUrl).then(showForecast);
}

function showForecast(response) {
  forecastElement.innerHTML = null;
  let forecast = null;
  for (let index = 1; index <= 5; index++) {
    forecast = response.data.daily[index];
    forecastElement.innerHTML += `
        <div class = "card text-center col-sm-2 forecast-week">
					<ul class = "list-group list-group-horizontal-sm">
						<li class = "list-group-item.flex-fill">
							<span class = "forecast-day">
								${formatDay(forecast.dt * 1000)}
							</span><br />
							<span class = "forecast-icon">
								<img src="https://openweathermap.org/img/wn/${
                  forecast.weather[0].icon
                }@2x.png" />
							</span>
							<span class="forecast-temp">
								<strong>${Math.round(forecast.temp.max)}°</strong> / ${Math.round(
      forecast.temp.min
    )}°
							</span>
						</li>
					</ul>	
        `;
  }
}

//get and display current weather
function showTodayWeather(response) {
  document.querySelector("#city").innerHTML = cityName;

  celsiusTemp = response.data.current.temp;
  document.querySelector("#temperature").innerHTML = Math.round(celsiusTemp);
  document.querySelector("#units-main").innerHTML = "°C";

  document.querySelector("#weather-des").innerHTML =
    response.data.current.weather[0].description;

  celsiusTempFeel = response.data.current.feels_like;
  document.querySelector("#feels-like").innerHTML = Math.round(celsiusTempFeel);
  document.querySelector("#units-des").innerHTML = "°C";

  document.querySelector("#humidity").innerHTML =
    response.data.current.humidity;

  document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.current.wind_speed * 3.6
  );

  let mainWeatherIcon = document.querySelector("#weather-icon");
  mainWeatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.current.weather[0].icon}@2x.png`
  );
  mainWeatherIcon.setAttribute(
    "alt",
    response.data.current.weather[0].description
  );
  document.querySelector("#error-msg").innerHTML = "";
  return response;
}

function getWeatherInfo() {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/onecall?";
  let apiUrl = `${apiEndpoint}lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}&exclude=minutely,hourly`;
  axios.get(apiUrl).then(showTodayWeather).then(showForecast);
}

function getLocationInfo(response) {
  cityName = response.data.name;
  latitude = response.data.coord.lat;
  longitude = response.data.coord.lon;
  return response;
}

function search(city) {
  if (city) {
    let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?q=";
    let apiUrl = `${apiEndpoint}${city}&units=${units}&appid=${apiKey}`;
    axios.get(apiUrl).then(getLocationInfo).then(getWeatherInfo);
  } else {
    document.querySelector(
      "#error-msg"
    ).innerHTML = `Please enter a city name:`;
  }
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-city");
  search(city.value);
  city.value = "";
}

//get user current location
function updateGeolocation(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=`;
  let apiUrl = `${apiEndpoint}&lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(getLocationInfo).then(getWeatherInfo);
}

function getUserLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(updateGeolocation);
}

//convert celsius and fahrenheit
function getFahrenheit(temp) {
  return Math.round((temp * 9) / 5 + 32);
}

function showFahrenheit(event) {
  event.preventDefault();
  document.querySelector("#temperature").innerHTML = getFahrenheit(celsiusTemp);
  document.querySelector("#feels-like").innerHTML = getFahrenheit(
    celsiusTempFeel
  );
  document.querySelector("#units-main").innerHTML = "°F";
  document.querySelector("#units-des").innerHTML = "°F";
  getForecastFahrenheit();
}

function showCelsius(event) {
  event.preventDefault();
  document.querySelector("#temperature").innerHTML = Math.round(celsiusTemp);
  document.querySelector("#feels-like").innerHTML = Math.round(celsiusTempFeel);
  document.querySelector("#units-main").innerHTML = "°C";
  document.querySelector("#units-des").innerHTML = "°C";
  getForecastCelsius();
}

//user action
let changeCityForm = document.querySelector("#search-form");
changeCityForm.addEventListener("submit", handleSubmit);

let currentLocation = document.querySelector("#user-location");
currentLocation.addEventListener("click", getUserLocation);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", showCelsius);

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", showFahrenheit);

//global variables
let apiKey = "264d058cf40518d3759e3102bcc572cf";
let units = "metric";
let city = null;
let cityName = null;
let latitude = null;
let longitude = null;
let celsiusTemp = null;
let celsiusTempFeel = null;
let forecastElement = document.querySelector("#forecast");

search("Toronto");
