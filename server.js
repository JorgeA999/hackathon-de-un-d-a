const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir archivos estáticos (HTML, JS, CSS)
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('Un estudiante se conectó:', socket.id);

    // Escuchar cuando alguien dibuja y reenviar a los demás
    socket.on('draw', (data) => {
        console.log("Dibujo recibido:", data);
        socket.broadcast.emit('draw', data);
    });

    // Escuchar cuando alguien limpia la pizarra
    socket.on('clear', () => {
        socket.broadcast.emit('clear');
    });

    socket.on('disconnect', () => {
        console.log('Estudiante desconectado');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`MathBoard corriendo en http://localhost:${PORT}`);
});
