const APP_ID = '1335aae771d846a1b798856891edba7d'
const CHANNEL = 'chatroom'
const token = '007eJxTYNh5Jv/UnpNlgfv5KrYcOtV63rV/SwaXZtbaB0t1/u4tCXBXYDA0NjZNTEw1NzdMsTAxSzRMMre0sDA1s7A0TE1JSjRPeVv6M7UhkJHhLdseFkYGCATxORiSMxJLivLzcxkYAKB5I/Q='

let UID;

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {

    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUserLeft)


    UID = await client.join(APP_ID, CHANNEL, token, null)

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div class="video-container" id="user-container-${UID}">
                    <div class="username-wrapper"><span class="user-name">My Name</span></div>
                    <div class="video-player" id="user-${UID}"></div>
                </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)

    localTracks[1].play(`user-${UID}`)

    await client.publish([localTracks[0], localTracks[1]])
}

let handleUserJoined = async(user, mediaType) => {

    remoteUsers[user.UID]  = user
    await client.subscribe(user, mediaType)

    if(mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)

        if(player != null){
            player.remove()
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
                    <div class="username-wrapper"><span class="user-name">My Name</span></div>
                    <div class="video-player" id="user-${user.uid}"></div>
                </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)

        user.videoTrack.play(`user-${user.uid}`)
    }

    if(mediaType === 'audio'){
        user.audioTrack.play()
    }
}

let handleUserLeft = async(user) =>{
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream = async() => {

    for ( let i =0; localTracks.length > i; i++){
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    window.open('/', '_self')
}

let toggleCamera = async(e) => {
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = '#fff';
    }
    else{
        
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = 'rgba(255, 80, 80, 1)';
        
    }
}

let toggleMic = async(e) => {
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor = '#fff';
    }
    else{
        
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = 'rgba(255, 80, 80, 1)';
        
    }
}

joinAndDisplayLocalStream()

document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream)
document.getElementById('camera-btn').addEventListener('click', function(e) {
    toggleCamera(e);
});

document.getElementById('mic-btn').addEventListener('click', function(e) {
    toggleMic(e);
});
