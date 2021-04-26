// DECLARATIONS
const socket = io('/');
const peers = {};
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000',
});

// ACCESS THE USER'S VIDEO AND AUDIO
let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    myVideoStream = stream
    addVideoStream(myVideo, stream);

    // ANSWER THE NEW USER'S CALL AND CREATE A VIDEO ELEMENT OF NEW USER
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    // GET THE NEW USER'S ID AND CONNECT
    socket.on('user-connected', (userId) => {
        connecToNewUser(userId, stream);
        const userConnect = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
        })
        userConnect.fire({
            icon: 'success',
            title: 'User Connected'
        })
        console.log('user connected'+ userId)
    })
    
    let text = $('input')

    $('html').keydown((e) =>{
        if (e.which == 13 && text.val().length !== 0) {
            socket.emit('message', text.val());
            text.val('')
        }
    });

    // CREATE MESSAGE
    socket.on('createMessage', message => {
        $('.messages').append(`<li class="message"><b>User</b><br>${message}</li>`);
        scrollToBottom()
    })
})

// DISCONNECT THE CONNECTION 
socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
    const userDisconnect = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
    })
    userDisconnect.fire({
        icon: 'error',
        title: 'User Disconnected'
    })
})

// GET THE OWN USER ID
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})

// CALL TO NEW USER THAT CONNECTED WITH ROOM ID
const connecToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })

    // REMOVE THE NEW USER'S VIDEO ELEMENT AFTER DISCONNECT
    call.on('close', () => {
        video.remove()
    })
    peers[userId] = call
}

// STEAM THE NEW USER'S VIDEO
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

// SCROLL THE CHAT HISTORY
const scrollToBottom = () => {
    let d = $('.chat-display');
    d.scrollTop(d.prop("scrollHeight"));
}

// ----------------------------------------------------- FUNCTIONS OF BUTTONS ----------------------------------------------------- //

// MUTE AND UNMUTE USER'S OWN AUDIO
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }   else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
        <i class="fas fa-microphone"></i>
    `
    document.querySelector('.mute-button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
        <i class="unmute fas fa-microphone-slash"></i>
    `
    document.querySelector('.mute-button').innerHTML = html;
}

// STOP AND PLAY USER'S OWN VIDEO
const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayButton();
    }   else {
        setStopButton();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopButton = () => {
    const html = `
        <i class="fas fa-video"></i>
    `
    document.querySelector('.stop-button').innerHTML = html;
}

const setPlayButton = () => {
    const html = `
        <i class="stop fas fa-video-slash"></i>
    `
    document.querySelector('.stop-button').innerHTML = html;
}

const link = document.getElementById("link")
const copy = document.getElementById("copy")

copy.onclick = function () {
  link.select();
  document.execCommand("Copy")
}

document.getElementsByTagName('input')[1].value=window.location.href

document.getElementById("open-invite-popup").addEventListener("click",function(){
  document.getElementsByClassName("invite-popup")[0].classList.add("active");
});
     
document.getElementById("close-invite-popup").addEventListener("click",function(){
  document.getElementsByClassName("invite-popup")[0].classList.remove("active");
});

const leave = document.getElementById("leave")

leave.onclick = function () {
  history.back()
}

document.getElementById("open-leave-popup").addEventListener("click",function(){
  document.getElementsByClassName("leave-popup")[0].classList.add("active");
});
     
document.getElementById("close-leave-popup").addEventListener("click",function(){
  document.getElementsByClassName("leave-popup")[0].classList.remove("active");
});

document.getElementById("cancel").addEventListener("click",function(){
  document.getElementsByClassName("leave-popup")[0].classList.remove("active");
});

// const Invite = () => {
//     Swal.fire({
//         icon: 'info',
//         title: 'Please copy your room link to invite others.',
//         input: 'text',
//         inputLabel: 'This is your URL',
//         inputValue: window.location.href
//     })
// }

const Leave = () => {
    Swal.fire({
        icon: 'question',
        title: 'Are you sure leaving the meeting ?',
        showCancelButton: true,
        confirmButtonText: 'Yes, I prefer to leave'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Thanks For Choosing Us. We Think You Got a Better Experiance.',
                confirmButtonText: '<a href="http://codefest-smartl.herokuapp.com/Conference.php"><b>Ok</b></a>',
            })
        }
    })
}

document.getElementById("open-chat-body").addEventListener("click",function(){
    document.getElementsByClassName("chat-body")[0].classList.add("active");
});
       
document.getElementById("close-chat-body").addEventListener("click",function(){
    document.getElementsByClassName("chat-body")[0].classList.remove("active");
});

const checkbox = document.getElementById('checkbox');

checkbox.addEventListener('change', () => {
    document.body.classList.toggle('dark');
})