# Weather Dashboard with Chatbot Integration

## Overview

This project is a comprehensive Weather Dashboard web application that allows users to view real-time weather information for any city using the OpenWeather API. The application features a 5-day weather forecast, data visualizations using Chart.js, a table with pagination, and a chatbot that responds to weather-related queries using the Gemini API.

The key components of the application include:
- **Current Weather Data**: Displays the current temperature, weather conditions, wind speed, humidity, and more for a user-selected city
- **5-Day Weather Forecast**: Provides weather forecasts, including temperatures and weather conditions, for the next five days
- **Interactive Charts**: Visualizes temperature trends and weather conditions with animated charts (Line Chart for temperature trends and Doughnut Chart for weather conditions)
- **Tables with Pagination**: Displays weather data in a paginated table format for easy navigation
- **Chatbot Integration**: A chatbot integrated with the Gemini API that answers weather-related queries based on user input
- **Geolocation Support**: Detects the user's location and shows the current weather for that location by default
- **Unit Conversion**: Allows users to toggle between Celsius and Fahrenheit for temperature display

This project showcases the use of modern web technologies such as HTML5, CSS3, JavaScript (ES6), Chart.js, and API integrations to provide a user-friendly and responsive interface.

## Features

### 1. Current Weather Information
Users can search for any city and get real-time weather data, including:
- Temperature (with the ability to toggle between Celsius and Fahrenheit)
- Weather conditions (clear sky, overcast, rain, etc.)
- Wind speed, humidity, and more

### 2. 5-Day Forecast
The app provides a detailed 5-day weather forecast for the selected city. Each day's forecast includes:
- Temperature (high and low)
- Weather conditions
- Date and time

### 3. Data Visualization
The application uses Chart.js to present weather data in the following charts:
- **Line Chart**: Displays temperature trends for the next 5 days
- **Doughnut Chart**: Shows the proportion of different weather conditions (sunny, rainy, cloudy, etc.) over the forecast period

### 4. Tables with Pagination
The app includes a table that displays the 5-day forecast data with pagination, allowing users to easily browse through the weather data.

### 5. Chatbot Integration
The chatbot is integrated with the Gemini API and responds to weather-related questions. It can:
- Recognize weather queries by detecting the keyword "weather" in user input
- Provide weather information for the queried city
- Deny non-weather-related questions politely, enhancing user interaction

### 6. Geolocation Support
Upon loading, the app uses the browser's Geolocation API to detect the user's current location and automatically display the weather for that location.

### 7. Unit Conversion Toggle
Users can switch between Celsius and Fahrenheit for temperature display, ensuring flexibility based on user preferences.

## Technologies Used
- HTML5: Structure and content of the application
- CSS3: Styling and layout, ensuring the application is fully responsive across different devices
- JavaScript (ES6+): Core functionality, including API integration, DOM manipulation, and user interaction handling
- OpenWeather API: Provides real-time weather data and forecasts
- Gemini API: Powers the chatbot to respond to weather-related queries
- Chart.js: Generates dynamic charts for data visualization
- Geolocation API: Automatically fetches weather data based on the user's location

## Project Structure
The project is organized into the following main files:
- `index.html`: The main HTML file that contains the structure of the weather dashboard
- `styles.css`: The stylesheet that defines the design and layout of the application
- `script.js`: The JavaScript file that handles API requests, processes weather data, and manages the chatbot
- `chart.js`: Manages the Chart.js integration for displaying weather trends and conditions

## Installation and Setup

### 1. Clone the Repository
First, clone the project repository to your local machine by running the following command in your terminal:

```bash
git clone https://github.com/Huzaifa-2669/WeatherWebApp/tree/main/WeatherApp
```

### 2. Open the Project Directory
Navigate to the project directory:

```bash
cd WeatherApp
```

### 3. Obtain API Keys

#### OpenWeather API Key
1. Visit OpenWeather and sign up for a free account
2. Go to the API Keys section in your dashboard and create a new API key
3. Copy the API key and replace the placeholder `your_api_key` in the `script.js` file with your actual key

#### Gemini API Key
1. Visit the Gemini AI and sign up for an account
2. Obtain your Gemini API Key and replace the placeholder `your_gemini_api_key` in the chatbot integration code

### 4. Running the Project Locally

#### Option 1: Using Live Server (VSCode Extension)
1. Install the Live Server extension in VSCode (if you don't have it already)
2. Right-click on the `index.html` file and select "Open with Live Server"
3. The project will open in your default browser

#### Option 2: Open HTML Directly in Browser
1. Open the `index.html` file from the project folder by double-clicking it or right-clicking and selecting "Open with → your browser"
2. The application will launch, and you can start using the weather dashboard

## How to Use the Application
- **Search for a City**: Enter the name of a city in the search bar and click the Get Weather button. The current weather and 5-day forecast will be displayed
- **Unit Conversion**: Use the dropdown to toggle between Celsius and Fahrenheit for temperature display
- **Pagination**: Use the table's pagination controls to navigate through the 5-day weather data
- **Chatbot**: Ask weather-related questions in the chatbot, such as "What's the weather in London?" The chatbot will fetch and display the relevant data
- **Geolocation**: If you allow location access, the app will automatically show weather data for your current location

## Error Handling
The app is designed to handle various errors, such as:
- Invalid city names (e.g., if the user enters an unrecognized city, it will display an error message)
- API request failures (e.g., network issues or rate limits from the OpenWeather API)
- Denied geolocation access (e.g., if the user blocks geolocation, the app will ask for a manual city search)

## Future Enhancements
Possible future improvements for the project include:
- **Enhanced Chatbot Capabilities**: Expanding the chatbot to handle more complex weather queries and provide more detailed weather insights
- **Improved Error Handling**: Implementing more advanced error handling and user feedback mechanisms
- **Performance Optimization**: Further optimizing API calls and caching mechanisms to improve the performance of the application

## Conclusion
This Weather Dashboard provides a feature-rich interface for users to explore current and forecasted weather data, integrated with chatbot functionality for an interactive experience. The use of multiple APIs (OpenWeather and Gemini) alongside data visualizations ensures a smooth and informative user experience.

For more details, visit the project on GitHub: [Weather Dashboard Web App](https://github.com/Huzaifa-2669/WeatherWebApp/tree/main/WeatherApp)
