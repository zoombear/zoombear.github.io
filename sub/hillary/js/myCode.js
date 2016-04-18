// Major assumptions:
// Within the json, I am assuming there is only one location per record
// I am assuming I do not need the json to be recalled if the user refreshes the page (and that the data is not dynamic enough to warrant recalling the data on a refresh). If I had more time I would map the saved data to the incoming data object much more carefully
// I am assuming that there is data at the end of this API. I have no adequately handled the behavior if there was no data incoming.
// I did not include adequate error handling in my code, nor did I include tests. This is not acceptable to me for production code even though I overlooked error handling in this code.

// Start Global variables

var columnFields = [{
    id: "Event",
    key: "name"
}, {
    id: "Type",
    key: "templateInfo.title"
}, {
    id: "Date",
    key: "startDate"
}, {
    id: "Start Time",
    key: "startDate"
}, {
    id: "End Time",
    key: "endDate"
}, {
    id: "# Participants",
    key: "participantCount"
}, {
    id: "# Spots Remaining",
    key: "locations[0].numberSpacesRemaining"
}, {
    id: "Attending?",
    key: "attending"
}];

var myGlobalData;
var mymap;

// End Global Variables

window.onload = function() {
	// This is a bit of a hack saving the user's state without utlizing a database backend. 
	// When the page is refreshed, we save the data object and then apply that to our table instead of newly pulled data
    var savedData = localStorage.getItem("previousData");
    myGlobalData = JSON.parse(savedData);

    if (myGlobalData) {
        data = myGlobalData;
        tabulate(myGlobalData, columnFields);
    }
    // If there is no previously saved data from a refresh, then assign the incoming data to globalData
    if (!myGlobalData) {
    	// if there is no previous data, then call for new json
    	// NOTE: If I had more time I would like to modify this so that it would handle dynamic data
    	d3.json('https://s3.amazonaws.com/interview-api-samples/events-results.json', function(error, data) {
		    data = data.events.sort(function(a, b) {
		        a = new Date(a.startDate);
		        b = new Date(b.startDate);
		        return b > a ? -1 : b < a ? 1 : 0;
		    });
	        myGlobalData = data;
	        tabulate(data, columnFields);
        });
    }

    // Initialize Leaflet map
    mymap = L.map('mapId');

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoiem9vbWJlYXIiLCJhIjoidV9FcmVrYyJ9.qpZteu06do4rqLbn3pZJnw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);

};

window.onbeforeunload = function() {
	// Save data object before page refresh
    localStorage.setItem("previousData", JSON.stringify(myGlobalData));
}


// D3 functions
// inspired by these code examples:
// http://bl.ocks.org/emeeks/9357371
// http://stackoverflow.com/questions/26057079/group-a-html-tabulation-from-multidimensional-array-with-data-driven-documents
function tabulate(data, columns) {
    // console.log(data);

    // Target chart div to append table to
	d3.select("#myChart").select("table").remove();

    var table = d3.select('#myChart').append('table')
    var thead = table.append('thead')
    var tbody = table.append('tbody');

    var format = d3.time.format("%Y-%m-%d");

    // append the header row
    thead.append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
        .text(function(column) {
            return column.id;
        });

    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
        .on("click", rowClick);

    // create a cell in each row for each column
    var cells = rows.selectAll('td')
        .data(function(row) {
            return columns.map(function(column) {
                return {
                    column: column.id,
                    value: eval('row.' + column.key),
                    attending: false
                };
            });
        })
        .enter()
        .append('td')
        .text(function(d) {
            if (d.column == 'Date') {
                return (formatDate(new Date(d.value)));
            }
            if (d.column == 'Start Time' || d.column == 'End Time') {
                var thisDate = new Date(d.value);
                return (formatAMPM(thisDate));
            }
            if (d.column == 'Attending?') {
            	if (d.value == true) {
            		return 'Yes'
            	}
            	else {
            		return 'no'
            	}
                // return;
            }
            if (d.column != 'Attending?' && d.value == null) {
                return '-';
            } else
                return d.value;
        });

    return table;
}

// When user clicks on table row, row sends the row index to rowClick to build modal
function rowClick(d, i) {
	// Request leaflet map using lat/lon
    getMap(d.locations[0].latitude, d.locations[0].longitude);

    // Build modal html using data from row click
    var newContent = "<h2>" + d.name + "</h2><h3>Details</h3>" + "<h4>Attending</h4>" + determineClicked(i) + "<h4>Description</h4>" + d.description + "<h4>Cost</h4>" + d.locations[0].tiers[0].description + "<h3>Date/Time</h3>" + formatDate(new Date(d.startDate)) + " " + formatAMPM(new Date(d.startDate)) + " - " + formatAMPM(new Date(d.endDate)) + "<h3>Location</h3>" + formatAddress(d.locations[0].address1, d.locations[0].address2, d.locations[0].city, d.locations[0].state, d.locations[0].country, d.locations[0].postalCode) + "<h3>Contact</h3>" + d.locations[0].contactGivenName + " " + d.locations[0].contactFamilyName;

    // Send html content to modal div
    d3.select("#modal").style("display", "block").select(".modal-info").html(newContent);
}

// //  Begin Data formatting functions

// When user clicks row to get modal, this determines if the checkbox should be checked for attending. 
// NOTE: If I had more time I would definitely make this work under a better "model" type behavior
function determineClicked (i) {
	if (myGlobalData[i].attending == true) {
		return '<input type="checkbox" class = "attending" checked=true onchange="changeAttending(event)" id="v' + i + '">';
	}
	else {
		return '<input type="checkbox" class = "attending" onchange="changeAttending(event)" id="v' + i + '">'
	}
}

// format the address that goes into the table row
function formatAddress(address, address2, city, state, country, zip) {
    var fullAddress = '';
    fullAddress += address;
    if (address2) {
        fullAddress += (' (' + address2 + ')');
    }
    fullAddress += (', ' + city);
    fullAddress += (' ' + state);
    fullAddress += (' ' + zip);
    return fullAddress;
}

// format the time that does into the table row
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

// format the date that does into the table row
function formatDate(date) {
    return (date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear());
}

// Toggle attending true/false on checkbox click
// NOTE: If I had more time I would definitely make this work under a better "model" type behavior
function changeAttending(event) {
	// console.log('changeAttending');
    var thisID = event.target.id.slice(1);
    myGlobalData[thisID].attending = !myGlobalData[thisID].attending;
}

// End data formatting functions


// Leaflet map functions

function getMap(lat, lon) {
    setTimeout(function() { /* Look mah! No name! */
        mymap.setView([(lat * 1.00003), lon], 16, true); // 40.713054,-74.007228

        var hillIcon = L.icon({
            iconUrl: './images/hillaryLogo.png',
            shadowUrl: './images/hillaryLogo.png',

            iconSize: [38, 38], // size of the icon
            shadowSize: [0, 0], // size of the shadow
            iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62], // the same for the shadow
            popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var bounds = mymap.getBounds();
        mymap.fitBounds(bounds);

        L.marker([lat, lon], {
            icon: hillIcon
        }).addTo(mymap);

        L.marker([lat, lon], {
            icon: hillIcon
        }).addTo(mymap).bindPopup("Hope we see you there!");
    }, 10);

}


// If user clicks off the modal then close modal and refresh data table in case of checkbox state change
$(document).click(function(event) {
    if ($(event.target).is('.modal-overlay')) {
        tabulate(myGlobalData, columnFields);
        d3.select('#modal').style('display', 'none');
    }
})
