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
            currentCounter: 'none',
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
            this._CounterModel.findOne({ channel }).then(result => {

                if(result.currentCounter === 'none') {
                    this._CounterModel.updateOne({
                        channel: channel
                    },
                    {
                        $set: {
                            currentCounter: name
                        }
                    }).then(result => {
                        console.log(`${channel}'s counter ${name} created and updated! ${result}`)
                    })
                }
                else {
                    console.log(`${channel}'s counter ${name} created! ${result}`)
                }
            })
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

    increaseCounter = (channel, callback) => {
        this._CounterModel.findOne({ channel }).then(result => {
            this._CounterModel.updateOne({
                channel: channel,
                'counters.name': result.currentCounter
            },
            {
                $inc: {
                    'counters.$.value': 1
                }
            }).then(result => {
                console.log(`${channel}'s counter increased!`)
                callback()
            }).catch(err => {
                console.log(`increaseCounterErr: ${err}`)
            })
        })
    }

    decreaseCounter = (channel, callback) => {
        this._CounterModel.findOne({ channel }).then(result => {
            this._CounterModel.updateOne({
                channel: channel,
                'counters.name': result.currentCounter
            },
            {
                $inc: {
                    'counters.$.value': -1
                }
            }).then(result => {
                console.log(`${channel}'s counter increased!`)
                callback()
            }).catch(err => {
                console.log(`increaseCounterErr: ${err}`)
            })
        })
    }

    setCounter = (channel, value, callback) => {
        this._CounterModel.findOne({ channel }).then(result => {
            this._CounterModel.updateOne({
                channel: channel,
                'counters.name': result.currentCounter
            },
            {
                $set: {
                    'counters.$.value': value
                }
            }).then(result => {
                console.log(`${channel}'s counter defined! ${result}`)
                callback()
            }).catch(err => {
                console.log(`setCounterErr: ${err}`)
            })
        })
    }

    changeCounter = (channel, name, callback) => {
        this._CounterModel.updateOne({
            channel: channel
        },
        {
            $set: {
                currentCounter: name
            }
        }).then(result => {
            console.log(`${channel}'s counter changed to ${name}! ${result}`)
            callback()
        }).catch(err => {
            console.log(`changeCounterErr: ${err}`)
        })
    }
}

module.exports = () => {
    return CounterDAO
}