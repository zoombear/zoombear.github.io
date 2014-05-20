/*
The following variables contain information about the Fusion Table:

fusionTable contains the unique numeric ID for the Fusion Table containing the data to be displayed (the number can be found in the Fusion Table interface under File-->About)
locationField is the reference to the field intended for displaying the sample locations
stateField is the reference to the field specifying the name of the state each sample falls in (used for filtering)
precisionField is the reference to the field specifying the level of precision for each sample (used for filtering)
sampleField is the reference to the field containing the sample identification numbers from the collection (used for filtering)
speciesField is the reference to the field containing the species name for each sample (used for filtering)

If the Fusion Table needs to be remade or replaced, updating these variables should ensure functionality of the web site with the new table
*/

var fusionTable = '3586759';
var locationField = 'final latitude';
var stateField = 'region/province/state';
var precisionField = 'precision';
var sampleField = 'collection sample number';
var speciesField = 'species';
var plantField = 'scientific name';

//Sets the icon styles for the levels of precision specified in the Fusion Table
//To change precision level icons, refer to the supported icon styles available at http://www.google.com/fusiontables/DataSource?dsrcid=308519
var iconStyle =

	//Sets the style for the data with the lowest level of precision
	[{
		where: precisionField + "= 'State'",
		markerOptions:
		{
			iconName: "small_red"
		}
	},

	//Sets the style for the data with the middle level of precision
	{
		where: precisionField + "= 'City'",
		markerOptions:
		{
			iconName: "measle_turquoise"
		}
	},

	//Sets the style for the data with the highest level of precision
	{
		where: precisionField + "= 'Sub-city'",
		markerOptions:
		{
			iconName: "small_purple"
		}
	}];

//Creates the default Fusion Tables layer for display in the initial Google Map
var layer = new google.maps.FusionTablesLayer({
	query:
	{
		//This specifies the location column/field in the Fusion Table to display
		select: locationField,

		//This tells Google Maps which Fusion Table to display
		from: fusionTable

	},

	//Sets the icon styles based on the level of precision noted in the Fusion Table
	styles: iconStyle

});

//Creates the layer holding the state boundaries for display in the map
/*The URL is the location of the KML file (the complete URL must be provided for the path to work)
PreserveViewport maintains the map center as set in the map options when true
supressInfoWindows hides the info window when true
*/
var stateLayer = new google.maps.KmlLayer('http://www.sjsu.edu/depts/geography/applications/ymexia/downloads/MexStatesLine.kmz', {preserveViewport:true, suppressInfoWindows:true});

/*
When adding data to the arrays for a new location, the data must be in the same position in each array for the location.
For example, the latitude and longitude values for Sinaloa are in the same position [10] as the state's name in the first array.
The value in the [0] position for the three arrays represents Mexico as a whole rather than a specific state.
*/

//Adds a new array containing the names of the states to filter the Fusion Table by
//Spelling must match the spelling of the state in the botanical collection Fusion Table
var filterElements = new Array ();

filterElements[0] = "All";
filterElements[1] = "Chihuahua";
filterElements[2] = "Colima";
filterElements[3] = "Distrito Federal";
filterElements[4] = "Guerrero";
filterElements[5] = "Hidalgo";
filterElements[6] = "Jalisco";
filterElements[7] = "Nayarit";
filterElements[8] = "Oaxaca";
filterElements[9] = "Pueblo";
filterElements[10] = "Sinaloa";

//Adds a new array containing the latitudes of the centroids of the filter states
var filterLats = new Array ();

filterLats[0] = 22.99;
filterLats[1] = 28.8182;
filterLats[2] = 19.1410;
filterLats[3] = 19.2383;
filterLats[4] = 17.6656;
filterLats[5] = 20.4837;
filterLats[6] = 20.5577;
filterLats[7] = 21.7815;
filterLats[8] = 16.9556;
filterLats[9] = 19.0375;
filterLats[10] = 24.9926;

