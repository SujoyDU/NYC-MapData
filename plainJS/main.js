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
  var infoWindow = new google.maps.InfoWindow({position:{lat:40.67453,lng:-73.71342}});
  cdLayer.loadGeoJson('Population_Obesity_CD.geojson');
  cdLayer.setStyle(cdLayerStyle);
  cdLayer.addListener('mouseover', mouseInToCDLayer);
  cdLayer.addListener('mouseout', mouseOutOfCDLayer);
  cdLayer.addListener('click', function(e) {
    // Create a new InfoWindow.
    infoWindow.close()
    infoWindow = new google.maps.InfoWindow({position:e.latLng});
    infoWindow.setContent(e.latLng.toString());
    infoWindow.open(map);
  
  });
  cdLayer.setMap(map);
 }

function cdLayerStyle(feature){
  var outlineWeight = 0.5, zIndex = 1;
  if (feature.getProperty('state') === 'hover') {
    outlineWeight = zIndex = 2;
  }
  return {
    strokeWeight: outlineWeight,
    zIndex: zIndex,
    fillColor: '#3454b5',
    fillOpacity: 0.20,
    
  };
}
function mouseInToCDLayer(e){
  e.feature.setProperty('state','hover')
}
function mouseOutOfCDLayer(e){
  e.feature.setProperty('state','normal')
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