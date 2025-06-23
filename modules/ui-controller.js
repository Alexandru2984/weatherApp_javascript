/**
 * UI Module
 *
 * Manages the application's user interface components and interactions.
 * Responsible for rendering the weather information and handling UI events.
 */

import * as utils from "./utils.js";
import * as weather from "./weather.js";

// Cache DOM elements for better performance
const elements = {
  // Main containers
  weatherInfo: document.querySelector("#weather-info"),
  errorMessage: document.querySelector("#error-message"),
  loadingSpinner: document.querySelector("#loading-spinner"),
  recentSearchesContainer: document.querySelector("#recent-searches"),
  recentList: document.querySelector("#recent-list"),

  // Weather information elements
  cityName: document.querySelector("#city-name"),
  dateTime: document.querySelector("#date-time"),
  temperature: document.querySelector("#temperature"),
  description: document.querySelector("#description"),
  humidity: document.querySelector("#humidity"),
  windSpeed: document.querySelector("#wind-speed"),
  weatherIcon: document.querySelector("#weather-icon"),
  feelsLike: document.querySelector("#feels-like"),
  pressure: document.querySelector("#pressure"),
  sunrise: document.querySelector("#sunrise"),
  sunset: document.querySelector("#sunset"),

  // Temperature visualization elements
  tempRange: document.querySelector("#temp-range"),
  tempIndicator: document.querySelector("#temp-indicator"),
  tempMin: document.querySelector("#temp-min"),
  tempMax: document.querySelector("#temp-max"),
  tempCurrentLabel: document.querySelector("#temp-current-label"),
};

/**
 * Show loading spinner
 */
export function showLoading() {
  elements.loadingSpinner.classList.remove("hidden");
}

/**
 * Hide loading spinner
 */
export function hideLoading() {
  elements.loadingSpinner.classList.add("hidden");
}

/**
 * Show error message
 *
 * @param {string} message - Error message to display
 */
export function showError(message) {
  elements.errorMessage.textContent = message;
  elements.errorMessage.classList.remove("hidden");
  elements.weatherInfo.classList.add("hidden");
}

/**
 * Hide error message
 */
export function hideError() {
  elements.errorMessage.classList.add("hidden");
}

/**
 * Update temperature visualization display
 *
 * @param {Object} visualization - Temperature visualization data
 * @param {string} unit - Temperature unit (C/F)
 */
export function updateTemperatureVisualization(visualization) {
  if (!visualization) return;

  // Update min/max labels
  elements.tempMin.textContent = `${visualization.minTemp}°`;
  elements.tempMax.textContent = `${visualization.maxTemp}°`;

  // Update current temperature label
  elements.tempCurrentLabel.textContent = `${visualization.currentTemp}°`;

  // Update indicator position and color
  elements.tempIndicator.style.left = `${visualization.position}%`;
}

/**
 * Display weather data in the UI
 *
 * @param {Object} weatherData - Current weather data
 * @param {Object} forecastData - Forecast data
 */
export function displayWeatherData(weatherData, forecastData) {
  elements.weatherInfo.classList.remove("hidden");

  // Update city information
  elements.cityName.textContent = weatherData.name;

  // Update date and time
  elements.dateTime.textContent = utils.formatDateTime(weatherData.timezone);

  // Update sunrise and sunset times
  elements.sunrise.textContent = utils.formatTime(weatherData.sys.sunrise);
  elements.sunset.textContent = utils.formatTime(weatherData.sys.sunset);

  // Update temperature information
  const currentTemp = weatherData.main.temp;
  elements.temperature.textContent = Math.round(currentTemp);
  elements.feelsLike.textContent = Math.round(weatherData.main.feels_like);

  // Update weather description
  elements.description.textContent = weatherData.weather[0].description;

  // Update additional weather details
  elements.humidity.textContent = weatherData.main.humidity;
  elements.pressure.textContent = weatherData.main.pressure;
  elements.windSpeed.textContent = weatherData.wind.speed;

  // Update weather icon
  const iconUrl = weather.getWeatherIconUrl(weatherData.weather[0].icon);
  elements.weatherIcon.src = iconUrl;
  elements.weatherIcon.alt = weatherData.weather[0].description;

  // Get temperature range for visualization
  const tempRange = weather.getDailyTemperatureRange(forecastData);

  let minTemp, maxTemp;
  if (tempRange) {
    minTemp = tempRange.min;
    maxTemp = tempRange.max;
  } else {
    // Fallback to current weather data
    minTemp = weatherData.main.temp_min;
    maxTemp = weatherData.main.temp_max;
  }

  // Calculate and update temperature visualization
  const visualization = weather.calculateTemperatureVisualization(
    currentTemp,
    minTemp,
    maxTemp
  );

  updateTemperatureVisualization(visualization);
}

/**
 * Update the recent searches list in the UI
 *
 * @param {Array} recentSearches - List of recent searches
 * @param {Function} displayWeather - Callback for when a city is clicked
 */
export function updateRecentSearchesList(recentSearches, displayWeather) {
  if (recentSearches.length === 0) {
    elements.recentSearchesContainer.classList.add("hidden");
    return;
  }

  // Clear current list
  elements.recentList.innerHTML = "";

  // Add each recent search
  recentSearches.forEach((city) => {
    const li = document.createElement("li");
    li.className = "tag-item";
    li.textContent = city;

    // Add event listeners
    li.addEventListener("click", () => displayWeather({ city }));

    // Add to the list
    elements.recentList.appendChild(li);
  });

  elements.recentSearchesContainer.classList.remove("hidden");
}
