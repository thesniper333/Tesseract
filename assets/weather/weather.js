// Weather Widget Using Open-Meteo API

// Function to fetch and update weather data
document.addEventListener("DOMContentLoaded", function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherData(lat, lon);
            fetchLocation(lat, lon);
            fetchHourlyForecast(lat, lon);
            fetchWeeklyForecast(lat, lon);
        }, error => {
            console.error("Geolocation error: ", error);
            displayWeather("--", "Unknown", "--", "--", "--", "--");
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        displayWeather("--", "Unknown", "--", "--", "--", "--");
    }
});


// Fetch city name from coordinates using Nominatim (OpenStreetMap)
function fetchLocation(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.display_name) {
                const locationParts = data.display_name.split(", ");
                const shortLocation = locationParts[0]; // Take only first part
                document.getElementById("location").textContent = shortLocation;
            } else {
                document.getElementById("location").textContent = "Unknown Location";
            }
        })
        .catch(error => {
            console.error("Location API error: ", error);
            document.getElementById("location").textContent = "Unknown Location";
        });
}

function fetchWeatherData(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=apparent_temperature,relative_humidity_2m&timezone=auto`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.current_weather) {
                throw new Error("Invalid API response");
            }

            const temp = data.current_weather.temperature + "°C" + getWeatherIcon(data.current_weather.weathercode);
            const conditions = getWeatherDescription(data.current_weather.weathercode);

            // Extract first hourly data (closest to current time)
            const feelsLike = data.hourly.apparent_temperature ? data.hourly.apparent_temperature[0] + "°C" : "--";
            const humidity = data.hourly.relative_humidity_2m ? data.hourly.relative_humidity_2m[0] + "%" : "--";

            displayWeather(temp, conditions, "Fetching AQI...", humidity, feelsLike);

            // Fetch air quality separately
            fetchAirQuality(lat, lon);
        })
        .catch(error => {
            console.error("Weather API error: ", error);
            displayWeather("--", "Unknown", "--", "--", "--", "--");
        });
}

function fetchAirQuality(lat, lon) {
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10&timezone=auto`;

    fetch(aqiUrl)
        .then(response => response.json())
        .then(data => {
            const pm10 = data.current.pm10 !== undefined ? data.current.pm10 : "N/A";
            let aqiDisplay = "AQI: ";

            if (pm10 === "N/A") {
                aqiDisplay += "N/A";
            } else {
                aqiDisplay += pm10;
                // Add emoticons based on PM10 levels
                if (pm10 <= 20) {
                    aqiDisplay += " 😊"; // Good
                } else if (pm10 <= 50) {
                    aqiDisplay += " 😐"; // Moderate
                } else if (pm10 <= 100) {
                    aqiDisplay += " 😷"; // Unhealthy for Sensitive Groups
                } else if (pm10 <= 250) {
                    aqiDisplay += " 🤢"; // Unhealthy
                } else if (pm10 <= 350) {
                    aqiDisplay += " ☠️"; // Very Unhealthy
                } else {
                    aqiDisplay += " 💀"; // Hazardous
                }
            }

            document.getElementById("aqi").textContent = aqiDisplay;
        })
        .catch(error => {
            console.error("Air Quality API error: ", error);
            document.getElementById("aqi").textContent = "AQI: --";
        });
}

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Heavy thunderstorm with hail'
    };
    return descriptions[code] || "Unknown";
}

function displayWeather(temp, conditions, aqi, humidity, feelsLike) {
    document.getElementById("temperature").textContent = temp;
    document.getElementById("conditions").textContent = conditions;
    document.getElementById("aqi").textContent = "AQI: " + aqi;
    document.getElementById("humidity").textContent = "Humidity: " + humidity;
    document.getElementById("feelsLike").textContent = "Feels Like: " + feelsLike;
}

