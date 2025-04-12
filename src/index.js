const apiKey = "OWIxZWI3ZjZiMGR0YTNjYTM0YTY0MDU3NDdlODg1bzE=";
    

    function search(event) {
      try {
        event.preventDefault();
      } catch (err) {}
      const userValue = document.querySelector("form input.search-input").value.trim();

      if (!userValue.length) return;
      const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${userValue}&key=${atob(
        apiKey
      )}&units=metric`;
      axios
        .get(apiUrl)
        .then((res) => {
          const { status, temperature, city, condition, wind } = res.data;
          if (status === "not_found") {
            return alert("City not found, please try another city.");
          }

          document.querySelector("#current-city").textContent = city;
          document.querySelector(".current-temperature-value").textContent =
            Math.round(temperature.current);
          document.querySelector("img.current-temperature-icon").src = condition.icon_url;
          document.querySelector(
            "p.current-details"
          ).innerHTML = `<span id="current-date">${formatDate(
            new Date(res.data.time * 1000)
          )}</span>, ${condition.description} <br/>Humidity: <strong>${
            temperature.humidity
          }%</strong>, Wind: <strong>${wind.speed} km/h</strong>`;
          
          getForecast(city);
          document.querySelector("form input.search-input").value=""
        })
        .catch((error) => {
          console.error("Error fetching the weather data:", error);
          alert("Unable to fetch weather data. Please try again.");
        });
        
    }

   
    
    function formatDate(date) {
      let minutes = date.getMinutes()
      let hours = date.getHours()
      let day = date.getDay()

      if (minutes < 10) {
        minutes = `0${minutes}`;
      }

      if (hours < 10) {
        hours = `0${hours}`;
      }

      let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      let formattedDay = days[day];
      return `${formattedDay} ${hours}:${minutes}`;
    }
    
    function formatDay(timestamp) {
       let date = new Date(timestamp * 1000);
       let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

       return days[date.getDay()];
    }
    
    function getForecast(city){
      const apiUrl=`https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${atob(
        apiKey)}&units=metric`;
      axios(apiUrl).then(displayForecast).catch((error) => {
    console.error("Error fetching forecast data:", error);
});
}
    
    function displayForecast(res) {
    let forecastHtml="";
    res.data.daily.forEach(function(day, index){
      if(index<5) {
      forecastHtml= forecastHtml +
      `
    <div class="weather-forecast-day">
    <div class="weather-forecast-date">${formatDay(day.time)}</div>

    <img src="${day.condition.icon_url}" class="weather-forecast-icon"/>
    <div class="weather-forecast-temperatures">
    <div class="weather-forecast-temperature"><strong>${Math.round(day.temperature.maximum)}º</strong></div>
    <div class="weather-forecast-temperature">${Math.round(day.temperature.minimum)}º</div>
  </div>
  </div>`;
      }
    });
    
    let forecastElement = document.querySelector("#forecast")
      forecastElement.innerHTML = forecastHtml;
    }
    
    document.addEventListener("DOMContentLoaded", function() {
      document.querySelector("#search-form").addEventListener("submit", search);
      let currentDateELement = document.querySelector("#current-date"), 
      currentDate = new Date();

    currentDateELement.innerHTML = formatDate(currentDate);
      document.querySelector("form input.search-input").value = "Paris";
      search({});
    });
