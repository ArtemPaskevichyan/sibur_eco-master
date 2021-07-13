
var markers_array = [[43, 39], [44, 39]];
var features;
var geojson;

var hubId;
var groundPH;
var waterPPM;
var waterOpacity;
var waterSalt;
var waterPH;
var airPM25;
var airPPM;
var hubLat;
var hubLng;

// var sensorsArray0;
// var sensorsArray1;
// var sensorsArray2;
// var sensorsArray3;
// var sensorsArray4;
// var sensorsArray5;
// var sensorsArray6;

window.onload = function() {

    mapboxgl.accessToken = 'pk.eyJ1IjoieXl5YXNoIiwiYSI6ImNrcGNncWt6OTE5ZTkyb3Q3OG5hMG85aDkifQ.hnhxUbd6VyLT0HJUzcvosg'; // Токен

    var map = new mapboxgl.Map({                        // Создание и настройки карты
        container: 'map',
        style: 'mapbox://styles/mapbox/outdoors-v11',
        center: [39.964975, 43.399896], // начальная позиция [lng, lat]
        zoom: 15                        // начальное увеличение
    });

    map.doubleClickZoom.disable();                              // убрать приближение при двойном нажатии
    map.touchZoomRotate.disableRotation();                      // отключить вращение карт

    function addMarker(mlat, mlng) {                      // Добавление маркеров

        var markSt = document.createElement('div');
        markSt.className = 'marker';

        marker = new mapboxgl.Marker(markSt,{
            color: "#000000",
            draggable: false
        }).setLngLat([mlng, mlat]).addTo(map);
    }

    // map.on('mousemove', function(e) {                   // записать информацию в info
    //     document.getElementById('info').innerHTML = e.lngLat.wrap();
    //     mcoords = e.lngLat.wrap();
    // });

    //addMarkerFromArray();

    function addMarkerFromArray(){
        for (var i = 0; i < markers_array.length; i++) {
            var lat = markers_array[i][0];
            var lng = markers_array[i][1];
            addMarker(lat, lng);
        }
    }

    function addPopup(mlat, mlng){
        var popup = new mapboxgl.Popup({ closeOnClick: false }).setLngLat([lng, mlat]).setHTML('<h1>Hello World!</h1>').addTo(map);
    }

    // function toGeojson(){
    //     features = {
    //                     "type": "Feature",
    //                     "properties": {
    //                       "description": "<strong>Make it Mount Pleasant</strong>",
    //                       "icon": "leave"
    //                     },
    //                     "geometry": {
    //                       "type": "Point",
    //                       "coordinates": [39.964975, 43.399896]
    //                     }
    //             };

    //             geojson = {
    //               "type": "geojson",
    //               "data": {
    //                 "type": "FeatureCollection",
    //                 "features": [features]
    //               }
    //             };

    //             console.log(geojson)
    // }

    // toGeojson();


    function toGeojson(MhubId, MgroundPH, MwaterPPM, MwaterOpacity, MwaterSalt, MwaterPH, MairPM25, MairPPM, hubLat, hubLng){
        features = {
                        "type": "Feature",
                        "properties": {
//                          "description": "<strong>HUB " + MhubId +"</strong>" + "<p> groundPH: " + MgroundPH + "</p>" + "<p> waterPPM: " + MwaterPPM + "</p>" + "<p> waterOpacity: " + MwaterOpacity + "</p>" + "<p> waterSalt: " + MwaterSalt + "</p>" + "<p> waterPH: " + MwaterPH + "</p>" + "<p> airPM25: " + MairPM25 + "</p>" + "<p> airPPM: " + MairPPM + "</p>",
                          "description": `
                            <div class="popupWin">
                                <p class="popupText">HUB ${MhubId}</p>
                                <p>groundPH: ${MgroundPH}</p>
                                <div class="splitter"></div>
                                <p>waterPPM: ${MwaterPPM}</p>
                                <div class="splitter"></div>
                                <p>waterOpacity: ${MwaterOpacity}</p>
                                <div class="splitter"></div>
                                <p>waterSalt: ${MwaterSalt}</p>
                                <div class="splitter"></div>
                                <p>waterPH: ${MwaterPH}</p>
                                <div class="splitter"></div>
                                <p>airPM25: ${MairPM25}</p>
                                <div class="splitter"></div>
                                <p>airPPM: ${MairPPM}</p>
                            </div>
                            <input type="submit" name="moveButton" value="Перейти" class="moveButton">`,
                          "icon": "leave"
                        },
                        "geometry": {
                          "type": "Point",
                          "coordinates": [hubLng, hubLat]
                        }
                };

                geojson = {
                  "type": "geojson",
                  "data": {
                    "type": "FeatureCollection",
                    "features": [features]
                  }
                };

                console.log(geojson)
    }

    toGeojson('1', sensorsArray0, sensorsArray1, sensorsArray2, sensorsArray3, sensorsArray4, sensorsArray5, sensorsArray6, '43.399896', '39.964975');

    map.on('load', function () { 

        map.loadImage('https://digitalskies.ru/static/imgs/leave.png', function(error, image){
        // map.loadImage('https://w7.pngwing.com/pngs/457/630/png-transparent-location-logo-location-computer-icons-symbol-location-miscellaneous-angle-heart-thumbnail.png', function(error, image){
            if (error) throw error;
            map.addImage('leave', image);
        });

        map.addSource('places', geojson);

    map.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'places',
        'layout': {
            'icon-image': '{icon}',
            'icon-size': 1.1,
            'icon-allow-overlap': true
        }
    });

    map.on('click', 'places', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'places', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'places', function () {
        map.getCanvas().style.cursor = '';
    });
});

}




// Documentation: https://docs.mapbox.com/mapbox-gl-js/api/markers/