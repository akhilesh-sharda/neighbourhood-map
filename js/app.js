var map;

var myPlaceCorrdinates = {
    lat: 19.0760,
    lng: 72.8777
};

var markers = [];


var myWindow = '';



var myViewModel = {
    list: ko.observableArray([]),
    searchQuery: ko.observable(),
    wasError: ko.observable(false),
    ErrMsg: ko.observable(''),



    constructor: function () {
        for (var i in markers) {
            myViewModel.list.push(markers[i].title);
        }
    },

    filter : function (query) {

        myViewModel.list.removeAll();

        for (var j in markers) {

            if (markers[j].title.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                myViewModel.list.push(markers[j].title);
                markers[j].setVisible(true);
            } else {
                markers[j].setVisible(false);
            }
        }


    }

}

function mapNotLoading() {
    myViewModel.wasError(true);
    //console.log("hello");   
    myViewModel.ErrMsg('Map can"t be loaded');
}

function animateCurrentMarker(marker) {
    marker.setIcon('http://maps.google.com/mapfiles/kml/pal2/icon49.png');
    marker.setAnimation(google.maps.Animation.BOUNCE);
}

function get_foursquare_parks() {
    $.ajax({
        url: 'https://api.foursquare.com/v2/venues/search?v=20161016&ll=19.0760%2C%2072.8777&query=park&limit=10&intent=checkin&client_id=TW4L11DUOZSXQVENICB5RLKYQQJIETTU4HS2ZJJIZA5SPNDY&client_secret=APMQ4LWKF3Q0XVLQTIOY0RFIVQT1D3AF1OXR203RP02PQJWL',
        async: true
    }).done(function (response) {
        metadata = response.response.venues;
        console.log(metadata);
        for (var i = 0; i < metadata.length; i++) {
            var marker = new google.maps.Marker({
                title: metadata[i].name,
                position: {
                    lat: parseFloat(metadata[i].location.lat),
                    lng: parseFloat(metadata[i].location.lng)
                },
                map: map,
                animation: google.maps.Animation.DROP,
                addres: metadata[i].location.address
            });
            marker.addListener('click', openInfomationWin2);
            markers.push(marker);
        }
        var Limits = new google.maps.LatLngBounds();
        for (var k in markers) {
            Limits.extend(markers[k].position);
        }
        map.fitBounds(Limits);
        myViewModel.constructor();
    }).fail(function () {
        myViewModel.wasError(true);
        myViewModel.ErrMsg('parks cant be displayed');
    });
}

function openInfomationWin2() {
    openInformationWin(this);
}



function stopCurrentMarker(marker) {
    myWindow.marker.setIcon(null);
    myWindow.marker.setAnimation(null);
}

function openInformationWin(marker) {
    //console.log("hmm");
    if (myWindow.marker !== marker && myWindow.marker !== undefined) {
        stopCurrentMarker(myWindow.marker);
    }
    animateCurrentMarker(marker);
    var content = '<h1>' + ' Name - ' + marker.title + '</h1>';
    content += '<h2>' + ' Address - ' + marker.addres + '</h2>';
    myWindow.marker = marker;
    myWindow.setContent(content);
    myWindow.open(map, marker);
    myWindow.addListener('closeclick', stopCurrentMarker);
}

function open(title) {
    for (var j in markers) {
        if (markers[j].title == title) {
            //myWindow.marker = markers[i];
            openInformationWin(markers[j]);
            return;
        }
    }
}



function beginMap() {
    myViewModel.wasError(false);
    myWindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById('map'), {
        center: myPlaceCorrdinates,
        zoom: 13
    });
    get_foursquare_parks();
}


ko.applyBindings(myViewModel);
myViewModel.searchQuery.subscribe(myViewModel.filter);
//3bcf9f4b92799cec67722ad354259831
