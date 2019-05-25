      function addr2wayptr(addrs) {
        var wayptrs = [];
        for (var i = 0; i < addrs.length; ++i) {
          wayptrs.push({ location: addrs[i], stopover: true });
        }
        return wayptrs;
      }

      function calculateAndDisplayRoute(dirservice, dirdisp, addresses) {
        var wps = addr2wayptr(addresses.slice(1, addresses.length - 1));
        var origin = addresses[0];
        var destination = addresses[addresses.length - 1];
        dirservice.route(
          {
            origin: origin,
            destination: destination,
            travelMode: "DRIVING",
            waypoints: wps
          },
          function(response, status) {
            if (status === "OK") {
              dirdisp.setDirections(response);
            } else {
              window.alert("Directions request failed due to " + status);
            }
          }
        );
      }

      function drawRoute(patient_waypoints, dirservice, dirdisp) {
        var pl = patient_waypoints.length;

        if (pl > 1) {
          var locs = new Array();
          for (var i = 0; i < patient_waypoints.length; ++i) {
            locs.push(patient_waypoints[i].loc);
          }
          calculateAndDisplayRoute(
            dirservice,
            dirdisp,
            locs);
        }
      }

