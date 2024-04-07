const WebSocket = require('ws')

const server = new WebSocket.Server({
    port: 4200
}, () => {
    console.log('server started at port 4200')
})

const users = new Set()

const sendEnterRoom = (message) => {
    users.forEach((user) => {
        user.ws.send(JSON.stringify(message))
    })
}

const sendStartGame = (message) => {
    users.forEach((user) => {
        user.ws.send(JSON.stringify(message))
    })
}

const sendPlayerDone = (message) => {
    users.forEach((user) => {
        user.ws.send(JSON.stringify(message))
    })
}


const sendWords = (message) => {
    users.forEach((user) => {
        user.ws.send(JSON.stringify(message))
    })
}

server.on('connection', (ws) => {
    const userRef = {
        ws,
    }

    users.add(userRef)

    ws.on('message', (message) => {
        const data = JSON.parse(message)
        console.log(data)
        if(data.msgType === 'joinroom') {
            try {
                console.log(`someone has connected to room-${data.roomId}`)
                sendEnterRoom({
                    roomId: data.roomId,
                    msgType: data.msgType
                })
            } catch(err) {
                console.error(err)
            }
        } else if(data.msgType === 'startgame') {
            try {
                console.log(`room-${data.roomId} has started`)
                sendStartGame({
                    roomId: data.roomId,
                    msgType: data.msgType
                })
            } catch(err) {
                console.error(err)
            }
        } else if(data.msgType === 'sendwords') {
            try {
                console.log(`room-${data.roomId} has started`)
                sendWords({
                    roomId: data.roomId,
                    words: data.words,
                    msgType: data.msgType
                })
            } catch(err) {
                console.error(err)
            }
        } else if(data.msgType === 'plrdone') {
            try {
                console.log(`room-${data.roomId} one player completed`)
                sendPlayerDone({
                    roomId: data.roomId,
                    name: data.name,
                    msgType: data.msgType
                })
            } catch(err) {
                console.error(err)
            }
        }
    })
})