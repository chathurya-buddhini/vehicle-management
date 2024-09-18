// websocket.js
import io from 'socket.io-client';

const API_BASE_URL = 'http://localhost:3000'; // Adjust the port and address as needed

const socket = io(API_BASE_URL);

export const listenForNotifications = (callback) => {
  socket.on('batchComplete', (data) => {
    callback(data.message);
  });
};

export const disconnectWebSocket = () => {
  socket.disconnect();
};

