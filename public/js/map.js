// Set your API key
maptilersdk.config.apiKey = mapToken;
// Fallback coordinates: Delhi
const fallbackCoords = [77.209, 28.6139];

// Ensure window.coordinates is a valid array [lng, lat]
let centerCoords =
  Array.isArray(window.coordinates) && window.coordinates.length === 2
    ? window.coordinates.map(Number) // convert to numbers
    : fallbackCoords;
// Initialize map
const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS,
  center: centerCoords,
  zoom: 6,
});

// Add custom red marker (Google-style)
const redPin = document.createElement("div");
redPin.innerHTML = `
  <svg width="34" height="48" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M12 0C5.4 0 0 5.3 0 11.8c0 8.8 12 24.2 12 24.2s12-15.4 12-24.2C24 5.3 18.6 0 12 0z"/>
    <circle cx="12" cy="12" r="5" fill="white"/>
  </svg>
`;
redPin.style.transform = "translate(-50%, -100%)";
redPin.style.cursor = "pointer";

const marker = new maptilersdk.Marker({ element: redPin })
  .setLngLat(centerCoords)
  .addTo(map);

// Add popup
// const popup = new maptilersdk.Popup({ closeOnClick: true })
//   .setLngLat(centerCoords)
//   .setHTML(
//     `<h4>${window.listing.title}</h4><p>Exact location we be provided after booking.</p>`
//   )
//   .addTo(map);

// // Attach popup to marker
// marker.setPopup(popup);
