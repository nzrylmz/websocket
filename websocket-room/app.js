const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const server = http.createServer((req,res) => {
    if(req.url == '/chat'){
        fs.readFile('index.html', (err,data) => {
            res.end(data);
        }); 
    }
});

server.listen(3000);

const io = socketio.listen(server);

io.on('connection', (socket) => {
    console.log("Kullanıcı bağlandı!");

    socket.join('room1');
    socket.join('room2');
    socket.join('room3', () => {
        const rooms = Object.keys(socket.rooms);
        console.log(rooms);
    });
    

    socket.on('joinRoom', (data) => {
        socket.join(data.name, () => {
            socket.emit('personalLog', { message: 'Odaya girdiniz!' });
            socket.emit('joined');
            socket.to(data.name).emit('personalLog', { message: 'Odaya biri girdi!' });
            io.to(data.name).emit('userCount', { count: getOnlineCount(io,data) });
            const rooms = Object.keys(socket.rooms);// get rooms
            console.log(rooms);                     // list rooms
        });
    });

    socket.on('leaveRoom', (data) => {
        socket.leave(data.name, () => {
            socket.emit('personalLog', { message: 'Odadan ayrıldınız!' });
            socket.emit('leaved');
            if(getOnlineCount == undefined) {getOnlineCount = 0;}
            socket.to(data.name).emit('userCount', { count: getOnlineCount(io,data) });
            const rooms = Object.keys(socket.rooms);// get rooms
            console.log(rooms);                     // list rooms
        });
    });
});

const getOnlineCount = (io, data) => {
    const room = io.sockets.adapter.rooms[data.name];
    return room ? room.length : 0;
};