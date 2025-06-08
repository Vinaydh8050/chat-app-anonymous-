const socket = io();
let roomId = null;

const chatBox = document.getElementById('chatBox');
const input = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendButton');
const startBtn = document.getElementById('startButton');
const leaveBtn = document.getElementById('leaveButton');

function appendMessage(text, type = 'stranger') {
  const div = document.createElement('div');
  div.textContent = (type === 'me' ? 'You: ' : 'Stranger: ') + text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

startBtn.onclick = () => {
  socket.emit('join');
  appendMessage('Looking for a stranger...', 'me');
};

sendBtn.onclick = () => {
  const message = input.value.trim();
  if (message && roomId) {
    socket.emit('message', { roomId, message });
    appendMessage(message, 'me');
    input.value = '';
  }
};

leaveBtn.onclick = () => {
  if (roomId) {
    socket.emit('leave', roomId);
    appendMessage('You left the chat.', 'me');
    roomId = null;
  }
};

socket.on('room', id => {
  roomId = id;
  appendMessage('Connected to a stranger!', 'me');
});

socket.on('message', message => {
  appendMessage(message, 'stranger');
});

socket.on('leave', () => {
  appendMessage('Stranger left the chat.', 'me');
  roomId = null;
});
