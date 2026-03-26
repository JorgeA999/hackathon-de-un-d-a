const socket = io(); // Conectar al servidor

// MODIFICAR tu función draw actual para incluir esto al final:
function draw(e) {
    if (!drawing) return;
    
    // ... tu lógica de dibujo actual (ctx.stroke, etc) ...

    // ENVIAR coordenadas al servidor
    socket.emit('draw', {
        x: e.clientX,
        y: e.clientY,
        color: colorPicker.value,
        size: sizePicker.value,
        isDrawing: true
    });
}

// RECIBIR dibujos de otros usuarios
socket.on('draw', (data) => {
    ctx.lineWidth = data.size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = data.color;

    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
});

// Limpiar para todos cuando alguien presiona el botón
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear');
});

socket.on('clear', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
