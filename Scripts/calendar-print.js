//  Print.js

// Initialize
$(function () {
    currentYear = qs('year');
    var month = qs('month');

    // Retrieve the Calendar data from local storage
    loadState();
    setEvents();


    if (month != null) {
        $('#main').html('<div id="calendar" class="calendar" />');

        // Attach Full Calendar control
        $('#calendar').fullCalendar({
            header: { left: '', center: 'title', right: '' },
            height: 650,
            year: currentYear,
            month: month,
            eventSources: [events]//, { url: 'http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic', className: 'holiday'}]
        });
    }
    else	// Full Year is default
    {
        for (var i = 0; i < 12; i++) {
            var id = 'calendar-' + i;

            $('#main').append('<div id="' + id + '" class="calendar" />');

            // Attach Full Calendar control
            $('#' + id).fullCalendar({
                header: { left: '', center: 'title', right: '' },
                height: 650,
                year: currentYear,
                month: i,
                eventSources: [events]//, { url: 'http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic', className: 'holiday'}]
            });
        }
    }
    
    // window.print();
});



