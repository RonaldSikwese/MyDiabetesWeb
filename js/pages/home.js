// Check for logged in users
checkLoginStatus();

const aptTable = document.querySelector('#apt_table');

const today = new Date()
const dateCreated = today.toISOString().split('T')[0]
var pendingCount = document.querySelector('#pending_apt');
//var acceptedCount = document.querySelector('#apt_table');
//var declinedCount = document.querySelector('#apt_table');

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        getTodayAppointments(user.uid)
            //checkPending(user.uid)
    }
})

function getTodayAppointments(uid) {
    db.collection('appointments')
        .where("doctor.id", "==", uid)
        .where("date", "==", dateCreated)
        .where("status", "==", "accepted")
        .onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added') {
                    renderAppointment(change.doc);
                } else if (change.type == 'removed') {
                    let li = aptTable.querySelector('[data-id=' + change.doc.id + ']');
                    aptTable.removeChild(li);
                }
            });
        }, function(error) {
            alert(error)
        });
}


function checkPending(uid) {
    db.collection('appointments')
        .where("doctor.id", "==", uid)
        .where("date", "==", dateCreated)
        .where("status", "==", "pending")
        .onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            if (changes.type === "added") {
                alert("")
            }
        }, function(error) {
            alert(error)
        });
}

function renderAppointment(doc) {
    aptTable.innerHTML +=
        `
        <tr class='table-hover' data-id='${doc.id}' class='collection-item'>
            <td>${doc.data().patient.givenName} ${doc.data().patient.familyName}</td>
            <td>${doc.data().time}</td>
            <td>${doc.data().reason}</td>
        </tr>
        `;
}

function appointmentDetailView() {

}

// For appointments
function setAppointmentPage(pageToLoad) {
    var appointmentPage = pageToLoad;
    if (localStorage) {
        localStorage.setItem("appointmentPage", appointmentPage);
    } else {
        $.cookies.set("appointmentPage", appointmentPage);
    }
    window.location = '../appointment.html';
}