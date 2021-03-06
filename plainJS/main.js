var map;
var markerCluster;
var restaurantMarkerCluster;
var markers;
var flag = true;
var markerFlag = false;
var restaurantMarkerFlag = false;
var colorRange = [{
        range: '0.0 - 24.24',
        hexa: '#67B1C5',
        rgbval: [103, 177, 197]
    },
    {
        range: '24.25 - 28.57',
        hexa: '#8EC8D1',
        rgbval: [142, 200, 209]
    },
    {
        range: '28.58 - 32.5',
        hexa: '#B4DDDDB',
        rgbval: [180, 221, 219]
    },
    {
        range: '32.51 - 35.29',
        hexa: '#C2E6B8',
        rgbval: [194, 230, 184]
    },
    {
        range: '35.30 - 37.5',
        hexa: '#B7E1AC',
        rgbval: [183, 225, 172]
    },
    {
        range: '37.51 - 40.30',
        hexa: '#F6DA85',
        rgbval: [246, 218, 133]
    },
    {
        range: '40.31 - 43.14',
        hexa: '#F8C979',
        rgbval: [248, 201, 121]
    },
    {
        range: '43.15 - 46.51',
        hexa: '#FBB172',
        rgbval: [251, 177, 114]
    },
    {
        range: '46.52 - 52.38',
        hexa: '#EF8B6D',
        rgbval: [39, 139, 109]
    },
    {
        range: '52.39 - 100.0',
        hexa: '#D96969',
        rgbval: [217, 105, 105]
    },

]

//initialize the map
function initMap() {
    var myOptions = {
        zoom: 11,
        center: new google.maps.LatLng(40.67453, -73.71342),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    //searchbox
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    })

    //cd layer
    loadBaseLayer();
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

    //gym layer
    gymmarkerLayer = new google.maps.Data();
    gymChoroplethLayer = new google.maps.Data();
    gymChoroplethLayer.loadGeoJson('gyms_cd.geojson');
    gymChoroplethLayer.setStyle(styleFeatureGyms);
    gymChoroplethLayer.addListener('mouseover', mouseInToGym);
    gymChoroplethLayer.addListener('mouseout', mouseOutOfGym);


    //restaurant layer
    restaurantMarkerLayer = new google.maps.Data();
    restaurantChoroplethLayer = new google.maps.Data();
    restaurantChoroplethLayer.loadGeoJson('FastFood_cd.geojson');
    restaurantChoroplethLayer.setStyle(styleFeatureRestaurant);
    restaurantChoroplethLayer.addListener('mouseover', mouseInToRestaurant);
    restaurantChoroplethLayer.addListener('mouseout', mouseOutOfRestaurant);

}

function mouseInToGym(e) {
    e.feature.setProperty('state', 'hover');
    document.getElementById('data-label').textContent =
        e.feature.getProperty('GEO_DISPLAY_NAME');
    document.getElementById('data-value').textContent =
        e.feature.getProperty('number_of_gyms').toLocaleString();
    document.getElementById('data-box').style.display = 'block';

}

function mouseOutOfGym(e) {
    e.feature.setProperty('state', 'normal');

}

function mouseInToRestaurant(e) {
    e.feature.setProperty('state', 'hover');
    document.getElementById('data-label').textContent =
        e.feature.getProperty('GEO_DISPLAY_NAME');
    document.getElementById('data-value').textContent =
        e.feature.getProperty('number_of_fast_food').toLocaleString();
    document.getElementById('data-box').style.display = 'block';

}

function mouseOutOfRestaurant(e) {
    e.feature.setProperty('state', 'normal');

}

