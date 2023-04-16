// import L from '../../node_modules/leaflet/dist/leaflet.js';

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

let map = L.map('map').setView([51.505, -0.09], 13);
