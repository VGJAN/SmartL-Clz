// DECLARATIONS
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
// s

// SERVER TO SET THE TEMPLATE ENGINE AS VIEW ENGINE TO TEMPLATE THE EJS FILE AS HTML FILE FOR SENT TO USERS
app.set('view engine', 'ejs');

// SERVER TO USE THE SCRIPT.JS FILE WHICH IS IN PUBLIC FOLDER
app.use(express.static('public'));

// app.use('/peerjs', peerServer);

// SERVER TO GET THE UUID THAT'S THE UNIQUE ID
app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`)
});

//  GET THE ROOM ID FROM UUID TO GO TO ROOM
app.get('/:room', (req, res) => {
    res.render('index', { roomId: req.params.room })
});

// SOCKET.IO TELLS THE USER TO SEND THE USER ID
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message)
        });
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        });
    });
});

server.listen(process.env.PORT||3000);