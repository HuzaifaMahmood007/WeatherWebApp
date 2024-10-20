// OpenWeather API key
const API_KEY = "1f5e999001d9b2cf796708245ae9ab3b";

// Chart objects
let temperatureChart, weatherConditionsChart, temperatureLineChart;

// Variable to store forecast data
let storedForecastData = [];

// Initial call to set up the page
getLocationAndWeather();

// Event listeners
document.getElementById("get-weather").addEventListener("click", getWeather);
document.getElementById("unit").addEventListener("change", getWeather);
document
  .getElementById("sort-asc")
  .addEventListener("click", () => sortForecast("asc"));
document
  .getElementById("sort-desc")
  .addEventListener("click", () => sortForecast("desc"));
document
  .getElementById("filter-rain")
  .addEventListener("click", filterRainyDays);
document
  .getElementById("highest-temp")
  .addEventListener("click", findHighestTempDay);

// Main weather fetching function
function getWeather() {
  const city = document.getElementById("city").value;
  const unit = document.getElementById("unit").value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`;

  showSpinner();

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      hideSpinner();
      if (data.cod === "404") {
        document.getElementById(
          "weather-data"
        ).innerHTML = `<p>City not found. Please try again.</p>`;
        return;
      }
      displayWeather(data, unit);
      getFiveDayForecast(city, unit);
    })
    .catch((error) => {
      hideSpinner();
      document.getElementById(
        "weather-data"
      ).innerHTML = `<p>Error fetching weather data. Please try again.</p>`;
      console.log("Error:", error);
    });
}

// Display current weather
function displayWeather(data, unit) {
  const tempUnit = unit === "metric" ? "°C" : "°F";
  const weatherInfo = `
        <h2>Weather in ${data.name}</h2>
        <p><strong>Temperature:</strong> ${data.main.temp}${tempUnit}</p>
        <p><strong>Feels Like:</strong> ${data.main.feels_like}${tempUnit}</p>
        <p><strong>Weather:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;
  document.getElementById("weather-data").innerHTML = weatherInfo;
  setBackgroundBasedOnWeather(data.weather[0].main);
}

// Set background based on weather
function setBackgroundBasedOnWeather(weatherMain) {
  const widget = document.getElementById("weather-widget");
  widget.className = "weather-widget"; // Reset classes
  switch (weatherMain.toLowerCase()) {
    case "clear":
      widget.classList.add("clear-sky");
      break;
    case "clouds":
      widget.classList.add("few-clouds");
      break;
    case "rain":
      widget.classList.add("rain");
      break;
    case "drizzle":
      widget.classList.add("shower-rain");
      break;
    case "thunderstorm":
      widget.classList.add("thunderstorm");
      break;
    case "snow":
      widget.classList.add("snow");
      break;
    case "mist":
    case "fog":
      widget.classList.add("mist");
      break;
    default:
      widget.classList.add("few-clouds");
  }
}

// Fetch 5-day forecast
function getFiveDayForecast(city, unit) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${unit}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      storedForecastData = data.list; // Store forecast data
      displayForecast(data, unit);
      updateCharts(data, unit);
    })
    .catch((error) => {
      console.log("Error fetching forecast:", error);
    });
}

// Display 5-day forecast
function displayForecast(data, unit) {
  const forecastGrid = document.getElementById("forecast-grid");
  forecastGrid.innerHTML = "";
  const tempUnit = unit === "metric" ? "°C" : "°F";

  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt * 1000).toLocaleDateString();
    const temp = forecast.main.temp;
    const weatherDescription = forecast.weather[0].description;
    const weatherIcon = forecast.weather[0].icon;

    const forecastItem = `
            <div>
                <h4>${date}</h4>
                <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather icon">
                <p><strong>${temp}${tempUnit}</strong></p>
                <p>${weatherDescription}</p>
            </div>
        `;
    forecastGrid.innerHTML += forecastItem;
  }
}

// Update charts
function updateCharts(data, unit) {
  const temperatures = [];
  const dates = [];
  const weatherConditions = {};

  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    temperatures.push(forecast.main.temp);
    dates.push(new Date(forecast.dt * 1000).toLocaleDateString());

    const condition = forecast.weather[0].main;
    weatherConditions[condition] = (weatherConditions[condition] || 0) + 1;
  }

  updateTemperatureBarChart(dates, temperatures, unit);
  updateWeatherConditionsDoughnutChart(weatherConditions);
  updateTemperatureLineChart(dates, temperatures, unit);
}

