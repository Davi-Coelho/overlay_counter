module.exports = (application) => {
    application.get('/counter/:channel', (req, res) => {
        application.app.controllers.counter.getCounter(application, req, res)
    })

    application.post('/counter', (req, res) => {
        application.app.controllers.counter.newChannel(application, req, res)
    })
}