const tmi = require('tmi.js')
const db = require('./dbConnection')
const CounterDAOImport = require('../app/models/CounterDAO')()

module.exports = (wss) => {

    const client = new tmi.client({
        channels: []
    })

    client.on('connected', onConnectedHandler)
    client.on('message', onMessageHandler)
    client.connect()

    async function onMessageHandler(channel, tags, message, self) {
        if (self) return
        if (message.charAt(0) !== '!') return

        const splittedMessage = message.split(' ')

        if (splittedMessage.length === 2 || splittedMessage.length === 3) {
            if (tags.badges.hasOwnProperty('broadcaster') || tags.mod) {

                const CounterDAO = new CounterDAOImport(db.CounterModel)
                channel = channel.substr(1)

                if (splittedMessage[0] === '!createcounter') {
                    CounterDAO.createCounter(channel, splittedMessage[1])
                }
                else if (splittedMessage[0] === '!deletecounter') {
                    CounterDAO.deleteCounter(channel, splittedMessage[1])
                }
                else if (splittedMessage[0] === '!death') {
                    CounterDAO.increaseCounter(channel, splittedMessage[1], async () => {
                        const ws = Array.from(wss.clients).filter(el => el.id === channel)
                        const data = await CounterDAO.getCounter(channel)
                        const counter = data.counters.find(el => el.name === splittedMessage[1])
                        ws.forEach(el => el.send(counter.value))
                    })
                }
                else if (splittedMessage[0] === '!setcounter') {
                    CounterDAO.setCounter(channel, splittedMessage[1], splittedMessage[2])
                }
            }
        }
    }

    async function onConnectedHandler(address, port) {
        const channels = await db.CounterModel.find({})

        channels.forEach(element => {
            client.join(element.channel)
        })

        console.log(`* Connected on ${address}:${port}`)
    }

    return { client, db }
}