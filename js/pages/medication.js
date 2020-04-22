// Check for logged in users
checkLoginStatus();

const medicineName = document.querySelector('#name');
const description = document.querySelector('#description');
const medicineTable = document.querySelector('#medicine-table');
const addButton = document.querySelector('#btnAdd');

// Get drugs from the database and always look for them

// Add drug to firebase website
addButton.addEventListener('click', e => {
    if (medicineName.value === '' || description.value === '') {
        alert("Make sure you fill in fields");
    } else {
        db.collection('medicine').add({
            name: medicineName.value,
            description: description.value
        });

        medicineName.value = '';
        description.value = '';
    }

});

// real-time listener
db.collection('medicine').orderBy('name').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderMedicine(change.doc);
        } else if (change.type == 'removed') {
            let li = medicineTable.querySelector('[data-id=' + change.doc.id + ']');
            medicineTable.removeChild(li);
        }
    });
});

// update the ui
function renderMedicine(doc) {
    medicineTable.innerHTML +=
        `
        <tr data-id='${doc.id}'>
            <td>${doc.data().name}</td>
            <td class='grey-text text-darken-2'>${doc.data().description}</td>
            <td class='right'>
                <a class="btn-floating waves-effect waves-light red accent-4 btnDeleteMedicine" onclick="deleteDoc('${doc.id}')">
                    <i class="material-icons">clear</i>
                </a>
            </td>
        </tr>
        `;
}

// delete a document from the list
function deleteDoc(docId) {
    db.collection('medicine').doc(docId).delete();
}