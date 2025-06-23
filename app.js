/**
 * Weather Application
 *
 * Main application file that coordinates all the modules and manages app state.
 * This file handles initialization, event listeners, and application flow.
 */

import * as config from "./config.js";
import * as api from "./modules/api.js";
import * as ui from "./modules/ui.js";
import * as utils from "./modules/utils.js";

// Application state
let units = config.DEFAULT_UNIT;
let recentSearches = [];

// DOM elements cache
const elements = {
  searchForm: document.querySelector("#search-form"),
  getLocationButton: document.querySelector("#get-location"),
  tempToggle: document.querySelector("#temp-toggle"),
};

// Initialize the app
initTemperatureUnit();
initRecentSearchesList();
displayInitialWeather();
setupEventListeners();

// Function declarations
/**
 * Initialize the temperature unit from localStorage
 */
function initTemperatureUnit() {
  const storedUnit = localStorage.getItem(config.STORAGE_KEYS.TEMPERATURE_UNIT);
  units = storedUnit || config.DEFAULT_UNIT;
  elements.tempToggle.checked = units === "imperial";
}

/**
 * Initialize the recent searches list from localStorage
 */
function initRecentSearchesList() {
  const storedSearches = localStorage.getItem(
    config.STORAGE_KEYS.RECENT_SEARCHES
  );
  recentSearches = storedSearches ? JSON.parse(storedSearches) : [];
  ui.updateRecentSearchesList(recentSearches, displayWeather);
}

/**
 * Get initial weather data using a fallback strategy:
 * 1. Try recent searches first
 * 2. Try browser geolocation API
 * 3. Try IP-based geolocation
 * 4. Silently fail if all methods fail
 */
async function displayInitialWeather() {
  // Try to use recent searches if available
  if (recentSearches.length > 0) {
    const city = recentSearches[0];
    console.log(`Using most recent search: ${city}`);
    displayWeather({ city });
    return;
  }

  console.log("No recent searches found, trying geolocation...");

  // Try browser geolocation
  try {
    const { lat, lon } = await utils.getUserLocation();
    console.log(`Geolocation successful: ${lat}, ${lon}`);
    displayWeather({ lat, lon });
    return;
  } catch (error) {
    console.log("Geolocation failed, trying IP-based location...");
  }

  // Try IP-based geolocation as fallback
  try {
    const { lat, lon } = await api.fetchLocationByIP();
    console.log(`IP location successful: ${lat}, ${lon}`);
    displayWeather({ lat, lon });
    return;
  } catch (error) {
    console.log("IP-based location failed, no weather data shown");
  }

  // If all methods fail, we just show the empty interface
  console.log("All location methods failed. Showing empty interface.");
}

function addToRecentSearches(cityName) {
  // Check if city is already in recent searches
  const index = recentSearches.indexOf(cityName);
  if (index !== -1) {
    // Remove it from current position
    recentSearches.splice(index, 1);
  }

  // Add to beginning of array
  recentSearches.unshift(cityName);

  // Keep only the most recent searches
  if (recentSearches.length > config.MAX_RECENT_SEARCHES) {
    recentSearches.pop();
  }

  // Save to localStorage
  localStorage.setItem(
    config.STORAGE_KEYS.RECENT_SEARCHES,
    JSON.stringify(recentSearches)
  );

  // Update the UI
  ui.updateRecentSearchesList(recentSearches, displayWeather);
}

async function displayWeather({ city, lat, lon }) {
  try {
    ui.showLoading();
    ui.hideError();

    // Fetch weather and forecast data by city name or coordinates
    const data = await api.fetchWeatherAndForecast({
      city,
      lat,
      lon,
      units,
    });

    ui.displayWeatherData(data.weather, data.forecast);
    addToRecentSearches(data.weather.name);
  } catch (error) {
    ui.showError(
      "Nu am putut obține datele meteo. Verificați numele orașului și încercați din nou."
    );
    console.error("Error fetching weather data:", error);
  } finally {
    ui.hideLoading();
  }
}

function setupEventListeners() {
  elements.searchForm.addEventListener("submit", handleWeatherSearch);
  elements.getLocationButton.addEventListener("click", handleLocationRequest);
  elements.tempToggle.addEventListener("change", handleUnitChange);
}

function handleWeatherSearch(event) {
  event.preventDefault();
  const city = new FormData(event.target).get("city");

  if (!city) {
    ui.showError("Vă rugăm să introduceți numele unui oraș");
    return;
  }

  displayWeather({ city });
}

async function handleLocationRequest() {
  try {
    const { lat, lon } = await utils.getUserLocation();
    displayWeather({ lat, lon });
  } catch (error) {
    ui.showError(
      "Nu am putut obține locația dvs. Vă rugăm să căutați manual un oraș."
    );
  }
}

function handleUnitChange() {
  units = elements.tempToggle.checked ? "imperial" : "metric";
  localStorage.setItem(config.STORAGE_KEYS.TEMPERATURE_UNIT, units);

  displayInitialWeather();
}