// Temperature Bar Chart
function updateTemperatureBarChart(dates, temperatures, unit) {
  const ctx = document.getElementById("temperatureChart").getContext("2d");

  if (temperatureChart) {
    temperatureChart.destroy();
  }

  temperatureChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dates,
      datasets: [
        {
          label: `Temperature (${unit === "metric" ? "°C" : "°F"})`,
          data: temperatures,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
      animation: {
        delay: (context) => {
          let delay = 0;
          if (context.type === "data" && context.mode === "default") {
            delay = context.dataIndex * 300 + context.datasetIndex * 100;
          }
          return delay;
        },
      },
    },
  });
}

// Weather Conditions Doughnut Chart
function updateWeatherConditionsDoughnutChart(weatherConditions) {
  const ctx = document
    .getElementById("weatherConditionsChart")
    .getContext("2d");

  if (weatherConditionsChart) {
    weatherConditionsChart.destroy();
  }

  const labels = Object.keys(weatherConditions);
  const data = Object.values(weatherConditions);

  weatherConditionsChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Weather Conditions Distribution",
        },
      },
      animation: {
        delay: (context) => {
          let delay = 0;
          if (context.type === "data" && context.mode === "default") {
            delay = context.dataIndex * 300;
          }
          return delay;
        },
      },
    },
  });
}

// Temperature Line Chart
function updateTemperatureLineChart(dates, temperatures, unit) {
  const ctx = document.getElementById("temperatureLineChart").getContext("2d");

  if (temperatureLineChart) {
    temperatureLineChart.destroy();
  }

  temperatureLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: `Temperature (${unit === "metric" ? "°C" : "°F"})`,
          data: temperatures,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
      animation: {
        y: {
          duration: 2000,
          from: 500,
        },
      },
    },
  });
}

// Sort forecast
function sortForecast(order) {
  const sortedForecast = [...storedForecastData].sort((a, b) => {
    const tempA = a.main.temp;
    const tempB = b.main.temp;
    return order === "asc" ? tempA - tempB : tempB - tempA;
  });
  displayForecast(
    { list: sortedForecast },
    document.getElementById("unit").value
  );
}

// Filter rainy days
function filterRainyDays() {
  const rainyDays = storedForecastData.filter((forecast) =>
    forecast.weather[0].description.toLowerCase().includes("rain")
  );
  displayForecast({ list: rainyDays }, document.getElementById("unit").value);
  if (rainyDays.length === 0) {
    document.getElementById("forecast-grid").innerHTML =
      "<p>No rainy days found in the forecast.</p>";
  }
}

// Find highest temperature day
function findHighestTempDay() {
  const highestTempDay = storedForecastData.reduce((max, forecast) => {
    return forecast.main.temp > max.main.temp ? forecast : max;
  });
  displayForecast(
    { list: [highestTempDay] },
    document.getElementById("unit").value
  );
}

// Spinner functions
function showSpinner() {
  const spinner = document.createElement("div");
  spinner.className = "spinner";
  document.getElementById("weather-data").appendChild(spinner);
}

function hideSpinner() {
  const spinner = document.querySelector(".spinner");
  if (spinner) {
    spinner.remove();
  }
}

// Get location from browser and display weather and forecast
function getLocationAndWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const unit = document.getElementById("unit").value;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;

        showSpinner();

        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            hideSpinner();
            if (data.cod === "404") {
              document.getElementById(
                "weather-data"
              ).innerHTML = `<p>Location not found. Please try again.</p>`;
              return;
            }
            displayWeather(data, unit);
            getFiveDayForecastByCoords(lat, lon, unit);
          })
          .catch((error) => {
            hideSpinner();
            document.getElementById(
              "weather-data"
            ).innerHTML = `<p>Error fetching weather data. Please try again.</p>`;
            console.log("Error:", error);
          });
      },
      (error) => {
        console.log("Geolocation error:", error);
        document.getElementById(
          "weather-data"
        ).innerHTML = `<p>Unable to retrieve your location. Please try again.</p>`;
      }
    );
  } else {
    document.getElementById(
      "weather-data"
    ).innerHTML = `<p>Geolocation is not supported by this browser.</p>`;
  }
}

// Fetch 5-day forecast by coordinates
function getFiveDayForecastByCoords(lat, lon, unit) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      storedForecastData = data.list; // Store forecast data
      displayForecast(data, unit);
      updateCharts(data, unit);
    })
    .catch((error) => {
      console.log("Error fetching forecast:", error);
    });
}
