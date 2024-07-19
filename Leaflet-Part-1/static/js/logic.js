// Initialize the map and set its view
let map = L.map('map').setView([33.3943, -104.5230], 4);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

  // Load in geojson data from USGS
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the earthquake data using D3
d3.json(geoData).then(data => {
    console.log('Geo data:', data);
    let earthquakes = data.features;
  
    earthquakes.forEach(earthquake => {
      let magnitude = earthquake.properties.mag;
      let depth = earthquake.geometry.coordinates[2];
      let [lng, lat] = earthquake.geometry.coordinates;

    // This function determines the color of the marker based on the magnitude of the earthquake.
    let color = depth > 90 ? 'redyellow' :
                  depth > 70 ? 'orangered' :
                  depth > 50 ? 'orange' :
                  depth > 30 ? 'yellow' :
                  depth > 10 ? 'greenyellow' :
                               'black';

    // Determine the radius of the earthquake marker based on its magnitude.
    let radius = magnitude * 3;
    // Create a circle marker
    let marker = L.circleMarker([lat, lng], {
    color: '#1000',
    weight: 1,
    fillColor: color,
    fillOpacity: 0.5,
    radius: radius
    }).addTo(map);

  // Binding a pop-up to each layer
marker.bindPopup(`
    <h3>${earthquake.properties.place}</h3>
    <p>Magnitude: ${magnitude}</p>
    <p>Depth: ${depth} km</p>
    <p>Time: ${new Date(earthquake.properties.time).toLocaleString()}</p>
  `);

}); 

    
  }); 

  // Add a legend to the map
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  let div = L.DomUtil.create('div', 'info legend');
  let depths = [-10, 10, 30, 50, 70, 90];
  let colors = [
    'black',
    'greenyellow',
    'yellow',
    'orange',
    'orangered',
    'red'
  ];

  div.innerHTML += '<strong>Depth (km)</strong><br>';
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(map);