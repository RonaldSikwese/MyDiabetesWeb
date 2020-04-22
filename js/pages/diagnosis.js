// Check for logged in users
checkLoginStatus();

/*const patientList = document.querySelector('#patient-list');

// create element and render patients
function renderPatients(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().givenName + ' ' + doc.data().familyName;

    li.appendChild(name);

    patientList.appendChild(li);
}

db.collection('patients').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderPatients(doc);
    });
});*/