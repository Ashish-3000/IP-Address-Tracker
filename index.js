// console.log = function () {};
console.log = function () {};
var token = config.MY_API_TOKEN;
var key = config.SECRET_API_KEY;
console.log(token);
mapboxgl.accessToken = config.MY_API_TOKEN;

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
});
var lat = -1,
  long = -1;
document.getElementById("onClick").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    onClick();
  }
});
document.getElementById("onClick").addEventListener("click", onClick);

function onClick() {
  var value = document.getElementById("ipAddress").value;

  if (value === "") {
    document.getElementById("ipAddress").placeholder =
      "Enter the ipAdress or Domain";
    return;
  }
  var value_entered;
  if (value[0] >= "0" && value[0] <= "9") value_entered = "ipAddress";
  else value_entered = "domain";
  fetch(
    `https://geo.ipify.org/api/v1?apiKey=at_${
      config.SECRET_API_KEY
    }&${value_entered}=${value}`
  ).then(function (response) {
    if (response.status !== 200) {
      document.getElementById("invisible").style.display = "block";
      return;
    }

    // Examine the text in the response
    response.json().then(function (data) {
      document.getElementById("invisible").style.display = "none";

      lat = data.location.lat;
      long = data.location.lng;
      document.getElementById("ipaddressbox").innerHTML = data.ip;
      document.getElementById("location").innerHTML =
        data.location.city + " " + data.location.country;
      document.getElementById("timezone").innerHTML = data.location.timezone;
      document.getElementById("isp").innerHTML = data.isp;

      if (lat != -1) {
        if (window.screen.width > "1000px")
          document.getElementById("second-item").style.top = "-8%";
        else document.getElementById("second-item").style.top = "-10%";
        var popup = new mapboxgl.Popup({ closeOnClick: false })
          .setLngLat([long, lat])
          .setHTML(`${data.location.region}`)
          .addTo(map);
        map.flyTo({
          center: [long, lat],
          zoom: 9,
          speed: 0.9,
          curve: 1,
          easing(t) {
            return t;
          },
        });
      }
    });
  });
}
