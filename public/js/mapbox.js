const locationData = JSON.parse(
  document.getElementById('map').dataset.locations
);
// console.log(locationData);

const startLocation = locationData[0].coordinates;

let map = L.map('map').setView([startLocation[1], startLocation[0]], 8);
L.marker([startLocation[1], startLocation[0]]).addTo(map);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const locationCoords = locationData[1];

locationCoords.forEach((el, i) => {
  const coords = el.coordinates;
  L.popup()
    .setLatLng([coords[1], coords[0]])
    .setContent(`Day ${i + 1} : ${el.description}`)
    .addTo(map);
});