function styleFeatureRestaurant(feature) {
    var outlineWeight = 0.5,
        zIndex = 1;
    var color = '';
    if (feature.getProperty('number_of_fast_food') < 5.00) {
        color = '#f2f0f7'
    } else if (feature.getProperty('number_of_fast_food') < 6.00) {
        color = '#dadaeb'
    } else if (feature.getProperty('number_of_fast_food') < 7.00) {
        color = '#bcbddc'
    } else if (feature.getProperty('number_of_fast_food') < 8.00) {
        color = '#9e9ac8'
    } else if (feature.getProperty('number_of_fast_food') < 9.00) {
        color = '#807dba'
    } else if (feature.getProperty('number_of_fast_food') < 10.00) {
        color = '#6a51a3'
    } else if (feature.getProperty('number_of_fast_food') < 11.00) {
        color = '#4a1486'
    }
    var outlineWeight = 0.5,
        zIndex = 1;
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

function styleFeatureGyms(feature) {
    var outlineWeight = 0.5,
        zIndex = 1;
    var color = '';
    if (feature.getProperty('number_of_gyms') < 8.00) {
        color = '#feebe2'
    } else if (feature.getProperty('number_of_gyms') < 17.00) {
        color = '#fcc5c0'
    } else if (feature.getProperty('number_of_gyms') < 25) {
        color = '#fa9fb5'
    } else if (feature.getProperty('number_of_gyms') < 45) {
        color = '#f768a1'
    } else if (feature.getProperty('number_of_gyms') < 90) {
        color = '#c51b8a'
    } else { color = '#7a0177' }
    var outlineWeight = 0.5,
        zIndex = 1;
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

function styleFeatureRange(feature) {
    var outlineWeight = 0.5,
        zIndex = 1;
    var color = ''
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
    var low = [1, 69, 54]; // color of smallest datum
    var high = [359, 83, 34]; // color of largest datum
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

    var outlineWeight = 0.5,
        zIndex = 1;
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

function loadBaseLayer() {
    cdLayer = new google.maps.Data();
    var infoWindow = new google.maps.InfoWindow({ position: { lat: 40.67453, lng: -73.71342 } });
    cdLayer.loadGeoJson('gyms_cd.geojson');
    cdLayer.setStyle(cdLayerStyle);

    cdLayer.addListener('click', function(e) {
        totalPop = parseInt(e.feature.getProperty('total_population_cd'));
        infoWindow.close();
        infoWindow = new google.maps.InfoWindow({ position: e.latLng });
        var contentString =
            '<div id="content">' +
            '<h1 id="firstHeading" class="firstHeading">' + e.feature.getProperty('GEO_DISPLAY_NAME') + '</h1>' +
            '<div id="bodyContent">' +
            '<p><b>' + 'Community District Code: ' + '</b>' + e.feature.getProperty('GEO_LABEL') + '</p>' +
            '<p><b>' + 'Total Population: ' + '</b>' + totalPop + '</p>' +
            '<p><b>' + 'Number of Gyms: ' + '</b>' + e.feature.getProperty('number_of_gyms') + '</p>' +
            '<p><b>' + 'Obesity Rate of adult Population: ' + '</b>' + e.feature.getProperty('obesity_cd') + '%</p>' +
            '</div>' +
            '</div>';
        infoWindow.setContent(contentString);
        infoWindow.open(map);

    });
    cdLayer.setMap(map);
}

function cdLayerStyle(feature) {
    var outlineWeight = 0.5,
        zIndex = 1;
    return {
        strokeWeight: outlineWeight,
        zIndex: zIndex,
        fillColor: '#3454b5',
        fillOpacity: 0.20,

    };
}

function gymLayer() {
    markerFlag = true;
    var infoWin = new google.maps.InfoWindow();
    gymmarkerLayer.loadGeoJson('nyc_gyms.geojson', null, function(features) {
        var markers = features.map(function(location) {
            var g = location.getGeometry();
            var infoString =
                '<div id="content">' +
                '<h1 id="firstHeading" class="firstHeading"> Gym: ' + location.j.name + '</h1>' +
                '<div id="bodyContent">' +
                '<p><b>' + 'Address: ' + '</b>' + location.j.formatted_address + '</p>' +
                '<p><b>' + 'Avg. Rating: ' + '</b>' + location.j.rating + '</p>' +
                '<p><b>' + 'Total User Ratings: ' + '</b>' + location.j.user_ratings_total + '</p>' +
                '<p><b>' + 'Zip Code: ' + '</b>' + location.j.zipcode + '</p>' +
                '<p><b>' + 'Borough: ' + '</b>' + location.j.borough + '</p>' +
                '</div>' +
                '</div>';
            var name = location.j.name;
            var marker = new google.maps.Marker({ 'position': g.get(0) });
            google.maps.event.addListener(marker, 'click', function(location) {
                infoWin.setContent(infoString);
                infoWin.open(map, marker);
            })
            return marker;
        });
        markerCluster = new MarkerClusterer(map, markers, { imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m' });
    });
}

function restaurantMarkers() {
    restaurantMarkerFlag = true;
    var infoW = new google.maps.InfoWindow();
    restaurantMarkerLayer.loadGeoJson('nyc_FastFood.geojson', null, function(features) {
        var mrkrs = features.map(function(location) {
            var k = location.getGeometry();
            var infoString =
                '<div id="content">' +
                '<h1 id="firstHeading" class="firstHeading"> Fast Food Chain: ' + location.j.DBA + '</h1>' +
                '<div id="bodyContent">' +
                '<p><b>' + 'Address: ' + '</b>' + location.j.BUILDING + ' ' + location.j.STREET + ', ' + location.j.BORO + '</p>' +
                '<p><b>' + 'Zip Code: ' + '</b>' + location.j.ZIPCODE + '</p>' +
                '<p><b>' + 'Phone: ' + '</b>' + location.j.PHONE + '</p>' +
                '<p><b>' + 'Cuisine: ' + '</b>' + location.j['CUISINE DESCRIPTION'] + '</p>' +
                '<p><b>' + 'Grade: ' + '</b>' + location.j.GRADE + '</p>' +
                '<p><b>' + 'Grade date: ' + '</b>' + location.j['GRADE DATE'] + '</p>' +
                '</div>' +
                '</div>';

            var marker = new google.maps.Marker({ 'position': k.get(0) });
            google.maps.event.addListener(marker, 'click', function(location) {
                infoW.setContent(infoString);
                infoW.open(map, marker);
            })
            return marker;
        });
        restaurantMarkerCluster = new MarkerClusterer(map, mrkrs, { imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m' });
    });
}


function baseLayer(e) {
    valueLayer.setMap(null);
    rangeLayer.setMap(null);
    gymmarkerLayer.setMap(null);
    gymChoroplethLayer.setMap(null);
    restaurantChoroplethLayer.setMap(null);
    if (markerFlag) {
        e.preventDefault();
        e.stopPropagation();
        markerCluster.clearMarkers();
        markerFlag = false;
    }
    if (restaurantMarkerFlag) {
        e.preventDefault();
        e.stopPropagation();
        restaurantMarkerCluster.clearMarkers();
        restaurantMarkerFlag = false;
    }
}

function toggleObesityLayer() {
    /*
    var layers = ['0-10', '10-20', '20-50', '50-100', '100-200', '200-500', '500-1000', '1000+'];
    var colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];
    var legend = document.getElementById('legend');
    for (i = 0; i < layers.length; i++) {
      var layer = layers[i];
      var color = colors[i];
      var item = document.createElement('div');
      var key = document.createElement('span');
      key.className = 'legend-key';
      key.style.backgroundColor = color;
  
      var value = document.createElement('span');
      value.innerHTML = layer;
      item.appendChild(key);
      item.appendChild(value);
      legend.appendChild(item);
    }
  
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
    */
    if (flag) {
        flag = false;
        rangeLayer.setMap(null);
        valueLayer.setMap(map);
    } else {
        flag = true;
        valueLayer.setMap(null);
        rangeLayer.setMap(map);
        //map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
    }
}

function gymChoropleth() {
    gymChoroplethLayer.setMap(map);
}

function restaurantChoropleth() {
    restaurantChoroplethLayer.setMap(map);
}