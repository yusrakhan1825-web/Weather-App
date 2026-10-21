
"use strict";

// 1. HTML elements select karna
var searchForm = document.querySelector("#searchForm");
var cityInput = document.querySelector("#cityInput");
var message = document.querySelector("#message");
var weatherResult = document.querySelector("#weatherResult");

var cityName = document.querySelector("#cityName");
var weatherDescription = document.querySelector("#weatherDescription");
var weatherIcon = document.querySelector("#weatherIcon");
var temperature = document.querySelector("#temperature");
var humidity = document.querySelector("#humidity");
var windSpeed = document.querySelector("#windSpeed");


// 2. Weather code ko text aur icon mein convert karna
function getWeatherInfo(code) {

    if (code === 0) {
        return { text: "Clear sky", icon: "☀️" };
    } else if (code === 1 || code === 2) {
        return { text: "Mostly clear", icon: "🌤️" };
    } else if (code === 3) {
        return { text: "Cloudy", icon: "☁️" };
    } else if ([45, 48].includes(code)) {
        return { text: "Foggy", icon: "🌫️" };
    } else if ([51, 53, 55, 56, 57].includes(code)) {
        return { text: "Drizzle", icon: "🌦️" };
    } else if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        return { text: "Rainy", icon: "🌧️" };
    } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return { text: "Snowy", icon: "❄️" };
    } else if ([95, 96, 99].includes(code)) {
        return { text: "Thunderstorm", icon: "⛈️" };
    }

    return { text: "Weather information", icon: "🌈" };
}


// 3. Weather data fetch karna
async function getWeather(city) {

    try {
        message.textContent = "Finding your sunshine... ☀️";
        weatherResult.hidden = true;

        // City ka naam coordinates mein convert karna
        var geoURL =
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(city) +
            "&count=1&language=en&format=json";

        var geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Could not find the city.");
        }

        var geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please check the spelling!");
        }

        var place = geoData.results[0];

        // Coordinates se current weather lena
        var weatherURL =
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=" + place.latitude +
            "&longitude=" + place.longitude +
            "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m" +
            "&temperature_unit=celsius" +
            "&wind_speed_unit=kmh";

        var weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Weather data could not be loaded.");
        }

        var weatherData = await weatherResponse.json();

        // API response se current data lena
        var current = weatherData.current;
        var info = getWeatherInfo(current.weather_code);

        // HTML par data show karna
        cityName.textContent =
            place.name + (place.country ? ", " + place.country : "");

        weatherDescription.textContent = info.text;
        weatherIcon.textContent = info.icon;
        temperature.textContent =
            Math.round(current.temperature_2m) + "°C";

        humidity.textContent =
            current.relative_humidity_2m + "%";

        windSpeed.textContent =
            current.wind_speed_10m + " km/h";

        weatherResult.hidden = false;
        message.textContent = "Here's your city's weather! 🌈";

    } catch (error) {
        message.textContent = error.message ||
            "Something went wrong. Please try again.";

        weatherResult.hidden = true;
        console.error("Weather error:", error);
    }
}


// 4. Search form ka event
searchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    var city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name! 💛";
        weatherResult.hidden = true;
        return;
    }

    getWeather(city);
});
