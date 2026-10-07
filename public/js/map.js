

maptilersdk.config.apiKey =maptoken;
const map = new maptilersdk.Map({
  container: "map",
  center: coordinates, 
  zoom: 10,
  style: maptilersdk.MapStyle.STREETS,
});

const marker = new maptilersdk.Marker({color:"red"})
.setLngLat(coordinates)
.addTo(map);

const popup = new maptilersdk.Popup({ className: 'my-popup' })
  .setHTML("Exact location provided for booking")
  .setMaxWidth("300px");

marker.setPopup(popup);