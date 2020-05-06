
const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $senLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


//Template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebartemplate = document.querySelector('#sidebar-template').innerHTML

const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true})

const autoscroll = () => {
    //New Message element
    const $newMessage = $messages.lastElementChild

    //Height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //Visible Height
    const VisibleHeight = $messages.offsetHeight

    //Height of messages container
    const containerHeight = $messages.scrollHeight

    //How Far Have I scrolled
    const scrollOffset = $messages.scrollTop +VisibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
    
}

socket.on('message', (message) => {
    console.log(message);

    const html = Mustache.render(messageTemplate, {
        username:message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML ('beforeend', html)
    autoscroll();
});

socket.on('locationMessage', (message) => {
    
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })

    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll();
 })

 socket.on('roomData', ({ room, users}) => {
     const html = Mustache.render(sidebartemplate, {
         room,
         users
     })

     document.querySelector('#sidebar').innerHTML = html  
 })

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //disable the form
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {

        //Enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus() 

        if(error){
            return console.log(error);
        }

        console.log('Message Deliver');
    });

})

$senLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.')
    }

    $senLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {

            //enable button
            $senLocationButton.removeAttribute('disabled');
            console.log('Location shared')
        })
    })
})

socket.emit('join', {username, room}, (error) => {
    if(error) {
        alert(error)

        location.href = '/' 
    }
})