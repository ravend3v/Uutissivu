fetch('http://localhost:8081/saa/21', {
  headers: {
    'Content-Type': 'application/xml'
  },
  mode: 'cors'
})
  .then(response => response.text())
  .then(data => {
    console.log(data);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, 'text/xml');

    const vko = xmlDoc.getElementsByTagName('vko')[0].childNodes[0].nodeValue;
    const pvm = xmlDoc.getElementsByTagName('pvm')[0].childNodes[0].nodeValue;
    const lampotila = xmlDoc.getElementsByTagName('lampotila')[0].childNodes[0].nodeValue;
    const tuuli = xmlDoc.getElementsByTagName('tuulennopeus')[0].childNodes[0].nodeValue;
    const saatila = xmlDoc.getElementsByTagName('saatila')[0].childNodes[0].nodeValue;

    document.getElementById('saa').innerHTML = `
      <div>
        <h3>${pvm}</h3> <br> <h3>${lampotila}°C</h3> <br> <h3>Säätila:</h3> <p>${saatila}</p> <br> <h3>Tuulennopeus:</h3> <p>${tuuli}m/s</p>
      </div>
    `;

    document.getElementById('vko').innerHTML = `
      <h3>Viikon sää - viikko ${vko}</h3>
    `;

  })
  .catch(error => {
    console.error(error);
  });

//Pyydetään blogit blogi palvelimelta
fetch('http://localhost:8080/', {
  headers: {
    'Content-Type': 'application/json',
  },
  mode: 'cors'
}).then(response => response.json()).then(data => {

  tarinatHtml1 = `
    <div><h3>${data[0].blogi}:</h3>${data[0].otsikko} <br> ${data[0].kirjoittaja}</div>
    <div><h3>${data[1].blogi}:</h3>${data[1].otsikko} <br> ${data[1].kirjoittaja}</div>
    <div><h3>${data[2].blogi}:</h3>${data[2].otsikko} <br> ${data[2].kirjoittaja}</div>
  `;
  document.getElementById('tarinat').innerHTML = tarinatHtml1;
});

//Pyydetään uutiset omalta palvelimelta
fetch('/news', {
  mode: 'cors'
}).then(response => response.json()).then(data => {

  uutisetHtml1 = `
    <div><h3>${data[0].otsikko}</h3><p>${data[0].julkaisuaika} || ${data[0].kirjoittaja}</p><p>${data[0].sisalto}</p></div>
  `;
  uutisetHtml2 = `
    <div><h3>${data[1].otsikko}</h3><p>${data[0].julkaisuaika} || ${data[1].kirjoittaja} ${data[1].sisalto}</p></div>
  `;

  uusimmatHtml = `
    <div><h3>${data[0].otsikko}</h3><p>${data[0].julkaisuaika}</p></div>
    <div><h3>${data[1].otsikko}</h3><p>${data[1].julkaisuaika}</p></div>
    <div><h3>${data[2].otsikko}</h3><p>${data[3].julkaisuaika}</p></div>
    <div><h3>${data[4].otsikko}</h3><p>${data[4].julkaisuaika}</p></div>
  `

  document.getElementById('uutiset1').innerHTML = uutisetHtml1;
  document.getElementById('uutiset2').innerHTML = uutisetHtml2;
  document.getElementById('uusimmat-uutiset').innerHTML = uusimmatHtml;
})
