var map;
//initialize the map
function initMap() {
  var myOptions = {
    zoom: 11,
    center: new google.maps.LatLng(40.67453,-73.71342),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  loadBaseLayer()
}

//community district base layer
function loadBaseLayer(){
  cdLayer = new google.maps.Data();
  cdLayer.loadGeoJson('comdis.geojson');
  cdLayer.setStyle({
    fillColor: '#3454b5',
    strokeWeight: 1,
    fillOpacity:.20
  });
  cdLayer.addListener('click', function(event) {
    var feat = event.feature;
    var html = "<b>"+feat.getProperty('boro_cd')+"</b><br>"+feat.getProperty('shape_area');
    infowindow.setContent(html);
    infowindow.setPosition(event.latLng);
    infowindow.setOptions({pixelOffset: new google.maps.Size(0,-34)});
    infowindow.open(map);
 });
  
  cdLayer.setMap(map); 
}

/*
cdLayer.addListener('click', function(event) {
    var feat = event.feature;
    var html = "<b>"+feat.getProperty('name')+"</b><br>"+feat.getProperty('description');
    html += "<br><a class='normal_link' target='_blank' href='"+feat.getProperty('link')+"'>link</a>";
    infowindow.setContent(html);
    infowindow.setPosition(event.latLng);
    infowindow.setOptions({pixelOffset: new google.maps.Size(0,-34)});
    infowindow.open(map);
 });


function mouseInToRegion(e) {
  // set the hover state so the setStyle function can change the border
  e.feature.setProperty('state', 'hover');
  

  // var percent = (e.feature.getProperty('census_variable') - censusMin) /
  //     (censusMax - censusMin) * 100;

  // update the label
  document.getElementById('data-label').textContent =
    e.feature.getProperty('boro_cd');
  document.getElementById('data-value').textContent =
    e.feature.getProperty('pctbmige30').toLocaleString();
  document.getElementById('data-box').style.display = 'block';

  //document.getElementById('data-caret').style.display = 'block';
  // document.getElementById('data-caret').style.paddingLeft = percent + '%';
}

/**
 * Responds to the mouse-out event on a map shape (state).
 *
 * @param {?google.maps.MouseEvent} e
 */
/*
function mouseOutOfRegion(e) {
  // reset the hover state, returning the border to normal
  e.feature.setProperty('state', 'normal');
}


 */