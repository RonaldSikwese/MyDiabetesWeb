const firstName = document.querySelector('#first_name');
const otherName = document.querySelector('#other_name');
const lastName = document.querySelector('#last_name');
const email = document.querySelector('#email');
const gender = document.querySelector('#gender');
const btnSave = document.querySelector('#btnSave');
const btnCancel = document.querySelector('#btnCancel');

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        userId = user.uid;
        userEmail = user.email;

        email.value = userEmail;
        // check if the doctor has created their profile in the database
        db.collection('doctors').doc(userId).get().then(doc => {
            if (!doc.exists) {
                alert("No profile found");
            } else {
                firstName.value = doc.data().firstName;
                otherName.value = doc.data().middleName;
                lastName.value = doc.data().lastName;
            }
        });
    } else {
        var url = "/index.html";
        window.location.replace(url);
    }
});

btnCancel.addEventListener('click', e => {
    window.history.back()
});

btnSave.addEventListener('click', e => {
    // add user to firebase
    if (firstName.value === '' || lastName.value === '') {
        alert('Fill in all fields')
    } else {
        db.collection('doctors').doc(userId).set({
                firstName: firstName.value,
                middleName: otherName.value,
                lastName: lastName.value,
                email: email.value,
                gender: gender.options[gender.selectedIndex].text
            })
            .then(function() {
                alert('Saved');
                window.history.back()
            })
            .catch(function() {
                alert('Something went wrong!')
            });
    }
});