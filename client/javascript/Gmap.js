let map
let icons
let geocoder

function initMap() {
    icons = {
        start: new google.maps.MarkerImage(
            // URL
            'https://i.imgur.com/uIW18Jp.png',
            // (width,height)
            new google.maps.Size(20, 20),
            // The origin point (x,y)
            new google.maps.Point(0, 0),
            // The anchor point (x,y)
            new google.maps.Point(10, 10)),
        end: new google.maps.MarkerImage(
            // URL
            'https://i.imgur.com/uIW18Jp.png',
            // (width,height)
            new google.maps.Size(20, 20),
            // The origin point (x,y)
            new google.maps.Point(0, 0),
            // The anchor point (x,y)
            new google.maps.Point(10, 10)),
        user: {
            url: 'https://media.giphy.com/media/1oF1MaxVOqrgtG4hev/giphy.gif',
            // (width,height)
            scaledSize: new google.maps.Size(80, 80),
            // The origin point (x,y)
            origin: new google.maps.Point(0, 0),
            // The anchor point (x,y)
            anchor: new google.maps.Point(40, 80),
        }
    }

    let jakarta = new google.maps.LatLng(-6.21462, 106.84513)
    map = new google.maps.Map(document.getElementById('map'), {
        center: jakarta,
        styles: mapStyle,
        zoom: 16
    });
    // geocoder = new google.maps.Geocoder()
    // infoWindow = new google.maps.InfoWindow;
    let fBox = document.getElementById('from')
    let tBox = document.getElementById('to')
    let fromBox = new google.maps.places.SearchBox(fBox)
    let toBox = new google.maps.places.SearchBox(tBox)

    map.addListener('bounds_changed', function () {
        fromBox.setBounds(map.getBounds())
        toBox.setBounds(map.getBounds())
    })



    fromBox.addListener(
        'places_changed',
        function () {
            var places = fromBox.getPlaces()
            if (places.length == 0) {
                return
            }
            console.log(places);
            let markers = []
            var bounds = new google.maps.LatLngBounds()
            places.forEach(place => {
                if (!place.geometry) {
                    console.log("no geometry");
                    return
                }
                fromPos = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                startName = place.name
                console.log(fromPos);
                var icon = {
                    url: "https://image.flaticon.com/icons/png/128/149/149060.png",
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(40, 40)
                }
                markers.push(new google.maps.Marker({
                    map,
                    icon,
                    title: place.name,
                    position: place.geometry.location
                }))
                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport)
                } else {
                    bounds.extend(place.geometry.location)
                }
            })
            map.fitBounds(bounds)
        }
    )
    toBox.addListener(
        'places_changed',
        function () {
            var places = toBox.getPlaces()
            if (places.length == 0) {
                return
            }
            console.log(places);
            let markers = []
            var bounds = new google.maps.LatLngBounds()
            places.forEach(place => {
                if (!place.geometry) {
                    console.log("no geometry");
                    return
                }
                console.log(place);
                toPos = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                destName = place.name
                var icon = {
                    url: "https://image.flaticon.com/icons/png/128/149/149060.png",
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(40, 40)
                }
                markers.push(new google.maps.Marker({
                    map,
                    icon,
                    title: place.name,
                    position: place.geometry.location
                }))
                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport)
                } else {
                    bounds.extend(place.geometry.location)
                }
            })
            map.fitBounds(bounds)
        }
    )
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            currentLoc = pos
            map.setCenter(pos);
            var user = new google.maps.Marker({
                position: pos,
                map: map,
                title: 'you',
                icon: icons.user
            })
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}




function displayRoute(location_a, location_b, method, fromName, toName) {
    // also, constructor can get "DirectionsRendererOptions" object
    var directionsService = new google.maps.DirectionsService();
    // directionsDisplay.setMap(map); // map should be already initialized.
    var start = new google.maps.LatLng(location_a.Lat, location_a.Lng);
    var end = new google.maps.LatLng(location_b.Lat, location_b.Lng);
    let strokeColor = ""
    let strokeWeight = 4
    if (method === "DRIVING") {
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING,
        };
        strokeColor = "#E91E63"
    } else if (method === "WALKING") {
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.WALKING,
        };
        strokeColor = "grey"
        strokeWeight = 3
    }
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var directionsDisplay = new google.maps.DirectionsRenderer({
                suppressMarkers: true,
                map: map,
                directions: response,
                polylineOptions: {
                    strokeColor,
                    strokeWeight
                },
                preserveViewport: true
            });
            let route = response.routes[0]
            let leg = response.routes[0].legs[0]
            map.setCenter(route.bounds.getCenter())
            map.setZoom(12)
            makeMarker(leg.start_location, icons.start, fromName, map)
            makeMarker(leg.end_location, icons.end, toName, map)
        } else {
            console.log("unable to retrieve route");
        }
    });
}

function makeMarker(position, icon, title, map) {
    new google.maps.Marker({
        position,
        map,
        icon,
        title
    })
}