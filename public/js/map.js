mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  center: listing.geometry.coordinates,
  zoom: 9,
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({
      offset: 25,
      className: "listing-popup"
    }).setHTML(`
      <div class="popup-content">
        <h4>${listing.title}</h4>
        <p>Exact location provided after booking</p>
      </div>
    `)
  )
  .addTo(map);

