// Default Google Map Options
var myOptions = {
    zoom: 7
};

// Create a map object using the Google Maps API
var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

// Create the Gmaps Heatmap Layer
var heatmap = new HeatmapOverlay(map,
    {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        radius: 0.1,
        maxOpacity: 1,
        // scales the radius based on map zoom
        scaleRadius: true,
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries
        //   (there will always be a red spot with useLocalExtremas true)
        useLocalExtrema: true,
        // which field name in your data represents the data value - default "value"
        valueField: 'count'
    }
);

//Make an asynchronous call to load data about the victims
$.getJSON('mocks/victims.json', {}, function (data) {
    //Set the dataset for the heatmap to the result of the call to the backend
    heatmap.setData({
        max: 8,
        data: data
    });

    //Calculate the average latitude and longitude so that we can center the map
    // on an area that matters
    var avgs = data.reduce(function (accumulator, datum) {
        return {
            lat: accumulator.lat + datum.lat / data.length,
            lng: accumulator.lng + datum.lng / data.length
        };
    }, {
        lat: 0,
        lng: 0
    });

    //Center the map on the average latitute and longitude
    map.setCenter(avgs);
});