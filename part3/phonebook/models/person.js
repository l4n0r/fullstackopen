const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
require('dotenv').config()
const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function (v) {
                return /^[0-9]{2,3}-[0-9]+$/.test(v)
            },
            message: props => `${props.value} is not a valid format. Must be 2-3 digits, a dash, then more digits.`
        },
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)