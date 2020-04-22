// Check for logged in users
checkLoginStatus();

var appointmentPage = 'pending';

if (localStorage) {
    if (localStorage.getItem("appointmentPage") !== null || localStorage.getItem("appointmentPage") === '') {
        appointmentPage = localStorage.getItem("appointmentPage");
    }
} else {
    if ($.cookies.get("appointmentPage") !== null || $.cookies.get("appointmentPage") === '') {
        appointmentPage = $.cookies.get("appointmentPage");
    }
}

// Do these actions when the page just loads
$(document).ready(function() {

    loadDesignatedPage(appointmentPage);
});

// Load pages within the appointment page when an option is selected on the sidebar
function loadPage(pageToLoad) {
    if (pageToLoad === 'pending') {
        $('#appointment-wrapper').load("appointments/pending.html");
    } else if (pageToLoad === 'accepted') {
        $('#appointment-wrapper').load("appointments/accepted.html");
    } else if (pageToLoad === 'declined') {
        $('#appointment-wrapper').load("appointments/declined.html");
    }
}

// called when the page is just loaded
function loadDesignatedPage(appointmentPage) {
    if (appointmentPage == 'pending') {
        $('#appointment-wrapper').load("appointments/pending.html");
    } else if (appointmentPage === 'accepted') {
        $('#appointment-wrapper').load("appointments/accepted.html");
    } else if (appointmentPage === 'declined') {
        $('#appointment-wrapper').load("appointments/declined.html");
    }

    localStorage.setItem("appointmentPage", 'pending');
}