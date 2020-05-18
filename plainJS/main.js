var map;
var markerCluster;
var markers;
var flag = true;
var colorRange =[
  {
    range:'0.0 - 24.24',
    hexa: '#67B1C5',
    rgbval: [103,177,197]
  },
  {
    range:'24.25 - 28.57',
    hexa: '#8EC8D1',
    rgbval: [142,200,209]
  },
  {
    range:'28.58 - 32.5',
    hexa: '#B4DDDDB',
    rgbval: [180,221,219]
  },
  {
    range:'32.51 - 35.29',
    hexa: '#C2E6B8',
    rgbval: [194,230,184]
  },
  {
    range:'35.30 - 37.5',
    hexa: '#B7E1AC',
    rgbval: [183,225,172]
  },
  {
    range:'37.51 - 40.30',
    hexa: '#F6DA85',
    rgbval: [246,218,133]
  },
  {
    range:'40.31 - 43.14',
    hexa: '#F8C979',
    rgbval: [248,201,121]
  },
  {
    range:'43.15 - 46.51',
    hexa: '#FBB172',
    rgbval: [251,177,114]
  },
  {
    range:'46.52 - 52.38',
    hexa: '#EF8B6D',
    rgbval: [39,139,109]
  },
  {
    range:'52.39 - 100.0',
    hexa: '#D96969',
    rgbval: [217,105,105]
  },

]

//initialize the map
function initMap() {
  var myOptions = {
    zoom: 11,
    center: new google.maps.LatLng(40.67453,-73.71342),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  loadBaseLayer()  

  //range and value layer obesity
  rangeLayer = new google.maps.Data();
  valueLayer = new google.maps.Data();

  rangeLayer.loadGeoJson('obesity_cd.geojson');
  valueLayer.loadGeoJson('obesity_cd.geojson');

  rangeLayer.setStyle(styleFeatureRange);
  valueLayer.setStyle(styleFeatureValue);

  rangeLayer.addListener('mouseover', mouseInToRegion);
  rangeLayer.addListener('mouseout', mouseOutOfRegion);

  valueLayer.addListener('mouseover', mouseInToRegion);
  valueLayer.addListener('mouseout', mouseOutOfRegion);

 
  gymmarkerLayer= new google.maps.Data();
  
}

function gymLayer(){
  var infoWin = new google.maps.InfoWindow();
  gymmarkerLayer.loadGeoJson('nyc_gyms.geojson', null, function (features) {
  var markers = features.map(function (location) {
        var g = location.getGeometry();
        var name  = location.j.name;
        var marker = new google.maps.Marker({ 'position': g.get(0) });
        google.maps.event.addListener(marker, 'click', function(location) {
          infoWin.setContent(name);
          infoWin.open(map, marker);
        })
        return marker;
    });
    markerCluster = new MarkerClusterer(map, markers,{ imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m' });
  });
}


function styleFeatureRange(feature) {
  var outlineWeight = 0.5, zIndex = 1;
  var color =''
  for (let i = 0; i < colorRange.length; i++) {
    if (colorRange[i].range == feature.getProperty('pct_obese_rng')) {
      color = colorRange[i].hexa;
      break
    }
  }
  if (feature.getProperty('state') === 'hover') {
    outlineWeight = zIndex = 2;
  }

  return {
    strokeWeight: outlineWeight,
    strokeColor: '#fff',
    zIndex: zIndex,
    fillColor: color,
    fillOpacity: 0.90,
    visible: true
  };

}
function styleFeatureValue(feature) {  
  var low = [1, 69, 54];  // color of smallest datum
  var high = [359, 83, 34];   // color of largest datum
  var Min = 0.00
  var Max = 100.00
  
  var delta = (feature.getProperty('pctbmige30') - Min) /
      (Max - Min);
  
  var color = [];
  for (var i = 0; i < 3; i++) {
    color[i] = (high[i] - low[i]) * delta + low[i];
  }

  
  var showRow = true;
  if (feature.getProperty('pctbmige30') == null ||
      isNaN(feature.getProperty('pctbmige30'))) {
    showRow = false;
  }

  var outlineWeight = 0.5, zIndex = 1;
  if (feature.getProperty('state') === 'hover') {
    outlineWeight = zIndex = 2;
  }

  return {
    strokeWeight: outlineWeight,
    strokeColor: '#fff',
    zIndex: zIndex,
    fillColor: 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)',
    fillOpacity: 0.90,
    visible: showRow
  };
}
function mouseInToRegion(e) {
  e.feature.setProperty('state', 'hover');
  document.getElementById('data-label').textContent =
    e.feature.getProperty('boro_cd');
  document.getElementById('data-value').textContent =
    e.feature.getProperty('pctbmige30').toLocaleString();
  document.getElementById('data-box').style.display = 'block';
}
function mouseOutOfRegion(e) { 
  e.feature.setProperty('state', 'normal');
}

function loadBaseLayer(){
  cdLayer = new google.maps.Data();
  var infoWindow = new google.maps.InfoWindow({position:{lat:40.67453,lng:-73.71342}});
  cdLayer.loadGeoJson('Population_Obesity_CD.geojson');
  cdLayer.setStyle(cdLayerStyle);

  cdLayer.addListener('click', function(e) {
    totalPop = parseInt(e.feature.getProperty('total_population_cd'));
    infoWindow.close();
    infoWindow = new google.maps.InfoWindow({position:e.latLng});
    var contentString = 
    '<div id="content">'+
      '<h1 id="firstHeading" class="firstHeading">'+e.feature.getProperty('GEO_DISPLAY_NAME')+'</h1>'+
      '<div id="bodyContent">'+
        '<p><b>'+'Community District Code: '+'</b>'+e.feature.getProperty('GEO_LABEL')+'</p>'+
        '<p><b>'+'Total Population: '+'</b>'+totalPop+'</p>'+
        '<p><b>'+'Obesity Rate of adult Population: '+'</b>'+e.feature.getProperty('obesity_cd')+'%</p>'+
      '</div>'+
    '</div>';
    infoWindow.setContent(contentString);
    infoWindow.open(map);
  
  });  
  cdLayer.setMap(map);
 }

function cdLayerStyle(feature){
  var outlineWeight = 0.5, zIndex = 1;
  return {
    strokeWeight: outlineWeight,
    zIndex: zIndex,
    fillColor: '#3454b5',
    fillOpacity: 0.20,
    
  };
}
 
function baseLayer(e){
  e.preventDefault();
  e.stopPropagation();
  markerCluster.clearMarkers();
  valueLayer.setMap(null);
  rangeLayer.setMap(null);
  gymmarkerLayer.setMap(null);
}
function toggleObesityLayer(){
  if(flag) {
    flag = false;
    rangeLayer.setMap(null);
    valueLayer.setMap(map);
  }
  else{
    flag = true;
    valueLayer.setMap(null);
    rangeLayer.setMap(map);
  }
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