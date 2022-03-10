let wss = null
const WebSocket = require('ws')
 
function heartbeat() {
    this.isAlive = true
  }

function onError(ws, err) {
    console.error(`onError: ${err.message}`)
}
 
function onMessage(ws, data) {
    console.log(`${ws.id} ${data}`)
}
 
function onConnection(ws, req) {
    ws.isAlive = true
    const splittedMessage = req.url.split('?')
    const channel = splittedMessage[1].split('=')[1]

    ws.id = channel
    ws.on('error', error => onError(ws, error))
    ws.on('message', data => onMessage(ws, data))
    ws.on('pong', heartbeat)
}
 
module.exports = (server) => {
    wss = new WebSocket.Server({
        server
    })
 
    wss.on('connection', onConnection)

    const interval = setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) return ws.terminate()

            ws.isAlive = false;
            ws.ping()
        })
    }, 30000)

    wss.on('close', function close() {
        clearInterval(interval)
    })
 
    console.log(`App Web Socket Server is running!`)
    return wss
}