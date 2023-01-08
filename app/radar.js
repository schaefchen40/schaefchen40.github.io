window.onload = function () {
    console.log('Dokument geladen');

    // var urlScript = './style.js';
    // function dynamicallyLoadScript(url) {
    //     var script = document.createElement("script"); //Make a script DOM node
    //     script.src = url; //Set it's src to the provided URL
    //     document.head.appendChild(script); //Add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
    // }  
    // dynamicallyLoadScript(urlScript);

    /**
     * Depending on the time of day, the basemap 
     * is darker or lighter
     */
    var currentTime = new Date().getHours();
    var basemaps = ['Gray', 'DarkGray', 'Streets', 'Physical', 'Topographic'];
    var basemap;

    if (0 <= currentTime && currentTime < 7) {
        basemap = basemaps[1];
    }
    if (7 <= currentTime && currentTime < 18) {
        basemap = basemaps[0];
    }
    if (18 <= currentTime && currentTime < 24) {
        basemap = basemaps[1];
    }
    var grayscale = L.esri.basemapLayer(basemap),
        topo = L.esri.basemapLayer(basemaps[4]);

    /**
     * Display markers for the three differen cities (see data.js)
     */
    var hopfgarten = L.marker([47.45, 12.17]).bindPopup('Hopfgarten i. Br.'),
        innsbruck = L.marker([47.27, 11.39]).bindPopup('Innsbruck (Innenstadt)'),
        lermoos = L.marker([47.4, 10.88]).bindPopup('Lermoos');

    var cities = L.layerGroup([hopfgarten, innsbruck, lermoos]);

    var map = L.map('mapid', {
        center: [46.0, 10.016667],
        zoom: 6,
        layers: [grayscale, cities]
    });

    var overlayMaps = {
        "Cities": cities
    };

    var baseMaps = {
        "Grayscale": grayscale,
        "Topographic": topo
    };

    var overlayMaps = {
        "Cities": cities
    };

    L.esri.basemapLayer(basemap).addTo(map); //Gray, DarkGray, Streets, Physical, Topographic, https://esri.github.io/esri-leaflet/api-reference/layers/basemap-layer.html
    L.control.layers(baseMaps, overlayMaps).addTo(map);

    /**
    * RainViewer radar animation part
    * @type {number[]}
    */
    var timestamps = [];
    var radarLayers = [];
    var animationPosition = 0;
    var animationTimer = false;

    /**
     * Load actual radar animation frames timestamps from RainViewer API
     */
    var apiRequest = new XMLHttpRequest();
    apiRequest.open("GET", "https://tilecache.rainviewer.com/api/maps.json", true);
    apiRequest.onload = function (e) {
        // save available timestamps and show the latest frame: "-1" means "timestamp.lenght - 1"
        timestamps = JSON.parse(apiRequest.response);
        showFrame(-1);
    };
    apiRequest.send();

    /**
     * Animation functions
     * @param ts
     */
    function addLayer(ts) {
        if (!radarLayers[ts]) {
            radarLayers[ts] = new L.TileLayer('https://tilecache.rainviewer.com/v2/radar/' + ts + '/256/{z}/{x}/{y}/2/1_1.png', {
                tileSize: 256,
                opacity: 0.0001,
                zIndex: ts
            });
        }
        if (!map.hasLayer(radarLayers[ts])) {
            map.addLayer(radarLayers[ts]);
        }
    }

    /**
     * Display particular frame of animation for the @position
     * If preloadOnly parameter is set to true, the frame layer only adds for the tiles preloading purpose
     * @param position
     * @param preloadOnly
     */
    function changeRadarPosition(position, preloadOnly) {
        while (position >= timestamps.length) {
            position -= timestamps.length;
        }
        while (position < 0) {
            position += timestamps.length;
        }
        var currentTimestamp = timestamps[animationPosition];
        var nextTimestamp = timestamps[position];
        addLayer(nextTimestamp);
        if (preloadOnly) {
            return;
        }
        animationPosition = position;
        if (radarLayers[currentTimestamp]) {
            radarLayers[currentTimestamp].setOpacity(0);
        }
        radarLayers[nextTimestamp].setOpacity(100);
        document.getElementById("timestamp").innerHTML = (new Date(nextTimestamp * 1000)).toString();

    }

    /**
     * Check avialability and show particular frame position from the timestamps list
     */
    function showFrame(nextPosition) {
        var preloadingDirection = nextPosition - animationPosition > 0 ? 1 : -1;
        changeRadarPosition(nextPosition);
        // preload next next frame (typically, +1 frame)
        // if don't do that, the animation will be blinking at the first loop
        changeRadarPosition(nextPosition + preloadingDirection, true);
    }

    /**
     * Stop the animation
     * Check if the animation timeout is set and clear it.
     */
    document.getElementById('rwd').onclick = function back() {
        showFrame(animationPosition - 1)
        stop();
    }
    document.getElementById('fwd').onclick = function forward() {
        showFrame(animationPosition + 1)
        stop();
    }
    function stop() {
        if (animationTimer) {
            clearTimeout(animationTimer);
            animationTimer = false;
            return true;
        }
        return false;
    }
    function play() {
        showFrame(animationPosition + 1);
        // Main animation driver. Run this function every 500 ms
        animationTimer = setTimeout(play, 500);
    }
    document.getElementById('plst').onclick = function playStop() {
        if (!stop()) {
            play();
        }
    }
}