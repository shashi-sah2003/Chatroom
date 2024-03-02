const APP_ID = '1335aae771d846a1b798856891edba7d'
const CHANNEL = 'main'
const token = '007eJxTYCh+wnixq5991s+VW5lDDJuC+OQObn9Yq1Ehbyy386PRd14FBkNjY9PExFRzc8MUCxOzRMMkc0sLC1MzC0vD1JSkRPMUdfHHqQ2BjAwW334yMjJAIIjPwpCbmJnHwAAA7+QeaA=='

let UID;

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {

    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUser)


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
joinAndDisplayLocalStream()