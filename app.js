const app = require('./config/server')
const appWs = require('./config/ws')
const port = 3000

const server = app.listen(port, () => console.log(`App Express is running on port ${port}`))

const wss = appWs(server)

const { client, db } = require('./config/chatbot')(wss)
app.db = db
app.chatbot = client