// Check for logged in users
checkLoginStatus();

let createdBy = 'Unknown'

/*const reff = db.collection('doctors').doc(userId).get()
reff.then(snapshot => {
    createdBy = snapshot.get('email')
})*/

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        db.collection('doctors').doc(userId).get().then(doc => {
            if (!doc.exists) {
                alert("No profile found");
            } else {
                createdBy = `Dr. ${doc.data().firstName} ${doc.data().middleName} ${doc.data().lastName}`;
            }
        });
    } else {}
});

let docPath = ''
let activeTopic = ''
const inputTopicName = document.getElementById('name'); // the forum topic
const btnAddTopic = document.getElementById('btnAdd'); // Button to add a new topic
const headerText = document.getElementById('forum-category-head');
const topicList = document.getElementById('topic-list');
const sendButton = document.querySelector('#btnSend'); // send button
const topicHeaderText = document.getElementById('topic-header-text'); // topuc header text
const conversationContent = document.querySelector('#conversation-content'); // converstion content
const textMessage = document.querySelector('#text-message'); // input button

// get all the topics in this category
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        getCategoryTopics(docPath)
    }
})

// instantiate the category name variable
var categoryName = 'No category selected';

// get some page details
if (localStorage) {
    if (localStorage.getItem("categoryName") !== null || localStorage.getItem("categoryName") === '') {
        categoryName = localStorage.getItem("categoryName");
    }
} else {
    if ($.cookies.get("categoryName") !== null || $.cookies.get("categoryName") === '') {
        categoryName = $.cookies.get("categoryName");
    }
}

// what to do when the doc loads
$(document).ready(function() {
    if (categoryName == 'activity') {
        headerText.innerText = 'Activities for diabetic patients';
        docPath = 'activity';
    } else if (categoryName == 'blood') {
        headerText.innerText = 'Know more about your blood sugar?';
        docPath = 'blood';
    } else if (categoryName == 'diet') {
        headerText.innerText = 'What should you eat?';
        docPath = 'diet';
    } else if (categoryName == 'medication') {
        headerText.innerText = 'The right medication for you';
        docPath = 'medication';
    } else if (categoryName == 'general') {
        headerText.innerText = 'General questions';
        docPath = 'general';
    } else if (categoryName == 'latest') {
        headerText.innerText = 'What is new';
        docPath = 'latest';
    } else {
        headerText.innerText = categoryName;
    }

    $('.modal').modal();
});

// add category button
btnAddTopic.addEventListener('click', e => {
    const topic = inputTopicName.value
        // createdBy is defined above
    const category = categoryName
    const today = new Date()
    const dateCreated = today.toISOString().split('T')[0]

    // add the topic
    if (topic.value === '') {
        alert("Provide a topic");
    } else {
        db.collection('forums').doc(docPath).collection('forum-topics').add({
            name: topic,
            category: category,
            createdBy: createdBy,
            dateCreated: dateCreated
        });

        inputTopicName.value = '';
    }
});

// send button event handler
sendButton.addEventListener('click', e => {
    let value = textMessage.value;
    if (value === '') {
        alert("Type something")
    } else {
        sendMessage(value)
        textMessage.value = ''
    }
})

/*document.addEventListener('keypress', e => {
    const key = e.which || e.keyCode
    if (key === 13) {
        let value = textMessage.value;
        if (value === '') {
            alert("Type something")
        } else {
            sendMessage(value)
            textMessage.value = ''
        }
    }
})*/

// get the current topics for this category
function getCategoryTopics(cat) {
    const query = db.collection('forums').doc(docPath).collection('forum-topics')
        .orderBy('dateCreated', 'desc')
        .get()
        .then(snapshot => {
            if (snapshot.size) {
                snapshot.forEach(doc => {
                    let topic = doc
                    updateTopicList(topic) // update the list of topics
                });
            }
        })
}

