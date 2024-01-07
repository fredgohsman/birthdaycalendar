//  Print.js

var calendars = [ { id : 1, name : 'Pat Gohsman', events : [ { id : 1, title : 'Balapriya', date : '1979-09-01', type : 'b' } ] } ];
var events = [];
var currentYear = '';
var c = 0;


function saveState()
{
	window.localStorage.selectedCalendarId = calendars[c].id;
	window.localStorage.Calendars = JSON.stringify(calendars);
}


function loadState()
{
	var cals = window.localStorage.Calendars;
	var id = window.localStorage.selectedCalendarId;
	
	// If there was something already saved, then return it
	if (cals != undefined && cals != 'undefined' && cals != '[object Object]')
		calendars = JSON.parse(cals);
	else
		saveState();
	
	// Get the calendar index
	if (id != undefined && id != 'undefined')
		c = getIndexInArray(calendars, id);
	else
		c = 0;
}
	

function getDate(date)
{
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();

	var strDate = year + '-' + month + '-' + day;
	return strDate;
}

	
// Create the display title
function getTitle(value, calYear)
{
	var years = calYear - parseInt(value.date.substring(0,4));

	switch (value.type) {
	    case 'a':
	        return value.title + '\'s ' + years + ' year Anniversary';
	    case 'b':
	        return value.title + ' is ' + years;
	    default:
	        return value.title;
	}
}


function setEvents()
{
	events = json_to_array(calendars[c].events, currentYear);
}


function json_to_array(jsonArray, year)
{
	var eventsArray = $.map(jsonArray, function(value, key) 
	{
		var id = value.id;
		var title = getTitle(value, year);
		var start = year + value.date.substring(4);
		var className = value.type == 'a' ? 'anniversary' : value.type == 'h' ? 'holiday' : 'birthday';
		return { 'id' : id, 'title': title, 'start': start, 'className': className }; 
	});
	return eventsArray;
}


function checkLength( o, n, min, max ) 
{
	if ( o.val().length > max || o.val().length < min ) 
	{
		o.addClass( "ui-state-error" );
		updateTips(n + " must be between " + min + " and " + max + " characters." );
		return false;
	} 
	else 
	{
		return true;
	}
}


function checkRegexp( o, regexp, n ) 
{
	if ( !( regexp.test( o.val() ) ) ) 
	{
		o.addClass("ui-state-error");
		updateTips(n);
		return false;
	} 
	else 
	{
		return true;
	}
}
	

function getLastIdInArray(arr)
{
	var hid = 0;
	for (var i in arr)
	{
		if (arr[i].id > hid)
			hid = arr[i].id;
	}
	return parseInt(hid);
}


function getObjectFromArray(arr, id)
{
	for (var i in arr)
	{
		if (id == arr[i].id)
			return arr[i];
	}
}


function getIndexInArray(arr, id)
{
	for (var i in arr)
	{
		if (id == arr[i].id)
			return i;
	}
	return arr.length;
}


function qs(key) 
{
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}	