// Default Google Map Options


if (Object.is(localStorage.disasterMapOptions, undefined)) {
    localStorage.disasterMapOptions = '{}'
}

disasterMapOptions = JSON.parse(localStorage.disasterMapOptions);

function saveOptions() {
    localStorage.disasterMapOptions = JSON.stringify(disasterMapOptions);
}

if (Object.entries(disasterMapOptions).length === 0) {
    disasterMapOptions = {
        zoom: 15,
        center: {
            lat: 42.7284,
            lng: -73.6918
        }
    }
    saveOptions()
}


// Create a map object using the Google Maps API
var map = new google.maps.Map(document.getElementById("map-canvas"), disasterMapOptions);

map.addListener('center_changed', function() {
    disasterMapOptions.center = map.getCenter();
    saveOptions()
});

map.addListener('zoom_changed', function() {
    disasterMapOptions.zoom = map.getZoom();
    saveOptions()
});

// Create the Gmaps Heatmap Layer
var heatmap = new HeatmapOverlay(map,
    {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        radius: 80,
        maxOpacity: 1,
        // scales the radius based on map zoom
        scaleRadius: false,
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries
        //   (there will always be a red spot with useLocalExtremas true)
        useLocalExtrema: true,
        // which field name in your data represents the data value - default "value"
        valueField: 'count'
    }
);

var markers = [];

function reloadPoints() {
    //Make an asynchronous call to load data about the victims
    $.getJSON('https://openwhisk.ng.bluemix.net/api/v1/web/Disaster-Assist_dev/default/disaster-map-backend.json', {}, function (res) {
        //Set the dataset for the heatmap to the result of the call to the backend
        heatmap.setData({
                            max: 8,
                            data: res.body
                        });

        //Calculate the average latitude and longitude so that we can center the map
        // on an area that matters
        // var avgs = res.body.reduce(function (accumulator, datum) {
        //     return {
        //         lat: accumulator.lat + datum.lat / res.body.length,
        //         lng: accumulator.lng + datum.lng / res.body.length
        //     };
        // }, {
        //     lat: 0,
        //     lng: 0
        // });

        //Center the map on the average latitute and longitude
        // map.setCenter(avgs);


        //==== Cluster Markers ====
        function reloadMarkers() {


            $.getJSON('https://openwhisk.ng.bluemix.net/api/v1/web/Disaster-Assist_dev/default/disaster-clustering.json', {}, function (res) {

                markers.forEach(function (marker) {
                    marker.setMap(null);
                });
                markers = [];

                res.clusters.forEach(cluster => {
                    markers.push(new google.maps.Marker({
                                                            position: {
                                                                lat: cluster.location.latitude,
                                                                lng: cluster.location.longitude
                                                            },
                                                            map: map,
                                                            title: 'Event'
                                                        }));
                });
            });
        }
        reloadMarkers();
    });

}

var runReload = function() {
    reloadPoints()
    if (window.location.hash === "#reload") {
        setTimeout(runReload, 1000)
    }
};

$(() => {
    runReload()
});

