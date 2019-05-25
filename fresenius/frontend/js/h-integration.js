function sum(arr) {
  if (arr.length == 0) { return 0; }
  var sum = 0.0;
  for (var i = 0; i < arr.length; ++i) {
    sum = sum + arr[i];
  }
  return sum;
}

function first_non_zero_index(arr) {
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] != 0) {
      return i;
    }
  }
  return arr.length;
}

// returns an array of indices which point to current
// waypoints in the user path. day 0: {origin: id, dest: id}
// The function returns the last travel on that day since there
// can be multiple travels per day
function travelarray(nights) {
  // day 0 = day before the first night
  var num_travel_days = sum(nights) + 1;
  var init = first_non_zero_index(nights);
  var travel = [{'origin' : init, 'destination' : init}];
  for (var di = 1; di < nights[init]; ++di) {
    travel.push({'origin': init, 'destination': init});
  }

  if (nights.length < 2) { return travel; }
  for (var waypoint_id = init; waypoint_id < nights.length - 1; ++waypoint_id) {
    if (nights[waypoint_id + 1] == 0) { continue; }
    travel.push({'origin': waypoint_id, 'destination': waypoint_id + 1});
    for (var di = 1; di < nights[waypoint_id + 1]; ++di) {
      travel.push({'origin': waypoint_id, 'destination': waypoint_id});
    }
  }
  return travel;
}

      function longlatdistance(lng0, lat0, lng1, lat1) {
        var R = 6371e3; // metres
        var φ1 = lat1.toRadians();
        var φ2 = lat2.toRadians();
        var Δφ = (lat2 - lat1).toRadians();
        var Δλ = (lon2 - lon1).toRadians();

        var a =
          Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        var d = R * c;
        return d;
      }

      function map_longlatdistance(geocoder, origin, dests) {
        var distances = [];
        for (var i = 0; i < dests.length; ++i) {
          distances.push(
            longlatdistance(
              origin_loc.lng,
              origin_loc.lat,
              dests[i].lng,
              dests[i].lat
            )
          );
        }
        return distances;
      }

      function all_distances_between(dirmatservice, origin, dests) {
        dirmatservice.getDistanceMatrix(
          {
            origins: [origin],
            destinations: dests,
            travelMode: "DRIVING",
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
          },
          function(response, status) {
            if (status !== "OK") {
              alert("Error was: " + status);
            } else {
              var originList = response.originAddresses;
              var destinationList = response.destinationAddresses;

              for (var i = 0; i < originList.length; i++) {
                var results = response.rows[i].elements;
              }
            }
          }
        );
      }

