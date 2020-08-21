
// INITIALIZATION
const socketURL = 'https://data-analytics.jubi.ai';
const socketPath = '/video-socket/socket';
const uid = uuidv4();
console.log(uid);
let socket;
let peer;


$(document).ready(() => {
  // CONNECTION
  socket = io(socketURL, {
    path: socketPath,
    transports: ["websocket", /*"polling"*/]
  })
  socket.emit('init', { uid: uid })
  // onCall(socket)
  console.log('waiting for call', uid);
  socket.on('call' + uid, (data) => {
    console.log('call incoming', data)
  })

  socket.on('p2p', options => {
    console.log('establishing p2p connection', options);
    if (uid == options.initiator) {
      peer = new SimplePeer({ initiator: true });
      // peer.on('signal', data => {
      //   console.log('signal data', data, uid);
      //   peer.signal(data);
      // });
    } else {
      peer = new SimplePeer();
      // peer.on('signal', data => {
      //   console.log('signal data', data, uid);
      //   peer.signal(data);
      // });
    }
    peer.on('signal', data => {
      console.log('signal data init', data, uid);
      peer.signal(data);
      socket.emit('initiate', { data: data });
    });
    peer.on('error', err => console.log('peer error', err));
  });

  socket.on('offer' + uid, options => {
    console.log('got offer');
    // peer.signal(options.data);
    peer.on('signal', data => {
      console.log('signal data offer', data, uid);
      peer.signal(data);
      // socket.emit('answer', { data: data });
    });
  });
});


// socket.on('success' + uid, options => {
//   peer.signal(options.data);
//   peer.on('signal', data => {
//     console.log('signal data', data, uid);
//     peer.signal(data);
//     // socket.emit('answer', { data: data });
//   });
// });

// peer.on('signal', data => {
//   console.log('signal data', data, uid);
//   peer.signal(data);
// });

document.getElementById('start-call').addEventListener('click', ev => {
  ev.preventDefault()
  peer = new SimplePeer({ initiator: true })
  socket.emit('call', { uid: uid })
})

document.getElementById('accept-call').addEventListener('click', ev => {
  ev.preventDefault()
  // socket.emit('accept', { uid: uid })
  onAccept()
})

function onCall(socket) {
  console.log('waiting for call', uid);
  socket.on('call' + uid, (data) => {
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
  peer = new SimplePeer()

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