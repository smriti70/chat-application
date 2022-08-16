const path = require("path");
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname,"../public");

app.use(express.static(publicDirectoryPath));

io.on('connection',(socket)=>{
    console.log("Connected to socket io");

    socket.broadcast.emit('message','A user has joined!');
    
    socket.emit('message',"Welcome!");
    socket.on('sendMessage',(message)=>{
        io.emit('message',message);
    });

    socket.on('disconnect',()=>{
        io.emit('message','A user has left!');
    });

    socket.on('sendLocation',(location)=>{
        io.emit('message',`https://google.com/maps?q=${location.latitude},${location.longitude}`);
    });
});

server.listen(port,()=>{
    console.log("Server is up and running on port "+ port);
});