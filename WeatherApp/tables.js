const API_KEY = "";
const GEMINI_API_KEY = ""; // Replace with your actual Gemini API key

let forecastData = [];
let currentPage = 1;
const itemsPerPage = 10;

document.getElementById("get-weather").addEventListener("click", getForecast);
document.getElementById("unit").addEventListener("change", getForecast);
document
  .getElementById("prev-page")
  .addEventListener("click", () => changePage(-1));
document
  .getElementById("next-page")
  .addEventListener("click", () => changePage(1));
document.getElementById("send-message").addEventListener("click", sendMessage);

function getForecast() {
  const city = document.getElementById("city").value;
  const unit = document.getElementById("unit").value;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${unit}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      forecastData = data.list;
      currentPage = 1;
      displayForecastTable();
    })
    .catch((error) => {
      console.log("Error fetching forecast:", error);
    });
}

function displayForecastTable() {
  const tableBody = document.querySelector("#forecast-table tbody");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = forecastData.slice(startIndex, endIndex);

  pageData.forEach((item) => {
    const row = document.createElement("tr");
    const date = new Date(item.dt * 1000);
    row.innerHTML = `
        <td>${date.toLocaleDateString()}</td>
        <td>${date.toLocaleTimeString()}</td>
        <td>${item.main.temp}${
      document.getElementById("unit").value === "metric" ? "°C" : "°F"
    }</td>
        <td>${item.weather[0].description
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}</td>
      `;
    tableBody.appendChild(row);
  });

  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(forecastData.length / itemsPerPage);
  document.getElementById(
    "page-info"
  ).textContent = `Page ${currentPage} of ${totalPages}`;
  document.getElementById("prev-page").disabled = currentPage === 1;
  document.getElementById("next-page").disabled = currentPage === totalPages;
}

function changePage(direction) {
  currentPage += direction;
  displayForecastTable();
}

async function sendMessage() {
  const userInput = document.getElementById("user-input").value;
  if (userInput.trim() === "") {
    return;
  }
  const chatMessages = document.getElementById("chat-messages");

  // Display user message
  chatMessages.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;

  let response;
  if (userInput.toLowerCase().includes("weather")) {
    // Handle weather-related query
    response = await getWeatherResponse(userInput);
  } else {
    // Use Gemini API for non-weather queries
    response = await getGeminiResponse(userInput);
  }

  // Display chatbot response
  chatMessages.innerHTML += `<p><strong>Chatbot:</strong> ${response}</p>`;

  // Clear input field
  document.getElementById("user-input").value = "";

  // Scroll to bottom of chat
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function getWeatherResponse(query) {
  // Extract city name from query (this is a simple example and might need improvement)
  const cityMatch = query.match(/in\s+([a-zA-Z\s]+)/i);
  const city = cityMatch ? cityMatch[1].trim() : "";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    return `The current weather in ${data.name} is ${data.weather[0].description} with a temperature of ${data.main.temp}°C.`;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return "I'm sorry, I couldn't fetch the weather information at the moment.";
  }
}

async function getGeminiResponse(query) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY, // Changed from "Authorization" to "x-goog-api-key"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: query,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if the expected data structure exists
    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0]
    ) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Unexpected response structure from Gemini API");
    }
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    return (
      "I'm sorry, I couldn't process your request at the moment. Error: " +
      error.message
    );
  }
}

document.getElementById("close-chatbot").addEventListener("click", () => {
  document.querySelector(".chatbot-container").classList.add("minimized");
  document.getElementById("open-chatbot").classList.remove("hidden");
});

document.getElementById("open-chatbot").addEventListener("click", () => {
  document.querySelector(".chatbot-container").classList.remove("minimized");
  document.getElementById("open-chatbot").classList.add("hidden");
});

// Initial call to set up the page
getForecast();
