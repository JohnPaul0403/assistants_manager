import MdParser from "./parse_model.js";

document.addEventListener(
    'DOMContentLoaded',
    () => {
        const socket = io.connect('http://' + location.host); // Connect to socket server
        let username = "";
        let assistant_id = "";
        let assistant_name = "";

        const messageText = (sender, text) => { // Function to display messages
            const messages = document.getElementById('messages');
            const newMessage = document.createElement('div');
            newMessage.classList.add('message'); // Add a CSS class for styling (optional)
            newMessage.innerHTML = `<strong>${sender}: </strong>${text}`;
            messages.appendChild(newMessage);
            messages.scrollTop = messages.scrollHeight; // Scroll to bottom after message addition
        };

        socket.on('connect', () => {
            console.log('connected');
        });

        socket.on('disconnect', () => {
            console.log('disconnected');
        });

        socket.on('Username', (data) => { // Receive username from server
            console.log(data);
            username = data;
        });

        socket.on('assistant', (data) => { // Receive assistant data
            console.log(data);
            assistant_id = data["assistant_id"];
            assistant_name = data["name"];
            document.getElementById("assistant_name").innerHTML = assistant_name;
        });

        socket.on('Bot Response', (data) => { // Receive bot response
            messageText(assistant_name, data);
            console.log(data);
        });

        const form = document.getElementById('form');
        form.onsubmit = ev => { // Handle form submission
            const textField = document.getElementById('text');
            messageText(username, textField.value);
            ev.preventDefault();
            socket.emit('message', [textField.value, assistant_id]);
            textField.value = '';
        };
    }
);