function fetchHourlyForecast(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode,precipitation_probability&timezone=auto`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (!data.hourly || !data.hourly.time) {
                throw new Error('Invalid hourly forecast data');
            }

            const hourlyContainer = document.getElementById('hourly-forecast');
            hourlyContainer.innerHTML = ''; // Clear loading message

            const now = new Date();
            const currentHour = now.getHours();

            // Create container for hourly items


            // Display next 8 hours (current hour + next 7 hours)
            const intervalsToShow = 7;

            for (let i = 0; i < intervalsToShow; i++) {
                const hourIndex = currentHour + i;
                if (hourIndex >= data.hourly.time.length) break;

                const time = new Date(data.hourly.time[hourIndex]);
                const hour = time.getHours();
                const hourDisplay = hour === 0 ? '12 AM' :
                    hour < 12 ? `${hour} AM` :
                    hour === 12 ? '12 PM' : `${hour-12} PM`;
                const temp = Math.round(data.hourly.temperature_2m[hourIndex]);
                const weatherCode = data.hourly.weathercode[hourIndex];


                const hourElement = document.createElement('div');
                hourElement.className = 'hourly-item';
                hourElement.innerHTML = `
                    <div class="hour">${hourDisplay}</div>
                    <div class="weather-icon">${getWeatherIcon(weatherCode)}</div>
                    <div class="temp">${temp}°</div>`;

                // Highlight current hour
                if (i === 0) {
                    hourElement.classList.add('current-hour');
                }

                hourlyContainer.appendChild(hourElement);
            }
        })
        .catch(error => {
            console.error('Error fetching hourly forecast:', error);
            document.getElementById('hourly-forecast').innerHTML =
                '<div class="error">Failed to load hourly forecast. Please try again later.</div>';
        });
}

async function fetchWeeklyForecast(lat, lon) {
    try {
        // Fetch from Open-Meteo API (no API key needed)
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`
        );

        if (!response.ok) {
            throw new Error('Weather data not available');
        }

        const data = await response.json();

        const forecastContainer = document.getElementById('weekly-forecast');
        forecastContainer.innerHTML = '';

        data.daily.time.forEach((dateStr, index) => {
            const date = new Date(dateStr);
            const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
            const weatherCode = data.daily.weather_code[index];

            const dayElement = document.createElement('div');
            dayElement.className = 'forecast-day';
            dayElement.innerHTML = `
                <div class="day-name">${index === 0 ? 'Today' : dayName}</div>
                <div class="weather-icon">${getWeatherIcon(weatherCode)}</div>
                <div class="temp">
                    <span class="high">${Math.round(data.daily.temperature_2m_max[index])}°</span>
                    <span class="low">${Math.round(data.daily.temperature_2m_min[index])}°</span>
                </div>
            `;
            forecastContainer.appendChild(dayElement);
        });

    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById('weekly-forecast').innerHTML = `
            <div style="width:100%; text-align:center; padding:20px;">
                Failed to load weather data. Please try again later.
            </div>
        `;
    }
}
// Helper function to get weather icon
function getWeatherIcon(code) {
    const icons = {
        0: '☀️', // Clear sky
        1: '🌤️', // Mainly clear
        2: '⛅', // Partly cloudy
        3: '☁️', // Overcast
        45: '🌫️', // Fog
        48: '🌫️', // Depositing rime fog
        51: '🌧️', // Drizzle
        53: '🌧️', // Moderate drizzle
        55: '🌧️', // Dense drizzle
        56: '🌧️', // Freezing drizzle
        57: '🌧️', // Dense freezing drizzle
        61: '🌧️', // Slight rain
        63: '🌧️', // Moderate rain
        65: '🌧️', // Heavy rain
        66: '🌧️', // Freezing rain
        67: '🌧️', // Heavy freezing rain
        71: '❄️', // Slight snow
        73: '❄️', // Moderate snow
        75: '❄️', // Heavy snow
        77: '❄️', // Snow grains
        80: '🌧️', // Slight rain showers
        81: '🌧️', // Moderate rain showers
        82: '🌧️', // Violent rain showers
        85: '❄️', // Slight snow showers
        86: '❄️', // Heavy snow showers
        95: '⛈️', // Thunderstorm
        96: '⛈️', // Thunderstorm with hail
        99: '⛈️' // Heavy thunderstorm with hail
    };
    return icons[code] || '❓';
}
