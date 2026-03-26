// socket.js - Manejo de comunicación en tiempo real
const socket = io(); // Inicializa la conexión con el servidor

// 1. Enviar datos cuando tú dibujas
// Esta función la debes llamar dentro de tu evento 'mousemove' en canvas.js
export const emitDraw = (x, y, color, size) => {
    socket.emit('draw', {
        x: x,
        y: y,
        color: color,
        size: size
    });
};

// 2. Escuchar cuando OTROS dibujan
socket.on('draw', (data) => {
    const canvas = document.getElementById('whiteboard');
    const ctx = canvas.getContext('2d');

    ctx.lineWidth = data.size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = data.color;

    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
});

// 3. Escuchar cuando alguien limpia la pizarra
socket.on('clear', () => {
    const canvas = document.getElementById('whiteboard');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// 4. Notificar al servidor para limpiar a todos
export const emitClear = () => {
    socket.emit('clear');
};
