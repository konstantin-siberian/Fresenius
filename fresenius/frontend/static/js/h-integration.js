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

function get_first_nightstay_waypoint(patient_waypoints) {
  for (var i = 0; i < patient_waypoints.length; ++i) {
    if (patient_waypoints[i].day_to - patient_waypoints[i].day_from > 0) {
      return i;
    }
  }
  return patient_waypoints.length;
}

function get_nights(i, patient_waypoints) {
  return patient_waypoints[i].day_to - patient_waypoints[i].day_from;
}

// returns an array of indices which point to current
// waypoints in the user path. day 0: {origin: id, dest: id}
// The function returns the last travel on that day since there
// can be multiple travels per day
function get_travelarray(patient_waypoints) {
  // day 0 = day before the first night
  var init = get_first_nightstay_waypoint(patient_waypoints);
  var travel = [{'origin' : init, 'destination' : init}];
  for (var di = 1; di < get_nights(init, patient_waypoints); ++di) {
    travel.push({'origin': init, 'destination': init});
  }

  for (var waypoint_id = init; waypoint_id < patient_waypoints.length - 1; ++waypoint_id) {
    if (get_nights(waypoint_id + 1, patient_waypoints) == 0) { continue; }
    travel.push({'origin': waypoint_id, 'destination': waypoint_id + 1});
    for (var di = 1; di < get_nights(waypoint_id + 1, patient_waypoints); ++di) {
      travel.push({'origin': waypoint_id + 1, 'destination': waypoint_id + 1});
    }
  }
  return travel;
}

function longlatdistance(lon1,lat1, lon2, lat2) {
	var unit = 1;
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

      function map_longlatdistance(origin, dests) {
        var distances = [];
        for (var i = 0; i < dests.length; ++i) {
          distances.push({ 'dist' :
            longlatdistance(
              origin.lng,
              origin.lat,
              dests[i].lng,
              dests[i].lat
            )
          , 'id' : i});
        }
        return distances;
      }

function get_n_smallest(arr, n) {
  // hopefully this is a copy
  var arrtmp = arr;
  arrtmp.sort(function(a, b) { return a.dist < b.dist; });
  return arrtmp.slice(0, n);
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

function contains(arr, el) {
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] == el) {
      return true;
    }
  }
  return false;
}

function splitUp(patient_waypoints, day) {
  for (var i = 0; i < patient_waypoints.length; ++i) {
    if (patient_waypoints[i].day_from < day &&
        (patient_waypoints[i].day_to - patient_waypoints[i].day_from) > 1 &&
        patient_waypoints[i].day_to > day) {
      var fst = patient_waypoints.slice(0, i);
      var wp = patient_waypoints.shift();
      var wp_new = {'loc' : {'lat' : wp.loc.lat, 'lng' : wp.loc.lng}, 
        'day_from': wp.day_from, 'day_to' : day };
      wp.day_from = day;
      fst.push(wp_new);
      fst.push(wp);
      patient_waypoints = fst.concat(patient_waypoints.slice(i, patient_waypoints.length));
      return {'new_index' : i, 'patient_waypoints' : patient_waypoints};
    }
  }
  return {'new_index' : patient_waypoints.length, 'patient_waypoints' : patient_waypoints};
}

function insertOneDayStop(patient_waypoints, loc, day, from_node, to_node) {
  if (from_node == to_node) {
    // we need to split up a node
    var tuple = splitUp(patient_waypoints, day);
    var new_node_index = tuple.new_index;
    patient_waypoints = tuple.patient_waypoints;
    var new_wp = {'loc' : loc, 'day_from' : day, 'day_to' : day};
    patient_waypoints.splice(new_node_index + 1, 0, new_wp);
  }
  return patient_waypoints;
}

function get_waypoint_by_id(patient_waypoints, id) {
  for (var i = 0; i < patient_waypoints.length; ++i) {
    if (patient_waypoints[i].id == id) {
      return patient_waypoints[i];
    }
  }
}

function get_index_of_nearest_point(l, ls) {
  var distances = map_longlatdistance(l, ls);
  var smallest = get_n_smallest(distances, 20);
  return smallest[0].id;
}

function integrateTimeHandler(patient_waypoints, patient_properties, dirservice, dirdisp) {
  console.log("[+]integrateTimeHandler()");
  var tarr = get_travelarray(patient_waypoints);
  var treatmentdays = new Array();
  for (var i = 0; i < tarr.length; ++i) {
    if (contains(patient_properties.treatment_days,
        (i + 7 - patient_properties.starting_day_offset) % 7)) {
      treatmentdays.push({ 'traveldata' : tarr[i], 'day' : i});
      if (tarr[i].origin == tarr[i].destination) {
        var curr_wp = get_waypoint_by_id(patient_waypoints, tarr[i].origin);
        var nearest_hosp_i = get_index_of_nearest_point(
          curr_wp.loc, hospitals);
        patient_waypoints = insertOneDayStop(patient_waypoints, hospitals[nearest_hosp_i], i, tarr[i].origin, tarr[i].destination);
      }
    }
  }
  drawRoute(patient_waypoints, dirservice, dirdisp);
  console.log("[-]integrateTimeHandler()");
}
