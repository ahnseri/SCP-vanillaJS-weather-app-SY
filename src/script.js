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

//get city from user input
function search(city, unit) {
  if (city) {
    let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?q=";
    let apiUrl = `${apiEndpoint}${city}&units=${unit}&appid=${apiKey}`;
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
  currentCity = city.value;
  search(city.value, unit);
  city.value = "";
}

//get & display current weather
function getLocationInfo(response) {
  cityName = response.data.name;
  latitude = response.data.coord.lat;
  longitude = response.data.coord.lon;
  return response;
}

function getWeatherInfo() {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/onecall?";
  let apiUrl = `${apiEndpoint}lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}&exclude=minutely,hourly`;
  axios.get(apiUrl).then(showTodayWeather).then(showForecast);
}

function showTodayWeather(response) {
  console.log(response.data);
  document.querySelector("#city").innerHTML = cityName;

  celsiusTemp = response.data.current.temp;
  document.querySelector("#temperature").innerHTML = Math.round(celsiusTemp);
  document.querySelector("#units-main").innerHTML = `${getTempUnit()}`;

  document.querySelector("#weather-des").innerHTML =
    response.data.current.weather[0].description;

  celsiusTempFeel = response.data.current.feels_like;
  document.querySelector("#feels-like").innerHTML = `${Math.round(
    celsiusTempFeel
  )}${getTempUnit()}`;

  document.querySelector("#humidity").innerHTML =
    response.data.current.humidity;

  document.querySelector("#wind-speed").innerHTML = `${Math.round(
    response.data.current.wind_speed
  )} ${getWindUnit()}`;

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

function getTempUnit() {
  if (unit === "metric") {
    return `°C`;
  } else {
    {
      return `°F`;
    }
  }
}

function getWindUnit() {
  if (unit === "metric") {
    return `m/s`;
  } else {
    {
      return `mph`;
    }
  }
}

//get and show weather forecast
function getForecast() {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/onecall?";
  let apiUrl = `${apiEndpoint}lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}&exclude=minutely,hourly`;
  axios.get(apiUrl).then(showForecast);
}

function showForecast(response) {
  forecastElement.innerHTML = null;
  let forecast = null;
  for (let index = 1; index <= 5; index++) {
    forecast = response.data.daily[index];
    forecastElement.innerHTML += `
    <div class="card text-center col-sm-2 forecast-week">
    <ul class="list-group list-group-horizontal-sm">
      <li class="list-group-item.flex-fill">
        <span class="forecast-day">
          ${formatDay(forecast.dt * 1000)}
        </span><br />
        <span class="forecast-icon">
          <img src="https://openweathermap.org/img/wn/${
            forecast.weather[0].icon
          }@2x.png">
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

//get user current location
function updateGeolocation(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=`;
  let apiUrl = `${apiEndpoint}&lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(getLocationInfo).then(getWeatherInfo);
}

function getUserLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(updateGeolocation);
}

//change unit from celsius to fahrenheit
function showCelsius(event) {
  event.preventDefault();
  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
  swapUnitCelsius();
  getForecast();
}

function showFahrenheit(event) {
  event.preventDefault();
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
  swapUnitFahrenheit();
  getForecast();
}

function swapUnitCelsius() {
  if (unit === "imperial") {
    unit = "metric";
  }
  search(currentCity, unit);
}

function swapUnitFahrenheit() {
  if (unit === "metric") {
    unit = "imperial";
  }
  search(currentCity, unit);
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
let unit = "metric";
let city = null;
let cityName = null;
let currentCity = "Toronto";
let latitude = null;
let longitude = null;
let celsiusTemp = null;
let celsiusTempFeel = null;
let forecastElement = document.querySelector("#forecast");

search("Toronto", unit);
