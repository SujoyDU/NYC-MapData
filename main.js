function initMap() {
    // The location of Uluru
    var centerMap = {lat: 40.7128, lng: -74.0060};
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 10, center:centerMap });
        // The marker, positioned at Uluru
        var marker = new google.maps.Marker({position: centerMap, map: map});
}