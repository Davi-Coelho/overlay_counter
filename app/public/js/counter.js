const ws = new WebSocket(`ws:localhost:3000/?channel=${channel}`)

ws.onopen = function () {
    ws.send('conectado!')
}

ws.onmessage = function (msg) {
    document.querySelector('#counter-value').innerHTML = msg.data
}