var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: new google.maps.LatLng(40.65,-73.72),
    mapTypeId: 'roadmap'
  });
  
  map.data.loadGeoJson('obesity_cd.geojson', {},
    function(features) {
      console.log(map.data.getFeatureById(1));
      console.log(map.data.getFeatureById(1).getProperty("pct_obese_rng"));
    });
  //map.data.loadGeoJson('obesity_cd.geojson');
  /*
  map.data.setStyle({
    fillColor: 'blue',
    strokeWeight: 1
  });
  */
  
  map.data.setStyle(function(feature) {
    var obesity_range = feature.getProperty('pctbmige30');
    
    var color = obesity_range > 31 ? 'red' : 'blue';
    return {
      fillColor: color,
      strokeWeight: 1
    };
    
});


  // map.data.addListener('mouseover', function(event) {
  //   document.getElementById('info-box').textContent =
  //       event.feature.getProperty('boro_cd');
  // });
  map.data.addListener('mouseover', mouseInToRegion);
  map.data.addListener('mouseout', mouseOutOfRegion);
}


function loadCensusData(variable) {
    // load the requested variable from the census API
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://api.census.gov/data/2012/acs5/profile?get=' +
      variable + '&for=state:*&key=YOUR_API_KEY');
            xhr.onload = function() {
              var censusData = JSON.parse(xhr.responseText);
              censusData.shift(); // the first row contains column names
              censusData.forEach(function(row) {
                var censusVariable = parseFloat(row[0]);
                var stateId = row[1];
    
                // keep track of min and max values
                if (censusVariable < censusMin) {
                  censusMin = censusVariable;
                }
                if (censusVariable > censusMax) {
                  censusMax = censusVariable;
                }
    
                // update the existing row with the new data
                map.data
                  .getFeatureById(stateId)
                  .setProperty('census_variable', censusVariable);
              });
    
              // update and display the legend
              document.getElementById('census-min').textContent =
                  censusMin.toLocaleString();
              document.getElementById('census-max').textContent =
                  censusMax.toLocaleString();
            };
            xhr.send();
    }
function mouseInToRegion(e) {
  // set the hover state so the setStyle function can change the border
  e.feature.setProperty('state', 'hover');

  // var percent = (e.feature.getProperty('census_variable') - censusMin) /
  //     (censusMax - censusMin) * 100;

  // update the label
  document.getElementById('data-label').textContent =
    e.feature.getProperty('boro_cd');
  document.getElementById('data-value').textContent =
    e.feature.getProperty('pct_obese_rng').toLocaleString();
  document.getElementById('data-box').style.display = 'block';
  //document.getElementById('data-caret').style.display = 'block';
  // document.getElementById('data-caret').style.paddingLeft = percent + '%';
}

/**
 * Responds to the mouse-out event on a map shape (state).
 *
 * @param {?google.maps.MouseEvent} e
 */
function mouseOutOfRegion(e) {
  // reset the hover state, returning the border to normal
  e.feature.setProperty('state', 'normal');
}
