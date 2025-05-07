document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const nicknameContainer = document.getElementById('nickname-container');
    const nicknameInput = document.getElementById('nickname-input');
    const nicknameSubmit = document.getElementById('nickname-submit');
    const chatRoom = document.getElementById('chat-room');
    const chatBox = document.getElementById('chat-box');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const clearChatButton = document.getElementById('clear-chat');

    // Check if nickname is already set
    const savedNickname = localStorage.getItem('chatNickname');
    if (savedNickname) {
        nicknameContainer.classList.add('hidden');
        chatRoom.classList.remove('hidden');
        loadMessages();
    }

    // Set nickname
    nicknameSubmit.addEventListener('click', function() {
        const nickname = nicknameInput.value.trim();
        if (nickname) {
            localStorage.setItem('chatNickname', nickname);
            nicknameContainer.classList.add('hidden');
            chatRoom.classList.remove('hidden');
            loadMessages();
        }
    });

    // Send message
    function sendMessage() {
        const message = messageInput.value.trim();
        const nickname = localStorage.getItem('chatNickname');
        
        if (message && nickname) {
            const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
            messages.push({
                nickname: nickname,
                text: message,
                timestamp: new Date().toISOString()
            });
            
            localStorage.setItem('chatMessages', JSON.stringify(messages));
            messageInput.value = '';
            loadMessages();
        }
    }

    // Load messages
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        const nickname = localStorage.getItem('chatNickname');
        
        chatBox.innerHTML = messages.map(msg => {
            const isOwn = msg.nickname === nickname;
            return `
                <div class="message ${isOwn ? 'own-message' : ''}">
                    <strong>${msg.nickname}:</strong> ${msg.text}
                    <small>${new Date(msg.timestamp).toLocaleTimeString()}</small>
                </div>
            `;
        }).join('');
        
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Clear chat
    clearChatButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all messages?')) {
            localStorage.removeItem('chatMessages');
            loadMessages();
        }
    });

    // Load messages every second (simulates real-time updates)
    setInterval(loadMessages, 1000);
});