//Adds a new array containing the longitudes of the centroids of the filter states
var filterLons = new Array ();

filterLons[0] = -101.95;
filterLons[1] = -106.4540;
filterLons[2] = -103.9213;
filterLons[3] = -99.0879;
filterLons[4] = -99.8782;
filterLons[5] = -98.8576;
filterLons[6] = -103.6273;
filterLons[7] = -104.8564;
filterLons[8] = -96.4378;
filterLons[9] = -97.8162;
filterLons[10] = -107.4927;

//Adds a new array containing the Google Maps zoom levels of the filter states
var filterZooms = new Array ();

filterZooms[0] = 5;
filterZooms[1] = 7;
filterZooms[2] = 7;
filterZooms[3] = 7;
filterZooms[4] = 7;
filterZooms[5] = 7;
filterZooms[6] = 7;
filterZooms[7] = 7;
filterZooms[8] = 7;
filterZooms[9] = 7;
filterZooms[10] = 7;

/*
Sets the initial map options for how the map will appear when initially loaded
If not specified, the map automatically centers on the data centroid at the appropriate zoom level to display all data
*/
var options =
	{
		zoom: filterZooms[0],
		center: new google.maps.LatLng(filterLats[0],filterLons[0]),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

//Initializes the Google Map with the Fusion Table data and state boundaries
(function()
{
	window.onload = function()
	{

		//Creates the Google Map in the 'map' <div> element in the web page
		var map = new google.maps.Map(document.getElementById('map'), options);

		//Adds the Fusion Tables layer to the Google Map display
		layer.setMap(map);

		//Adds the states KML layer to the Google Map display
		stateLayer.setMap(map);

	}

})();

//Function to permit selecting a specific state and/or precision level to filter the Fusion Table by
function setSelected(theStateForm,thePrecisionForm,theStatusForm)
{

	var theStatus = theStatusForm.elements["state_boundaries"].checked;

	//Makes all available sample points visible if 'All' is selected in both lists
	if(thePrecisionForm.precisions.options[thePrecisionForm.precisions.selectedIndex].value=="All" && theStateForm.states.options[theStateForm.states.selectedIndex].value=="All")
	{

		//Removes existing data from map display
		layer.setMap(null);

		//Creates the Google Map in the 'map' <div> element in the web page
		var map = new google.maps.Map(document.getElementById('map'), options);

		//Selects the Fusion Table data corresponding to the filter state
		var newLayer = new google.maps.FusionTablesLayer({
				query:
				{
					//This specifies the location column/field in the Fusion Table to display
					select: locationField,

					//This tells Google Maps which Fusion Table to display
					from: fusionTable
				},

				//Sets the icon styles based on the level of precision noted in the Fusion Table
				styles: iconStyle

			});

		//Loads the new data selection into the map display
		newLayer.setMap(map);

		if(theStatus==true)
		{
			stateLayer.setMap(map);
		}
		else
		{
			stateLayer.setMap(null);
		}

	}

	//Makes all available sample points for a state visible at all precision levels
	else if(thePrecisionForm.precisions.options[thePrecisionForm.precisions.selectedIndex].value=="All" && theStateForm.states.options[theStateForm.states.selectedIndex].value!="All")
	{

		//Removes existing data from map display
		layer.setMap(null);

		//Identifies the selected state from the menu
		var theState = theStateForm.states.options[theStateForm.states.selectedIndex].value;

		//Identifies the position of the selected state from the list in the identifier array and acquires the corresponding latitude and longitude
		for(i=1;i<filterElements.length;i++)
		{

			if(filterElements[i]==theState)
			{

				var theLat = filterLats[i];
				var theLon = filterLons[i];
				var theZoom = filterZooms[i]

			}

		}

		//Sets the map options for the selected state
		var stateOptions =
		{
			zoom: theZoom,
			center: new google.maps.LatLng(theLat,theLon),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		//Creates the Google Map in the 'map' <div> element in the web page
		var map = new google.maps.Map(document.getElementById('map'), stateOptions);

		//Selects the Fusion Table data corresponding to the filter state
		var newLayer = new google.maps.FusionTablesLayer({
				query:
				{
					//This specifies the location column/field in the Fusion Table to display
					select: locationField,

					//This tells Google Maps which Fusion Table to display
					from: fusionTable,

					//This limits the data from the Fusion Table to be displayed
					where: "'" + stateField + "' MATCHES '" + theState + "'"
				},

				//Sets the icon styles based on the level of precision noted in the Fusion Table
				styles: iconStyle

			});

		//Loads the new data selection into the map display
		newLayer.setMap(map);

		if(theStatus==true)
		{
			stateLayer.setMap(map);
		}
		else
		{
			stateLayer.setMap(null);
		}

	}

	else if(thePrecisionForm.precisions.options[thePrecisionForm.precisions.selectedIndex].value!="All" && theStateForm.states.options[theStateForm.states.selectedIndex].value=="All")
	{

		//Removes existing data from map display
		layer.setMap(null);

		//Identifies the selected precision level from the menu
		var thePrecision = thePrecisionForm.precisions.options[thePrecisionForm.precisions.selectedIndex].value;

		//Creates the Google Map in the 'map' <div> element in the web page
		var map = new google.maps.Map(document.getElementById('map'), options);

		//Selects the Fusion Table data corresponding to the filter precision level
		var newLayer = new google.maps.FusionTablesLayer({
				query:
				{
					//This specifies the location column/field in the Fusion Table to display
					select: locationField,

					//This tells Google Maps which Fusion Table to display
					from: fusionTable,

					//This limits the data from the Fusion Table to be displayed
					where: "'" + precisionField + "' MATCHES '" + thePrecision + "'"
				},

				//Sets the icon styles based on the level of precision noted in the Fusion Table
				styles: iconStyle

			});

		//Loads the new data selection into the map display
		newLayer.setMap(map);

		if(theStatus==true)
		{
			stateLayer.setMap(map);
		}
		else
		{
			stateLayer.setMap(null);
		}

	}

	else
	{

		//Removes existing data from map display
		layer.setMap(null);

		//Identifies the selected state and precision level from the menus
		var theState = theStateForm.states.options[theStateForm.states.selectedIndex].value;
		var thePrecision = thePrecisionForm.precisions.options[thePrecisionForm.precisions.selectedIndex].value;

		//Identifies the position of the selected state from the list in the identifier array and acquires the corresponding latitude and longitude
		for(i=1;i<filterElements.length;i++)
		{

			if(filterElements[i]==theState)
			{

				var theLat = filterLats[i];
				var theLon = filterLons[i];
				var theZoom = filterZooms[i];

			}

		}

		//Sets the map options for the selected state
		var stateOptions =
		{
			zoom: theZoom,
			center: new google.maps.LatLng(theLat,theLon),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		//Creates the Google Map in the 'map' <div> element in the web page
		var map = new google.maps.Map(document.getElementById('map'), stateOptions);

		//Selects the Fusion Table data corresponding to the filter state and precision level
		var newLayer = new google.maps.FusionTablesLayer({
			query:
			{
				//This specifies the location column/field in the Fusion Table to display
				select: locationField,

				//This tells Google Maps which Fusion Table to display
				from: fusionTable,

				//This limits the data from the Fusion Table to be displayed
				where: "'" + stateField + "' MATCHES '" + theState + "' AND '" + precisionField + "' MATCHES '" + thePrecision + "'" 
			},

			//Sets the icon styles based on the level of precision noted in the Fusion Table
			styles: iconStyle

		});

		//Loads the new data selection into the map display
		newLayer.setMap(map);

		if(theStatus==true)
		{
			stateLayer.setMap(map);
		}
		else
		{
			stateLayer.setMap(null);
		}

	}

}

//Function to turn the state boundary KML layer display on and off
function showStates(theStatusForm,theStateForm,thePrecisionForm)
{

	setSelected(theStateForm,thePrecisionForm,theStatusForm);

}

//Function for querying the Fusion Table for a specific botanical sample
function selectSamples(theForm,theList,theStatusForm)
{
	var theSample = theForm.elements["search"].value;
	var theSearch = "";
	var theStatus = theStatusForm.elements["state_boundaries"].checked;
	var searchField = "";

	//Determines the type of search being implemented
	for(i=0;i<theList.length;i++)
	{
		if(theList[i].checked)
		{
			theSearch = theList[i].value;
		}
	}

	//Checks to see if a value has been entered in the text field
	if(theSample=="")
	{

		alert("No sample descriptive value has been entered. Please provide a sample collection number, a plant species, or a plant scientific name to conduct a search.");

	}

	//Checks to see if the value entered in the field falls between 0 and 11000
	else if(theSample<0||theSample>11000)
	{

		alert("The selected collection sample number is outside the collection range.")

	}

	//Selects the specified sample from the Fusion Table
	else
	{

		//Removes existing data from map display
		layer.setMap(null);

		//Creates the Google Map in the 'map' <div> element in the web page
		var map = new google.maps.Map(document.getElementById('map'), options);

		//Sets the appropriate search field for querying the Fusion Table based on the selected search method
		if(theSearch=="sample")
		{
			searchField = sampleField;
		}

		//Additional search options are added here after they are added to the HTML radio button list
		//The search format should follow the format of the else if statement below
		//Global variables containing the Fusion Tables field name should be added at the top of this document
		else if(theSearch=="species")
		{
			searchField = speciesField;
		}

		else
		{
			searchField = plantField;
		}

		//Selects the Fusion Table data corresponding to the filter sample descriptive
		var newLayer = new google.maps.FusionTablesLayer({
			query:
			{
				//This specifies the location column/field in the Fusion Table to display
				select: locationField,

				//This tells Google Maps which Fusion Table to display
				from: fusionTable,

				//This limits the data from the Fusion Table to be displayed
				where: "'" + searchField + "' = '" + theSample + "'"
			},

			//Sets the icon styles based on the level of precision noted in the Fusion Table
			styles: iconStyle

		});

		//Loads the new data selection into the map display
		newLayer.setMap(map);

		if(theStatus==true)
		{
			stateLayer.setMap(map);
		}
		else
		{
			stateLayer.setMap(null);
		}

	}

}

//Function to open secondary web pages (the theUrl parameter inputs) in a new window
function openPage(theUrl)
{

	//The second parameter is the window name, and the third parameter is the specific options (height and width) for the new window
	var theWindow = window.open(theUrl,"aWindow","scrollbars=1,height=500,width=600");

}

//Function for restoring the web page to its default settings and appearance
function reloadPage()
{

	// Reloads web page so all original options and extents are restored
	window.location.reload();

}

/*
Deprecated functions used for developing the final code follow
*/

//Selects the samples for a single identified state
function dChangeMap(theForm)
{

	//Makes all available sample points regardless of precision level visible if 'All' is selected
	if(theForm.states.options[theForm.states.selectedIndex].value=="All")
	{
		layer.setMap(null);

		//Creates the Google Map in the 'map' <div> element in the web page
		var map = new google.maps.Map(document.getElementById('map'), options);

		//Selects the Fusion Table data corresponding to the filter state
		var newLayer = new google.maps.FusionTablesLayer({
				query:
				{
					//This specifies the location column/field in the Fusion Table to display
					select: locationField,

					//This tells Google Maps which Fusion Table to display
					from: fusionTable
				},

				//Sets the icon styles based on the level of precision noted in the Fusion Table
				styles: iconStyle

			});

		newLayer.setMap(map);

	}

	else
	{

		layer.setMap(null);

		var theState = theForm.states.options[theForm.states.selectedIndex].value;

		//Identifies the position of the selected state from the list in the identifier array and acquires the corresponding latitude and longitude
		for(i=1;i<filterElements.length;i++)
		{

			if(filterElements[i]==theState)
			{

				var theLat = filterLats[i];
				var theLon = filterLons[i];
				var theZoom = filterZooms[i];

			}

		}

		//Sets the map options for the selected state
		var stateOptions =
		{
			zoom: theZoom,
			center: new google.maps.LatLng(theLat,theLon),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		//Creates the Google Map in the 'map' <div> element in the web page
		var map = new google.maps.Map(document.getElementById('map'), stateOptions);

		//Selects the Fusion Table data corresponding to the filter state
		var newLayer = new google.maps.FusionTablesLayer({
				query:
				{
					//This specifies the location column/field in the Fusion Table to display
					select: locationField,

					//This tells Google Maps which Fusion Table to display
					from: fusionTable,

					//This limits the data from the Fusion Table to be displayed
					where: "'region/province/state' MATCHES '" + theState + "'"
				},

				//Sets the icon styles based on the level of precision noted in the Fusion Table
				styles: iconStyle

			});

		newLayer.setMap(map);

	}

}

//Selects all samples matching the specified level of precision
function dChangePrecision(theForm)
{

	//Makes all available sample points regardless of precision level visible if 'All' is selected
	if(theForm.precisions.options[theForm.precisions.selectedIndex].value=="All")
	{
		layer.setMap(null);

		//Creates the Google Map in the 'map' <div> element in the web page
		var map = new google.maps.Map(document.getElementById('map'), options);

		//Selects the Fusion Table data corresponding to the filter state
		var newLayer = new google.maps.FusionTablesLayer({
				query:
				{
					//This specifies the location column/field in the Fusion Table to display
					select: locationField,

					//This tells Google Maps which Fusion Table to display
					from: fusionTable
				},

				//Sets the icon styles based on the level of precision noted in the Fusion Table
				styles: iconStyle

			});

		newLayer.setMap(map);

	}

	else
	{
		layer.setMap(null);

		//Determines the selected level of precision to use as a Fusion Table filter
		var thePrecision = theForm.precisions.options[theForm.precisions.selectedIndex].value;

		//Creates the Google Map in the 'map' <div> element in the web page
		var map = new google.maps.Map(document.getElementById('map'), options);

		//Selects the Fusion Table data corresponding to the filter state
		var newLayer = new google.maps.FusionTablesLayer({
				query:
				{
					//This specifies the location column/field in the Fusion Table to display
					select: locationField,

					//This tells Google Maps which Fusion Table to display
					from: fusionTable,

					//This limits the data from the Fusion Table to be displayed
					where: "'precision' MATCHES '" + thePrecision + "'"
				},

				//Sets the icon styles based on the level of precision noted in the Fusion Table
				styles: iconStyle

			});

		newLayer.setMap(map);

	}

}

//Function for querying the Fusion Table for a specific botanical sample
function dSelectSample(theForm,theStatusForm)
{
	var theSample = theForm.elements["sample"].value;
	var theStatus = theStatusForm.elements["state_boundaries"].checked;

	//Checks to see if a value has been entered in the text field
	if(theSample=="")
	{

		alert("No collection sample number has been entered.");

	}

	//Checks to see if the value entered in the field falls between 0 and 11000
	else if(theSample<0||theSample>11000)
	{

		alert("The selected collection sample number is outside the collection range.")

	}

	//Selects the specified sample from the Fusion Table
	else
	{

		//Removes existing data from map display
		layer.setMap(null);

		//Creates the Google Map in the 'map' <div> element in the web page
		var map = new google.maps.Map(document.getElementById('map'), options);

		//Selects the Fusion Table data corresponding to the filter sample
		var newLayer = new google.maps.FusionTablesLayer({
			query:
			{
				//This specifies the location column/field in the Fusion Table to display
				select: locationField,

				//This tells Google Maps which Fusion Table to display
				from: fusionTable,

				//This limits the data from the Fusion Table to be displayed
				where: "'" + sampleField + "' = '" + theSample + "'"
			},

			//Sets the icon styles based on the level of precision noted in the Fusion Table
			styles: iconStyle

		});

		//Loads the new data selection into the map display
		newLayer.setMap(map);

		if(theStatus==true)
		{
			stateLayer.setMap(map);
		}
		else
		{
			stateLayer.setMap(null);
		}

	}

}

//Function for querying the Fusion Table for a specific plant species collected by Ynes Mexia
function dSelectSpecies(theForm,theStatusForm)
{

	var theSample = theForm.elements["species"].value;
	var theStatus = theStatusForm.elements["state_boundaries"].checked;

	//Checks to see if a value has been entered in the text field
	if(theSample=="")
	{

		alert("No sample species has been entered.");

	}

	//Selects the specified sample from the Fusion Table
	else
	{

		//Removes existing data from map display
		layer.setMap(null);

		//Creates the Google Map in the 'map' <div> element in the web page
		var map = new google.maps.Map(document.getElementById('map'), options);

		//Selects the Fusion Table data corresponding to the filter sample
		var newLayer = new google.maps.FusionTablesLayer({
			query:
			{
				//This specifies the location column/field in the Fusion Table to display
				select: locationField,

				//This tells Google Maps which Fusion Table to display
				from: fusionTable,

				//This limits the data from the Fusion Table to be displayed
				where: "'" + speciesField + "' = '" + theSample + "'"
			},

			//Sets the icon styles based on the level of precision noted in the Fusion Table
			styles: iconStyle

		});

		//Loads the new data selection into the map display
		newLayer.setMap(map);

		if(theStatus==true)
		{
			stateLayer.setMap(map);
		}
		else
		{
			stateLayer.setMap(null);
		}

	}

}

//Function for querying the Fusion Table for a specific plant by scientific name collected by Ynes Mexia
function dSelectPlant(theForm,theStatusForm)
{

	var theSample = theForm.elements["plant"].value;
	var theStatus = theStatusForm.elements["state_boundaries"].checked;

	//Checks to see if a value has been entered in the text field
	if(theSample=="")
	{

		alert("No plant sample name has been entered.");

	}

	//Selects the specified sample from the Fusion Table
	else
	{

		//Removes existing data from map display
		layer.setMap(null);

		//Creates the Google Map in the 'map' <div> element in the web page
		var map = new google.maps.Map(document.getElementById('map'), options);

		//Selects the Fusion Table data corresponding to the filter sample
		var newLayer = new google.maps.FusionTablesLayer({
			query:
			{
				//This specifies the location column/field in the Fusion Table to display
				select: locationField,

				//This tells Google Maps which Fusion Table to display
				from: fusionTable,

				//This limits the data from the Fusion Table to be displayed
				where: "'" + plantField + "' = '" + theSample + "'"
			},

			//Sets the icon styles based on the level of precision noted in the Fusion Table
			styles: iconStyle

		});

		//Loads the new data selection into the map display
		newLayer.setMap(map);

		if(theStatus==true)
		{
			stateLayer.setMap(map);
		}
		else
		{
			stateLayer.setMap(null);
		}

	}

}

//Turns the state boundaries on and off, using the settings from the state and precision filters to set the display samples
function dShowStates(theStatusForm,theStateForm,thePrecisionForm)
{

	var theStatus = theStatusForm.elements["state_boundaries"].checked;

	var map = new google.maps.Map(document.getElementById('map'), options);

	if(theStatus==true)
	{
		setSelected(theStateForm,thePrecisionForm);
	}
	else
	{
		setSelected(theStateForm,thePrecisionForm);
		stateLayer.setMap(null);
	}

}