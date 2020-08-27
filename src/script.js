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
