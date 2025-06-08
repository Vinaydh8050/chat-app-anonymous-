const socket = io();

const startButton = document.getElementById('startButton');
const nextButton = document.getElementById('nextButton');
const sendButton = document.getElementById('sendButton');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const chatBox = document.getElementById('chat');

let roomId = null;

startButton.onclick = () => {
  socket.emit('join');
  startButton.disabled = true;
};

nextButton.onclick = () => {
  if (roomId) {
    socket.emit('leave', roomId);
  }
  resetChat();
  socket.emit('join');
};

sendButton.onclick = () => {
  const message = input.value.trim();
  if (message && roomId) {
    socket.emit('message', { roomId, message });
    addMessage(`You: ${message}`, 'self');
    input.value = '';
  }
};

socket.on('room', id => {
  roomId = id;
  chatBox.style.display = 'block';
  nextButton.disabled = false;
  addMessage('Stranger connected!', 'system');
});

socket.on('message', message => {
  addMessage(`Stranger: ${message}`, 'stranger');
});

socket.on('leave', () => {
  addMessage('Stranger disconnected.', 'system');
  resetChat();
});

function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.textContent = text;
  msg.className = type;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

function resetChat() {
  messages.innerHTML = '';
  roomId = null;
  nextButton.disabled = true;
  chatBox.style.display = 'none';
  startButton.disabled = false;
}
