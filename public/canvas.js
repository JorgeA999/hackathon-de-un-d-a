const socket = io();

const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');

const colorPicker = document.getElementById('colorPicker');
const sizePicker = document.getElementById('sizePicker');
const clearBtn = document.getElementById('clearBtn');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;

// 🖱️ Cuando presionas el mouse


canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;

    ctx.lineWidth = sizePicker.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker.value;

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();

    // ✅ ENVIAR AQUÍ (correcto)
    socket.emit('draw', {
        x: e.clientX,
        y: e.clientY,
        color: colorPicker.value,
        size: sizePicker.value
    });
});

// 👇 IMPORTANTE: en document, no solo canvas
document.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mouseleave', () => {
    drawing = false;
});



// 🖱️ Cuando sueltas el mouse
canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});

// 🧽 Limpiar canvas
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear');
});

// 📡 Recibir dibujo de otros
socket.on('draw', (data) => {
    ctx.lineWidth = data.size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = data.color;

    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
});

// 📡 Limpiar desde otros
socket.on('clear', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});