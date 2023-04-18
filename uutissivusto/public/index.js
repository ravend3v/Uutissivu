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
});  

fetch('http://localhost:8080/', {
  headers: {
    'Content-Type': 'application/json',
  },
  mode: 'cors'
}).then(response => response.json()).then(data => {
  console.log(data);

  tarinatHtml1 = `
    <div><h3>${data[0].blogi}</h3><p>${data[0].otsikko}</div>
    <div><h3>${data[1].blogi}</h3><p>${data[1].otsikko}</div>
    <div><h3>${data[2].blogi}</h3><p>${data[2].otsikko}</div>
    
    
  `;
  document.getElementById('tarinat').innerHTML = tarinatHtml1;
  
  
});
