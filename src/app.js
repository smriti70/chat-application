const path = require("path");
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage} = require('./utils/messages.js');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname,"../public");

app.use(express.static(publicDirectoryPath));

io.on('connection',(socket)=>{
    console.log("Connected to socket io");

    
    socket.on('join',({ username, room },callback) => {
        const { error, user } = addUser({id: socket.id, username,room});
        if(error){
            return callback(error);
        }

        socket.join(user.room);

        socket.emit('message',generateMessage('Welcome!'));
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined!`));
        callback();
    })
    
    socket.on('sendMessage',(message,callback)=>{
        const filter = new Filter();

        if(filter.isProfane(message)){
            return callback("Profanity is not allowed!");
        }

        callback();
        io.to('a').emit('message',generateMessage(message));
    });

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message',generateMessage(`${user.username} has left!`));
        }
        
    });

    socket.on('sendLocation',(location,callback)=>{
        io.emit('locationMessage',generateMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`));
        callback();
    });
});

server.listen(port,()=>{
    console.log("Server is up and running on port "+ port);
});