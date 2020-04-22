let userId = 'aa';
let userEmail = '';

var firebaseConfig = {
    apiKey: "AIzaSyCTaunzA6xGEFPjzf-6ri2i-iLgqrQwqc4",
    authDomain: "mydiabetesbah-f167d.firebaseapp.com",
    databaseURL: "https://mydiabetesbah-f167d.firebaseio.com",
    projectId: "mydiabetesbah-f167d",
    storageBucket: "mydiabetesbah-f167d.appspot.com",
    messagingSenderId: "96163279916",
    appId: "1:96163279916:web:e8645a6d37b44533fe8d89",
    measurementId: "G-JGFPLSEHFP"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

// Login the user
function loginUser(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function() {
            checkLoginStatusIndex();
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            alert(errorMessage);
            var url = "/index.html";
            window.location.replace(url);
        });
}

// Check if a user os logged in
function checkLoginStatus() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            userId = user.uid;
            userEmail = user.email;

            // check if the doctor has created their profile in the database
            db.collection('doctors').doc(userId).get().then(doc => {
                if (!doc.exists) {
                    alert("You need to create your profile");
                    var url = "/account.html";
                    window.location = url;
                }
            });
        } else {
            var url = "/index.html";
            window.location.replace(url);
        }
    })
}

function checkLoginStatusIndex() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var url = "/home.html";
            window.location.replace(url);

            if (localStorage) {
                localStorage.setItem("uid", user.uid);
            } else {
                $.cookies.set("uid", user.uid);
            }
        } else {
            // do nothing
        }
    });
}