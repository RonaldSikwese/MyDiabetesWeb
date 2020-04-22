// Check for logged in users
checkLoginStatus();

const exerciseName = document.querySelector('#name');
const duration = document.querySelector('#duration');
const calories = document.querySelector('#calories');
const description = document.querySelector('#description');
const exerciseTable = document.querySelector('#exercise-table');
const addButton = document.querySelector('#btnAdd');

// Get drugs from the database and always look for them

// Add drug to firebase website
addButton.addEventListener('click', e => {
    if (exerciseName.value === '' || duration.value === '' || calories.value === '' ||
        description.value === '') {
        alert("Make sure you fill in fields");
    } else {
        db.collection('exercises').add({
            name: exerciseName.value,
            duration: duration.value,
            calories: calories.value,
            description: description.value
        });

        exerciseName.value = '';
        duration.value = '';
        calories.value = '';
        description.value = '';
    }

});

// real-time listener
db.collection('exercises').orderBy('name').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderMedicine(change.doc);
        } else if (change.type == 'removed') {
            let li = exerciseTable.querySelector('[data-id=' + change.doc.id + ']');
            exerciseTable.removeChild(li);
        }
    });
});

// update the ui
function renderMedicine(doc) {
    exerciseTable.innerHTML +=
        `
        <tr data-id='${doc.id}'>
            <td>${doc.data().name}</td>
            <td>${doc.data().duration}</td>
            <td>${doc.data().calories}</td>
            <td class='grey-text text-darken-2'>${doc.data().description}</td>
            <td class='right'>
                <a class="btn-floating waves-effect waves-light red accent-4" onclick="deleteDoc('${doc.id}')">
                    <i class="material-icons">clear</i>
                </a>
            </td>
        </tr>
        `;
}

// delete a document from the list
function deleteDoc(docId) {
    db.collection('exercises').doc(docId).delete();
}