// WebSocket connection (using a free public test server)
const socket = new WebSocket("wss://ws.postman-echo.com/raw");

// DOM Elements
const nicknameContainer = document.getElementById('nickname-container');
const nicknameInput = document.getElementById('nickname-input');
const nicknameSubmit = document.getElementById('nickname-submit');
const chatRoom = document.getElementById('chat-room');
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

let nickname = "";

// Set nickname
nicknameSubmit.addEventListener('click', () => {
    nickname = nicknameInput.value.trim();
    if (nickname) {
        localStorage.setItem('chatNickname', nickname);
        nicknameContainer.classList.add('hidden');
        chatRoom.classList.remove('hidden');
    }
});

// WebSocket event handlers
socket.addEventListener('open', (e) => {
    console.log("WebSocket connected!");
});

socket.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data);
    appendMessage(msg.nickname, msg.text);
});

// Send message
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !nickname) return;

    const message = { nickname, text };
    socket.send(JSON.stringify(message));
    messageInput.value = "";
}

// Display messages
function appendMessage(nick, text) {
    const isOwn = nick === nickname;
    const msgElement = document.createElement('div');
    msgElement.className = `message ${isOwn ? 'own-message' : ''}`;
    msgElement.innerHTML = `<strong>${nick}:</strong> ${text}`;
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Load nickname if already set
if (localStorage.getItem('chatNickname')) {
    nickname = localStorage.getItem('chatNickname');
    nicknameContainer.classList.add('hidden');
    chatRoom.classList.remove('hidden');
}
