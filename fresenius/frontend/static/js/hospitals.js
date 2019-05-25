function preprocess_hospital_json(hospitals_json) {
  var hospitals = [];
  // VERY BAAAD; HARD CODED THE NUMBER OF HOSPITALS HERE
  for (var i = 0; i < 338; ++i) {
    var lat = hospitals_json.LATITUDE[String(i)];
    var lon = hospitals_json.LONGITUDE[String(i)];
    if (lat != null && lon != null) {
      hospitals.push({ lat: lat, lng: lon, id: i });
    }
  }
  return hospitals;
}

var hospitals = preprocess_hospital_json(hospitals_json);

function makeInfoWindowEvent(map, infowindow, contentString, marker) {
  google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(contentString);
    infowindow.open(map, marker);
  });
}

function mark_all_hospitals(hospitals_json, map) {
  var image =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
  var infowindow = new google.maps.InfoWindow();
  for (var i = 0; i < hospitals.length; ++i) {
    var marker = new google.maps.Marker({
      position: hospitals[i],
      map: map,
      title: "hospital",
      icon: image
    });
    html =
      "<div class='maps-popup'><b>" +
      hospitals_json.name[hospitals[i].id] +
      "</b><br><i>Address: </i> " +
      hospitals_json.address[hospitals[i].id] +
      String(hospitals_json.LATITUDE[hospitals[i].id]) +
      String(hospitals_json.LONGITUDE[hospitals[i].id]) +

      "<br><i>Phone: </i>" +
      hospitals_json.phone[hospitals[i].id] +
      "</div>";
    makeInfoWindowEvent(map, infowindow, html, marker);
  }
}
