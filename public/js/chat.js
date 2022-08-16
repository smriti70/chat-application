const socket = io();

document.querySelector('#chat-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    let chatMessage = e.target.elements.message.value;
    socket.emit('sendMessage',chatMessage);
});

document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.');
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        })
    })
})

socket.on('message',(message)=>{
    console.log(message);
});
