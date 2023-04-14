window.addEventListener('load', function() {
  const weatherDataDiv = document.getElementById('weather-data');

  function updateWeatherData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/weather');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const weatherData = JSON.parse(xhr.responseText);
            let weatherHtml = '';
            weatherData.forEach(function(item) {
                const date = new Date(item.pvm);
                const formattedDate = date.toLocaleDateString('fi-FI', { timeZone: 'UTC' });
                weatherHtml += `
                  <div class="day-box">
                    <div class="date">${formattedDate} </div>
                    <div class="temp">${item.lampotila}°C </div>
                    <h2>Säätila:</h2>
                    <div class="conditions">${item.saatila} </div>
                    Tuulen nopeus:
                    <div class="wind">${item.tuulennopeus} m/s </div>
                  </div>
                `;
            });
            weatherDataDiv.innerHTML = weatherHtml;
        }
    }
    xhr.send();
  }

updateWeatherData();
setInterval(updateWeatherData, 60000);
});  