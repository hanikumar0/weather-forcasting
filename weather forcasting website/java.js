async function searchWeather() {
    const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key
    const location = document.getElementById('location-input').value;
    
    if (!location) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    try {
        const [currentWeatherResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        if (!currentWeatherResponse.ok || !forecastResponse.ok) {
            throw new Error('City not found');
        }

        const currentWeatherData = await currentWeatherResponse.json();
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentWeatherData);
        displayForecast(forecastData);

    } catch (error) {
        alert(error.message);
    }
}

function displayCurrentWeather(data) {
    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('temperature').textContent = data.main.temp;
    document.getElementById('weather-description').textContent = data.weather[0].description;
    document.getElementById('wind-speed').textContent = data.wind.speed;
}

function displayForecast(data) {
    const forecastList = document.getElementById('forecast-list');
    forecastList.innerHTML = '';

    // Filtering the forecast to show only one forecast per day
    const dailyForecasts = data.list.filter((forecast, index) => {
        return index % 8 === 0;
    });

    dailyForecasts.forEach(forecast => {
        const listItem = document.createElement('li');
        const date = new Date(forecast.dt_txt).toLocaleDateString();
        const temp = forecast.main.temp;
        const description = forecast.weather[0].description;
        
        listItem.innerHTML = `
            <h3>${date}</h3>
            <p>Temperature: ${temp}°C</p>
            <p>Weather: ${description}</p>
        `;
        forecastList.appendChild(listItem);
    });
}
