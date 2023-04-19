fetch('http://localhost:8081/saa/21', {
  headers: {
    'Content-Type': 'application/xml',
  },
  mode: 'cors'
}).then(response => response.text()).then(data => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, 'application/xml');
  const saatiedot = xml.getElementsByTagName('saatieto');
  let saatiedotHtml = '';
  for (let i = 0; i < saatiedot.length; i++) {
    saatiedotHtml += `
      <div>
        <h3>${saatiedot[i].getElementsByTagName('pvm')[0].textContent}</h3>
        <p>${saatiedot[i].getElementsByTagName('saatila')[0].textContent}</p>
        <p>${saatiedot[i].getElementsByTagName('lampotila')[0].textContent}</p>
        <p>${saatiedot[i].getElementsByTagName('tuulennopeus')[0].textContent}</p>
      </div>
    `;
  }
  document.getElementById('saatiedot').innerHTML = saatiedotHtml;
});

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
