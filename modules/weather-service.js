/**
 * Weather Module
 *
 * Handles weather data processing, calculations, and transformations.
 * Contains algorithms for analyzing weather data.
 */

/**
 * Extract the daily temperature range from forecast data
 *
 * @param {Object} forecastData - Forecast data from API
 * @returns {Object|null} - Object with min and max temperatures or null
 */
export function getDailyTemperatureRange(forecastData) {
    // Safety check for data
    if (!forecastData.list.length) {
      return null;
    }
  
    // Take first 8 forecasts (24 hours)
    const relevantForecasts = forecastData.list.slice(0, 8);
  
    // Find min and max temperatures
    let min = Infinity;
    let max = -Infinity;
  
    relevantForecasts.forEach((item) => {
      if (item.main.temp < min) min = item.main.temp;
      if (item.main.temp > max) max = item.main.temp;
    });
  
    return { min, max };
  }
  
  /**
   * Calculate the temperature indicator position and styling
   *
   * @param {number} currentTemp - Current temperature
   * @param {number} minTemp - Minimum temperature
   * @param {number} maxTemp - Maximum temperature
   * @returns {Object} - Object with calculated values for visualization
   */
  export function calculateTemperatureVisualization(
    currentTemp,
    minTemp,
    maxTemp
  ) {
    // Return early if we have invalid inputs
    if (minTemp == null || maxTemp == null || currentTemp == null) {
      return null;
    }
  
    // Ensure current temperature is within the range
    if (currentTemp < minTemp) {
      minTemp = currentTemp;
    }
    if (currentTemp > maxTemp) {
      maxTemp = currentTemp;
    }
  
    // Round values for display
    minTemp = Math.round(minTemp);
    maxTemp = Math.round(maxTemp);
    currentTemp = Math.round(currentTemp);
  
    // Calculate position percentage for current temperature
    let position = 50; // Start in the middle
  
    if (maxTemp !== minTemp) {
      position = ((currentTemp - minTemp) / (maxTemp - minTemp)) * 100;
    }
  
    // Make sure indicator stays within visible range
    position = Math.max(5, Math.min(95, position));
  
    return { minTemp, maxTemp, currentTemp, position };
  }
  
  /**
   * Get weather icon URL based on icon code
   *
   * @param {string} iconCode - OpenWeatherMap icon code
   * @param {number} size - Icon size (1, 2, or 4)
   * @returns {string} - URL to the weather icon
   */
  export function getWeatherIconUrl(iconCode, size = 4) {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}x.png`;
  }
  