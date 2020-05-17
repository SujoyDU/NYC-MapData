var map, map2;
var cdLayer,rangeLayer,valueLayer
var flag = true;
function initMap() {
  var myOptions = {
    zoom: 11,
    center: new google.maps.LatLng(40.67453,-73.71342),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

  
  cdLayer = new google.maps.Data();
  rangeLayer = new google.maps.Data();
  valueLayer = new google.maps.Data();
  
  cdLayer.loadGeoJson('comdis.geojson')
  rangeLayer.loadGeoJson('obesity_cd.geojson')
  valueLayer.loadGeoJson('obesity_cd.geojson')
  cdLayer.setStyle({
    fillColor: 'blue',
    strokeWeight: 1,
    fillOpacity:.20
  })
  rangeLayer.setStyle(styleFeatureRange)
  valueLayer.setStyle(styleFeature)
  cdLayer.setMap(map)
  //rangeLayer.setMap(map)
  //valueLayer.setMap(map)

  /*
  map.data.loadGeoJson('obesity_cd.geojson', {},
    function(features) {
      console.log(map.data.getFeatureById(1));
      console.log(map.data.getFeatureById(1).getProperty("pct_obese_rng"));
    });
    */
 

  //map.data.loadGeoJson('obesity_cd.geojson');
  
  /*
  map.data.setStyle({
    fillColor: '#D96969',
    strokeWeight: 1
  });
  */
  
  //map.data.setStyle(styleFeatureRange);

  //map2.data.loadGeoJson('comdis.geojson');
 
  /*
   map2.data.setStyle({
    fillColor: 'blue',
    strokeWeight: 1,
    fillOpacity:.90
  });
  map.data.setStyle(function(feature) {
    var obesity_range = feature.getProperty('pctbmige30');
    
    var color = obesity_range > 31 ? 'red' : 'blue';
    return {
      fillColor: color,
      strokeWeight: 1
    };
    
});
*/

  //map.data.addListener('mouseover', mouseInToRegion);
  //map.data.addListener('mouseout', mouseOutOfRegion);
  // map.data.addListener('mouseover', function(event) {
  //   document.getElementById('info-box').textContent =
  //       event.feature.getProperty('boro_cd');
  // });
  rangeLayer.addListener('mouseover', mouseInToRegion);
  rangeLayer.addListener('mouseout', mouseOutOfRegion);

  valueLayer.addListener('mouseover', mouseInToRegion);
  valueLayer.addListener('mouseout', mouseOutOfRegion);

}
function toggle(){
  if(flag) {
    flag = false
    console.log("valueLayer")
    rangeLayer.setMap(null)
    valueLayer.setMap(map)
  }
  else{
    flag = true
    console.log("rangeLayer")
    valueLayer.setMap(null)
    rangeLayer.setMap(map)
  }
}
/*
0.0-24.24
24.25-28.57
28.58-32.5
32.51-35.29
35.30-37.5
37.51-40.30
40.31-43.14
43.15-46.51
46.52-52.38
52.39-100.0

#67B1C5 103,177,197
#8EC8D1 142,200,209
#B4DDDB 180,221,219
#C2E6B8 194,230,184
#B7E1AC 183,225,172
#F6DA85 246,218,133
#F8C979 248,201,121
#FBB172 251,177,114
#EF8B6D 239,139,109
#D96969 217,105,105
*/
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
function styleFeature(feature) {

  
  var low = [1, 69, 54];  // color of smallest datum
  var high = [359, 83, 34];   // color of largest datum
  var censusMin = 0.00
  var censusMax = 100.00
  // delta represents where the value sits between the min and max
  var delta = (feature.getProperty('pctbmige30') - censusMin) /
      (censusMax - censusMin);
  
  var color = [];
  for (var i = 0; i < 3; i++) {
    // calculate an integer color based on the delta
    color[i] = (high[i] - low[i]) * delta + low[i];
  }

  // determine whether to show this shape or not
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
function mouseOutOfRegion(e) {
  // reset the hover state, returning the border to normal
  e.feature.setProperty('state', 'normal');
}
