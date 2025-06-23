/**
 * Configuration Module
 *
 * Contains application configuration constants like API keys and endpoints.
 * In a production environment, API keys should be secured on the server side.
 */

// OpenWeatherMap API configuration
// Get your own API key at https://openweathermap.org/api
export const API_KEY = "2ff3bc28465a836bdd80e8ae000e4a22";
// Current Weather Data
export const WEATHER_API_URL =
  "https://api.openweathermap.org/data/2.5/weather";
// 5 Day / 3 Hour Forecast
export const FORECAST_API_URL =
  "https://api.openweathermap.org/data/2.5/forecast";

// IP API configuration
export const IP_API_URL = "https://ipapi.co/json/";

// Application constants
export const DEFAULT_UNIT = "metric";
export const MAX_RECENT_SEARCHES = 5;
export const LANGUAGE = "ro";

// Local storage keys
export const STORAGE_KEYS = {
  TEMPERATURE_UNIT: "temperatureUnit",
  RECENT_SEARCHES: "recentSearches",
};
