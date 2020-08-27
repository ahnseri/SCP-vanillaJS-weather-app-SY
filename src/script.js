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

//get and display current weather
function getLocationInfo(response) {
  cityName = response.data.name;
  latitude = response.data.coord.lat;
  longitude = response.data.coord.lon;
  return response;
}

function getWeatherInfo(response) {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/onecall?";
  let apiUrl = `${apiEndpoint}lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}&exclude=minutely,hourly`;
  axios.get(apiUrl).then(showTodayWeather);
}

function showTodayWeather(response) {
  console.log(response.data);
  document.querySelector("#city").innerHTML = cityName;

  celsiusTemp = response.data.current.temp;
  document.querySelector("#temperature").innerHTML = Math.round(celsiusTemp);

  document.querySelector("#weather-des").innerHTML =
    response.data.current.weather[0].description;

  celsiusTempFeel = response.data.current.feels_like;
  document.querySelector("#feels-like").innerHTML = Math.round(celsiusTempFeel);

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
  return response;
}

function search(city) {
  if (city) {
    let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?q=";
    let apiUrl = `${apiEndpoint}${city}&units=${units}&appid=${apiKey}`;
    axios.get(apiUrl).then(getLocationInfo).then(getWeatherInfo);
  } else {
    alert(`Please enter a city`);
  }
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-city");
  search(city.value);
  city.value = "";
}

//user action
let changeCityForm = document.querySelector("#search-form");
changeCityForm.addEventListener("submit", handleSubmit);

//global variables
let apiKey = "264d058cf40518d3759e3102bcc572cf";
let units = "metric";
let city = null;
let latitude = null;
let longitude = null;
let celsiusTemp = null;
let celsiusTempFeel = null;

search("Toronto");
