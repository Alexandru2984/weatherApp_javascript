/**
 * API Module
 *
 * Handles all external API interactions for the weather application.
 * Abstracts the fetching logic and error handling.
 */

import {
    API_KEY,
    WEATHER_API_URL,
    FORECAST_API_URL,
    LANGUAGE,
    IP_API_URL,
  } from "../config.js";
  
  /**
   * Generic fetch function with error handling
   *
   * @param {string} url - The URL to fetch data from
   * @returns {Promise<Object>} - JSON response data
   * @throws {Error} - If the fetch fails or response is not OK
   */
  async function fetchData(url) {
    const response = await fetch(url);
  
    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(
        `Error fetching data for url: ${url}, with response ${errorResponse}`
      );
    }
  
    return await response.json();
  }
  
  /**
   * Create a weather API URL based on parameters
   *
   * @param {string} baseUrl - Base API URL
   * @param {Object} params - Query parameters
   * @returns {string} - Complete API URL
   */
  function createApiUrl(baseUrl, params) {
    const url = new URL(baseUrl);
  
    if (params.city) {
      url.searchParams.append("q", params.city);
    }
  
    if (params.lat && params.lon) {
      url.searchParams.append("lat", params.lat);
      url.searchParams.append("lon", params.lon);
    }
  
    url.searchParams.append("appid", API_KEY);
    url.searchParams.append("units", params.units);
    url.searchParams.append("lang", LANGUAGE);
  
    return url.toString();
  }
  
  /**
   * Fetch current weather and forecast data for a city
   *
   * @param {string} city - City name to get forecast for
   * @param {string} lat - Latitude
   * @param {string} lon - Longitude
   * @param {string} units - Temperature unit
   * @returns {Promise<Object>} - Forecast data object
   */
  export async function fetchWeatherAndForecast({ city, lat, lon, units }) {
    const weatherUrl = createApiUrl(WEATHER_API_URL, { city, lat, lon, units });
    const weather = await fetchData(weatherUrl);
  
    const forecastUrl = createApiUrl(FORECAST_API_URL, { city, lat, lon, units });
    const forecast = await fetchData(forecastUrl);
  
    return { weather, forecast };
  }
  /**
   * Get user's location by IP address
   *
   * @returns {Promise<Object>} - Object containing latitude and longitude
   */
  export async function fetchLocationByIP() {
    try {
      const { latitude, longitude } = await fetchData(IP_API_URL);
      return { lat: latitude, lon: longitude };
    } catch (error) {
      throw new Error("Nu am putut determina locația după IP");
    }
  }
  