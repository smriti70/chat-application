const socket = io();

//Elements
const $messageForm = document.querySelector('#chat-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;

socket.on('message',(message)=>{
    console.log(message);
    const html = Mustache.render(messageTemplate,{
        message
    });
    $messages.insertAdjacentHTML('beforeend',html);
});

socket.on('locationMessage',(location)=>{
    console.log(location);
    const html = Mustache.render(locationMessageTemplate,{
        location
    });
    $messages.insertAdjacentHTML('beforeend',html);
});

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    $messageFormButton.setAttribute('disabled','disabled');
    
    //disable
    const chatMessage = e.target.elements.message.value;

    socket.emit('sendMessage',chatMessage,(error)=>{
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        //enable
        if(error){
            return console.log("Error: ",error);
        }
        console.log("Message was sent!");
    });
});

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.');
    }

    $sendLocationButton.setAttribute('disabled','disabled');

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            console.log("Location shared!");
        });
        $sendLocationButton.removeAttribute('disabled');
    })
})


