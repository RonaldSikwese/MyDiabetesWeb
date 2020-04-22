//checkLoginStatus();

const pendingTable = document.querySelector('#pending_table');
const btnDecline = document.querySelector('#btnDecline');
const btnAccept = document.querySelector('#btnAccept');
const notes = document.querySelector('#notes');
const reason = document.querySelector('#reason');
const t = new Date()
const dc = t.toISOString().split('T')[0]

// select doc details + notfication prompts
var docId
var aptDate
var aptTime
var patientId

const today = new Date()
const dateCreated = today.toISOString().split('T')[0]
var appointmentCount = 0

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        getTodayAppointments(user.uid)
    }
})

function getTodayAppointments(uid) {
    db.collection('appointments')
        .where("doctor.id", "==", uid)
        .where("status", "==", "pending")
        .onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added') {
                    if (change.doc.data().date >= dateCreated) {
                        renderAppointment(change.doc);
                    }
                } else if (change.type == 'removed') {
                    let li = aptTable.querySelector('[data-id=' + change.doc.id + ']');
                    pendingTable.removeChild(li);
                }
            });
        }, function(error) {
            alert(error)
        });
}

function renderAppointment(doc) {
    pendingTable.innerHTML +=
        `
        <tr class='table-hover' data-id='${doc.id}'>
            <td>${doc.data().date}</td>
            <td>${doc.data().time}</td>
            <td>${doc.data().patient.givenName} ${doc.data().patient.familyName}</td>
            <td>${doc.data().reason}</td>
            <td>
                <a class="btn-floating waves-effect waves-light green accent-4 modal-trigger" href="#acceptAppointment"
                onclick="setSelectedDoc('${doc.id}', '${doc.data().date}', '${doc.data().time}', '${doc.data().patient.id}')">
                    <i class="material-icons">check</i>
                </a>
                <a class="btn-floating waves-effect waves-light red accent-4 modal-trigger" href="#declineAppointment"
                onclick="setSelectedDoc('${doc.id}', '${doc.data().date}', '${doc.data().time}', '${doc.data().patient.id}')">
                    <i class="material-icons">clear</i>
                </a>
            </td>
        </tr>
        `;
}

function setSelectedDoc(id, ad, at, pId) {
    docId = id
    aptDate = ad
    aptTime = at
    patientId = pId
}

btnDecline.addEventListener('click', e => {
    if (reason.value === '') {
        alert("Give a reason why you are declining")
    } else {

        var aptRef = db.collection('appointments').doc(docId)

        /*db.collection('appointments').doc(docId).set({
            title: doc.data().title
        })*/

        return aptRef.update({
                status: "declined",
                declineReason: reason.value
            })
            .then(function() {

                alert("Appointment declined")
                reason.value = '';

                // create notification
                db.collection('patients').doc(patientId).collection('notifications').add({
                    id: "",
                    type: "appointment",
                    title: "Appointment update",
                    message: "has been cancelled",
                    appointmentDate: aptDate,
                    appointmentTime: aptTime,
                    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
                    read: false
                });

                location.reload()

            })
            .catch(function(error) {
                alert("Failed to decline appointment")
            })
    }

});

btnAccept.addEventListener('click', e => {
    if (notes.value === '') {
        alert("Provide a note for accepting");
    } else {
        var aptRef = db.collection('appointments').doc(docId)

        return aptRef.update({
                status: "accepted",
                notes: notes.value
            })
            .then(function() {

                alert("Appointment accepted")
                notes.value = '';

                // create notification
                db.collection('patients').doc(patientId).collection('notifications').add({
                    id: "",
                    type: "appointment",
                    title: "Appointment update",
                    message: "has been accepted",
                    appointmentDate: aptDate,
                    appointmentTime: aptTime,
                    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
                    read: false
                });

                location.reload()
            })
            .catch(function(error) {
                alert("Failed to accept appointment")
            })
    }

});