//  Calendar.js


	var allFields = $([]).add($('#eventTitle')).add($('#eventDate'));
	var tips = $(".validateTips");

	
	// Initialize
$(function() 
{
	// Retrieve the Calendar data from local storage
 	loadState();

		
	// Set up Calendar
	setUpCalendar();
	

	// Attach Date Picker
	$( "#eventDate" ).datepicker({dateFormat: "yy-mm-dd"});

	// Attach Edit Dialog
    $("#edit-dialog" ).dialog({
      autoOpen: false,
      width: 350,
      modal: true,
      buttons: 
		{
			"Save": function() { saveEvent(this); },
			Cancel: function() { $(this).dialog("close"); },
			"Delete" : function() { deleteEvent(this); }
		},
      close: function() { allFields.val("").removeClass("ui-state-error"); $('.validateTips').text(''); }
    });

	setupPrintOptionsDialog();
  });
  

// window.localStorage.clear();


	function setUpCalendar()
	{
		currentYear = new Date().getFullYear();
	
		// Set up Calendar
		setCalendars();
		setEvents();
		 
		// Attach Full Calendar control
		$('#calendar').fullCalendar({
			dayClick: function (date) { displayNewEventForm(date); },
			eventClick: function (event) { displayEditEventForm(event); },
			header: { right: 'today prevYear,prev,next,nextYear' },
			height: 700,
			events: events,
			viewRender: function (view, element) 
			{
				var newYear = view.start.getFullYear();
				if (currentYear != newYear)
				{
					currentYear = newYear;
					rebindCalendar();
				}
			}
		});
	}

	function newCalendar()
	{
		var id = getLastIdInArray(calendars) + 1;
		calendars.push({ 'id' : id, 'name' : 'New Calendar', events : [] });
		saveState();
		setCalendars();
	}
	
	function changeCalendar(id)
	{
		c = getIndexInArray(calendars, id);
		saveState();
		setCalendars();
		rebindCalendar();
	}
		
	function editCalendar(id)
	{
		var cal = getObjectFromArray(calendars, id);
		var html = '<input id="calendarName" type="text" value="' + cal.name + '" />';
		html += '<a href="javascript:saveCalendar(\'' + id + '\');">';
		html += '<span class="ui-icon ui-icon-check" style="float:right;" />';
		html += '</a>';
		$('#calendar-' + id).html(html);
		$('#calendarName').keypress(function(event) { if (event.which == 13) {saveCalendar(id);} });
	}
		
	function saveCalendar(id)
	{
		var cal = getObjectFromArray(calendars, id);
		cal.name = $('#calendarName').val();
		saveState();
		setCalendars();
	}
	
	
	function deleteCalendar(id)
	{
		var pos = getIndexInArray(calendars, id);
		calendars.splice(pos, 1);
		if (c >= calendars.length) c = 0;
		saveState();
		setCalendars();
	}
	
	
	function getEvent(id)
	{
		var obj = getObjectFromArray(calendars[c].events, id);
		if (obj != null)
			return obj;
			
		return { 'id' : '', 'title' : '', 'date' : '', 'type' : '' };
	}
		

    function updateTips(t) 
	{
      tips.text(t).addClass("ui-state-highlight");
      setTimeout(function() { tips.removeClass("ui-state-highlight", 1500); }, 500);
    }
 
	
	// Set up list of Calendars
	function setCalendars() 
	{
		var html = '';
		for (var i in calendars)
		{
			var cls = c == i ? 'selected' : '';
			html += '<li id="calendar-' + calendars[i].id + '" class="' + cls + '">';
			html += '<a href="javascript:changeCalendar(\'' + calendars[i].id + '\');">' + calendars[i].name + '</a>';
			html += '<a href="javascript:deleteCalendar(\'' + calendars[i].id + '\');"><span class="ui-icon ui-icon-trash edit-icon"" /></a>';
			html += '<a href="javascript:editCalendar(\'' + calendars[i].id + '\');"><span class="ui-icon ui-icon-pencil edit-icon"" /></a>';
			html += '</li>';
			
		}
		$('#calendar-list').html(html);
		
		// Set the displayed name of the current calendar
		$('#calendar-name').html(calendars[c].name);
	}
	
	
	//
	//  Print Options Dialog
	//
	function setupPrintOptionsDialog()
	{
		$('#print-range-year').click(function(){ $('#print-month').prop('disabled', true); });
		$('#print-range-month').click(function(){ $('#print-month').prop('disabled', false); });
		
		// Attach Print Dialog
		$("#print-options-dialog" ).dialog({
		  autoOpen: false,
		  width: 350,
		  modal: true,
		  buttons: 
			{
				"Print": function() { printCalendar(this); },
				Cancel: function() { $(this).dialog("close"); }
			}
		});
	}

	function openPrintDialog()
	{
		$('#print-options-dialog').dialog('open');
	}

	function printCalendar()
	{
		$('#print-options-dialog').dialog('close');
		var range = $('#print-range-month').prop('checked') == true ? '&month=' + $('#print-month').val() : '';
		window.open('print.html?year=' + $('#print-year').val() + range);
	}
	

	//
	//  Opens the New Event Form dialog and populates the selected date
	//
	function displayNewEventForm(date)
	{
		$('#edit-dialog').dialog('open');
		$('#eventDate').val(getDate(date));
		$('#eventId').val('');
		$('#eventTitle').val('');
		$('#etBirthday').prop('checked', true);
	}

	function deleteEvent(dlg)
	{
		var id = $('#eventId').val();
		var pos = getIndexInArray(calendars[c].events, id);
		calendars[c].events.splice(pos, 1);
		saveState();
		rebindCalendar();
		$(dlg).dialog("close");		
	}
		
	function saveEvent(dlg)
	{
		var bValid = true;
		//$('#edit-dialog input').removeClass("ui-state-error");
		allFields.removeClass("ui-state-error");
		
		bValid = bValid && checkLength($('#eventTitle'), "Name", 2, 25);
		bValid = bValid && checkRegexp($('#eventTitle'), /^[a-z]([0-9a-z_ &])+$/i, "Name may consist of a-z, 0-9, underscores, begin with a letter.");

		if ( bValid ) 
		{
            // a - anniversary, h - holiday, b - birthday
		    var type = $('#etAnniversary').prop('checked') ? 'a' : $('#etHoliday').prop('checked') ? 'h' : 'b';
			saveEventInCalendar($('#eventId').val(), $('#eventTitle').val(), $('#eventDate').val(), type);
			rebindCalendar();
			$(dlg).dialog("close");
		}
	}
	
	
	function saveEventInCalendar(id, title, date, type)
	{
		if (id == '')
		{
			id = getLastEventId() + 1;
			calendars[c].events.push({ 'id' : id, 'title' : title, 'date' : date, 'type' : type });	
		}
		else
		{
			var ev = getEvent(id);
			ev.title = title;
			ev.date = date;
			ev.type = type;
		}

		saveState();
	}
	
	
	function getLastEventId()
	{
		var hid = 0;
		var ev = calendars[c].events;
		for (var x in ev)
		{
			if (ev[x].id > hid)
				hid = ev[x].id;
		}
		return parseInt(hid);
	}

	
	//
	//  Opens the Edit Event Form dialog and populates data from the selected Event
	//
	function displayEditEventForm(event)
	{
		$("#edit-dialog").dialog("open");
		ev = getEvent(event.id);
		
		$('#eventId').val(ev.id);
		$('#eventTitle').val(ev.title);
		$('#eventDate').val(ev.date);

		switch (ev.type) {
		    case 'a':
		        $('#etAnniversary').prop("checked", true);
		        break;
		    case 'h':
		        $('#etHoliday').prop("checked", true);
		        break;
		    default:
		        $('#etBirthday').prop("checked", true);
		}
	}
	
	
	function rebindCalendar()
	{
		$('#calendar').fullCalendar('removeEventSource', events);
		setEvents();
		$('#calendar').fullCalendar('addEventSource', events);
	}
