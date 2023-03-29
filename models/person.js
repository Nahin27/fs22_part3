const mongoose = require('mongoose')

const url = process.env.MONGO_URI
mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
    console.log("Connected to database")
}).catch(error => {
    console.log("Failed to connect")
})

const personSchema = new mongoose.Schema({
    name: String, 
    number: String
})

personSchema.set('toJSON', {
    transform: (d, r) => {
        r.id = r._id.toString()
        delete r._id
        delete r.__v
    }
})

module.exports = mongoose.model('Person', personSchema)