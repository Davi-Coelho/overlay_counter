let wss = null
const WebSocket = require('ws')
 
function onError(ws, err) {
    console.error(`onError: ${err.message}`)
}
 
function onMessage(ws, data) {
    console.log(`${ws.id} ${data}`)
}

function onClose(code, ws) {
    console.log(`${ws.id} desconectado!`)
}  
 
function onConnection(ws, req) {
    const splittedMessage = req.url.split('?')
    const channel = splittedMessage[1].split('=')[1]

    ws.id = channel
    ws.on('error', error => onError(ws, error))
    ws.on('message', data => onMessage(ws, data))
    ws.on("close", code => onClose(code, ws))
}
 
module.exports = (server) => {
    wss = new WebSocket.Server({
        server
    })
 
    wss.on('connection', onConnection)
 
    console.log(`App Web Socket Server is running!`)
    return wss
}