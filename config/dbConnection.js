const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/overlay_counter')
    .then(() => console.log('Database connected!'))
    .catch(() => console.log('Database connection error!'))

const CounterSchema = mongoose.Schema({
    channel: {
        type: String,
        required: true
    },
    counters: [
        {
            name: {
                type: String
            },
            value: {
                type: Number
            }
        }
    ]
})

const CounterModel = mongoose.model('channel_counter', CounterSchema)

module.exports = { CounterModel }