// Get the recent topics in the category
function updateTopicList(topic) {
    //topicList.innerHTML = ""
    topicList.innerHTML +=
        `
    <li onclick="displayMessagesFrom('${topic.id}', '${topic.data().name}')" class="topic-item avatar">
        <img src="images/icons/${topic.data().category}.png" class="circle topic-avatar"/>
        <div class="topic-name-and-text">
            <h6 class="title">${topic.data().name}</h6>
            <p class="grey-text text-darken-1 created-by-text">Created by: ${topic.data().createdBy}</p>
        </div>
        <div class="topic-timestamp">
            <p class="grey-text">${topic.data().dateCreated}</p>
        </div>
    </li>
    `
}

// Display messages from a particular topic
function displayMessagesFrom(topicId, name) {
    activeTopic = topicId
    topicHeaderText.innerHTML = name

    conversationContent.innerHTML = ''

    db.collection('forums').doc(docPath)
        .collection('forum-topics').doc(activeTopic)
        .collection('messages')
        .orderBy('dateSent')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type == 'added') {
                    insertMessageToPage(change.doc.data())
                }
            })
        })

    //updateConversationList()
}

// Send a message in the current topic
function sendMessage(message) {
    const today = new Date()

    if (activeTopic === '') {
        alert('No topic is currently selected')
    } else {
        db.collection('forums').doc(docPath).collection('forum-topics').doc(activeTopic).collection('messages').add({
            message: message,
            senderId: userId,
            senderName: createdBy,
            dateSent: firebase.firestore.FieldValue.serverTimestamp()
        })

        //refreshUIWithMessages(activeTopic, topicHeaderText.innerHTML)
    }
}

async function updateConversationList() {
    const messages = await getUserMessages()
    conversationContent.innerHTML = ''


    messages.forEach(message => insertMessageToPage(message))
}

function insertMessageToPage(message) {


    let messageDate = ""
        /*
    let today = new Date()
    let date = ''
    date = (message.dateSent).toDate()
    let a = `${today.getDate()} ${today.getMonth()} ${today.getFullYear()}`
    let b = `${date.getDate()} ${date.getMonth()} ${date.getFullYear()}`

    // check if its today
    if (a === b) {
        messageDate = `${date.getHours()}:${date.getMinutes()}`
    }
    // check if its this year
    else if (today.getFullYear() === date.getFullYear()) {
        messageDate = `${date.getDate()}-${date.getMonth()}, ${date.getHours()}:${date.getMinutes()}`
    }
    // default run 
    else {
        messageDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}, 
        ${date.getHours()}:${date.getMinutes()}`
    }
*/
    if (message.senderId === userId) {
        conversationContent.innerHTML +=
            `
        <li class="conversation-item-holder-right">
            <div class="conversation-item-right blue darken-3 white-text">
                <span>${message.message}</span>
                <span class="conversation-item-time-right">${messageDate}</span>
            </div>
        </li>
        `
    } else {
        conversationContent.innerHTML +=
            `
        <li class="conversation-item-holder-left">
            <div class="conversation-item-left white grey-text-darken-3">
                <span class="sender-name blue-text">${message.senderName}</span><br>
                <span>${message.message}</span>
                <span class="conversation-item-time-left">${messageDate}</span>
            </div>
        </li>
        `
    }

    conversationContent.scrollTop = conversationContent.scrollHeight

}

async function getUserMessages() {
    const query = db.collection('forums').doc(docPath)
        .collection('forum-topics').doc(activeTopic)
        .collection('messages')
        .orderBy('dateSent')

    const snapshot = await query.get()

    if (snapshot.size) return snapshot.docs.map(doc => doc.data())
    return []
}

function listenForMessages() {
    db.collection('forums').doc(docPath)
        .collection('forum-topics').doc(activeTopic)
        .collection('messages')
        .orderBy('dateSent')
        .onSnapshot(snapshot => {
            snapshot.doChanges().forEach(change => {
                alert("")
            })
        })
}

function refreshUIWithMessages(activeTopic, name) {
    displayMessagesFrom(activeTopic, name)
}