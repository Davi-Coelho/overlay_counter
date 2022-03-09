require('dotenv').config()

module.exports.getCounter = async (application, req, res) => {
    
    const CounterDAO = new application.app.models.CounterDAO(application.db.CounterModel)
    const data = await CounterDAO.getCounter(req.params.channel)

    if (data) {
        const counter = data.counters.find(element => element.name === req.params.countername)
        res.render('counter', { channel: data.channel, counter: counter.value })
    }
    else {
        res.sendStatus(404)
    }
}

module.exports.newChannel = (application, req, res) => {

    console.log(req.headers.authorization)
    console.log(req.headers['content-type'])
    console.log(req.body.channel)
    
    if (req.headers['content-type'] === 'application/json') {
        
        if(req.headers.authorization === process.env.SECRET_TOKEN) {

            const CounterDAO = new application.app.models.CounterDAO(application.db.CounterModel)
            CounterDAO.createChannelCounter(req.body.channel, (result) => {
                res.sendStatus(200)
            })
        }
        else {
            res.sendStatus(401)
        }
    }
    else {
        res.sendStatus(417)
    }
}