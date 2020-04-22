// get documents ready with the website
$(document).ready(function() {

    $('#nav-placeholder').load("/content/navigation.html");

    $('.dropdown-trigger').dropdown();
    $('.modal').modal();
    $('.sidenav').sidenav();
    $('select').formSelect();
});

// function to show password
function showPassword() {
    var x = document.getElementById("userPassword");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

/*----- function for the navbar --------*/
function logOut() {
    firebase.auth().signOut()
        .then(function() {
            checkLoginStatus();
        })
        .catch(function(error) {
            // An error happened
        });
}

/*----- index.html ------*/