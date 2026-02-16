const io = require('socket.io')(process.env.PORT || 3000, {
    cors: { origin: "*" }
});

let players = {};

io.on('connection', (socket) => {
    console.log('Jugador conectado:', socket.id);

    socket.on('join', (data) => {
        players[socket.id] = {
            id: socket.id,
            nick: data.nick,
            char: data.char,
            x: 2500, y: 2500,
            hp: 100
        };
        // Avisar a todos que alguien entró
        io.emit('updatePlayers', players);
    });

    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].ang = data.ang;
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });
});

console.log("Servidor de PiterPan corriendo...");