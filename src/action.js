// import { io } from '/socket.io-client';

const socketURL = 'https://data-analytics.jubi.ai/video-socket';
// const socketURL = 'http://127.0.0.1:9741';
// const socketURL = 'http://139.59.32.241:9740';
const socketPath = '/socket';
const uid = uuidv4();
console.log(uid);
let socket;

socket = io(socketURL, {
  path: socketPath,
  transports: ["websocket", /*"polling"*/]
})
socket.emit('init', { uid: uid })
onCall(socket)

document.getElementById('start-call').addEventListener('click', ev => {
  ev.preventDefault()
  var peer = new SimplePeer({ initiator: true, stream: stream })
  socket.emit('call', { uid: uid })
})

document.getElementById('accept-call').addEventListener('click', ev => {
  ev.preventDefault()
  // socket.emit('accept', { uid: uid })
  onAccept()
})

function onCall(socket) {
  socket.once('call' + uid, (data) => {
    console.log('call incoming', data)
  })
}

function onAccept() {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(gotMedia).catch(() => { })
}

function gotMedia(stream) {
  var peer = new SimplePeer()

  peer.on('signal', data => {
    peer.signal(data)
  })

  peer.on('stream', stream => {
    // got remote video stream, now let's show it in a video tag
    var video = document.querySelector('video')

    if ('srcObject' in video) {
      video.srcObject = stream
    } else {
      video.src = window.URL.createObjectURL(stream) // for older browsers
    }
    video.play()
  })

  document.getElementById('stop-video').addEventListener('click', ev => {
    console.log('stopping video')
    ev.preventDefault()
    stopVideoOnly(stream)
  })
}

document.getElementById('start-video').addEventListener('click', ev => {
  ev.preventDefault()
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(gotMedia).catch(() => { })
})

// stop only camera
function stopVideoOnly(stream) {
  stream.getTracks().forEach(function (track) {
    if (track.readyState == 'live' && track.kind === 'video') {
      track.stop();
    }
  });
  var video = document.querySelector('video')
  video.src = ''
}

// stop only mic
function stopAudioOnly(stream) {
  stream.getTracks().forEach(function (track) {
    if (track.readyState == 'live' && track.kind === 'audio') {
      track.stop();
    }
  });
}