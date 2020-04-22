// Check for logged in users
checkLoginStatus();

const dietName = document.querySelector('#name');
const fats = document.querySelector('#fats');
const calories = document.querySelector('#calories');
const sugar = document.querySelector('#sugar');
const carbs = document.querySelector('#carbs');
const description = document.querySelector('#description');
const dietTable = document.querySelector('#diet-table');
const addButton = document.querySelector('#btnAdd');

// Get drugs from the database and always look for them

// Add drug to firebase website
addButton.addEventListener('click', e => {
    if (dietName.value === '' || fats.value === '' || calories.value === '' ||
        sugar.value === '' || carbs.value === '' || description.value === '') {
        alert("Make sure you fill in fields");
    } else {
        db.collection('diet').add({
            name: dietName.value,
            fats: fats.value,
            calories: calories.value,
            sugar: sugar.value,
            carbs: carbs.value,
            description: description.value
        });

        dietName.value = '';
        fats.value = '';
        calories.value = '';
        sugar.value = '';
        carbs.value = '';
        description.value = '';
    }

});

// real-time listener
db.collection('diet').orderBy('name').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderMedicine(change.doc);
        } else if (change.type == 'removed') {
            let li = dietTable.querySelector('[data-id=' + change.doc.id + ']');
            dietTable.removeChild(li);
        }
    });
});

// update the ui
function renderMedicine(doc) {
    dietTable.innerHTML +=
        `
        <tr data-id='${doc.id}'>
            <td>${doc.data().name}</td>
            <td>${doc.data().carbs}</td>
            <td>${doc.data().fats}</td>
            <td>${doc.data().sugar}</td>
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
    db.collection('diet').doc(docId).delete();
}