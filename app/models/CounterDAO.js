class CounterDAO {
    constructor(CounterModel) {
        this._CounterModel = CounterModel
    }

    getCounter = async (channel) => {
        return await this._CounterModel.findOne({ channel })
    }

    createChannelCounter = (channel, callback) => {
        this._CounterModel.create({
            channel: channel,
            counters: []
        }).then(result => {
            console.log(`Channel created! ${result}`)
            callback(result)
        }).catch(err => {
            console.log(`createChannelCounterErr: ${err}`)
        })
    }

    createCounter = (channel, name) => {
        this._CounterModel.updateOne({
            channel: channel,
        },
        {
            $push: {
                counters: {
                    name: name,
                    value: 0
                }
            }
        }).then(result => {
            console.log(`${channel}'s counter ${name} created! ${result}`)
        }).catch(err => {
            console.log(`insertCounterErr: ${err}`)
        })
    }

    deleteCounter = (channel, name) => {
        this._CounterModel.updateOne({
            channel: channel
        },
        {
            $pull: {
                counters: {
                    name: name
                }
            }
        }
        ).then(result => {
            console.log(`${channel}'s counter ${name} deleted! ${result}`)
        }).catch(err => {
            console.log(`deleteCounterErr: ${err}`)
        })
    }    

    increaseCounter = (channel, name, callback) => {
        this._CounterModel.updateOne({
            channel: channel,
            'counters.name': name
        },
        {
            $inc: {
                'counters.$.value': 1
            }
        }).then(result => {
            console.log(`${channel}'s counter ${name} increased!`)
            callback()
        }).catch(err => {
            console.log(`increaseCounterErr: ${err}`)
        })
    }

    decreaseCounter = (channel, name) => {
        this._CounterModel.updateOne({
            channel: channel,
            'counters.name': name
        },
        {
            $inc: {
                'counters.$.value': -1
            }
        }).then(result => {
            console.log(`${channel}'s counter ${name} decreased! ${result}`)
        }).catch(err => {
            console.log(`decreaseCounterErr: ${err}`)
        })
    }

    setCounter = (channel, name, value) => {
        this._CounterModel.updateOne({
            channel: channel,
            'counters.name': name
        },
        {
            $set: {
                'counters.$.value': value
            }
        }).then(result => {
            console.log(`${channel}'s counter ${name} defined! ${result}`)
        }).catch(err => {
            console.log(`setCounterErr: ${err}`)
        })
    }
}

module.exports = () => {
    return CounterDAO
}