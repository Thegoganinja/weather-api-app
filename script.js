const API_KEY = '88da999d98391af577dd7680e76ccbde';

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const geoBtn = document.getElementById('geoBtn');
const mainParent = document.getElementById('mainParent');

//  Search by city name
searchBtn.addEventListener('click', () => {
  const cityName = cityInput.value.trim();
  console.log("User entered city:", cityName);

  if (cityName === '') {
    alert('Please enter a city name');
    return;
  }

  getWeatherByCity(cityName);
});

//  Get weather by city name
async function getWeatherByCity(cityName) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
  console.log("Calling API with URL:", url);

  try {
    const response = await axios.get(url);
    showWeather(response.data);
  } catch (error) {
    handleError(error);
  }
}

//  Get weather by coordinates (Geolocation)
geoBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

function successCallback(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  console.log("User location:", lat, lon);
  getWeatherByCoords(lat, lon);
}

function errorCallback(error) {
  console.error("Geolocation error:", error);
  alert("Could not get your location.");
}

async function getWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  console.log("Fetching by coordinates:", url);

  try {
    const response = await axios.get(url);
    showWeather(response.data);
  } catch (error) {
    handleError(error);
  }
}

//  Display weather data in card
function showWeather(data) {
  const weatherHTML = `
    <div class="card">
      <h2>${data.name}, ${data.sys.country}</h2>
      <p><strong>Temperature:</strong> ${data.main.temp}°C (Feels like: ${data.main.feels_like}°C)</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>Weather:</strong> ${data.weather[0].description}</p>
      <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    </div>
  `;
  mainParent.innerHTML = weatherHTML;
}

// Handle API errors
function handleError(error) {
  console.error("API call failed:", error);
  let message = " We could not fetch weather data.";
  if (error.response && error.response.data && error.response.data.message) {
    message += ` (${error.response.data.message})`;
  }
  mainParent.innerHTML = `<p class="error">${message}</p>`;
}
