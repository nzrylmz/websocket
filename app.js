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
const chat = io.of('/chat');

chat.on('connection', (socket) => {
    console.log("Kullanıcı bağlandı!");

    socket.on('userbaglan', (data) => {
        socket.broadcast.emit('users', (data)); // isteği gönderen client hariç diğerlerinde görünür
        chat.emit('users', (data)); // namespace isimine emit edersen o namespace bağlı tüm clişentlere gönderir
    });
});