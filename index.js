require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()
const cors = require('cors')
morgan.token('requestBody', (req, res) => {
    return JSON.stringify(req.body)
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestBody'))

app.get('/api/persons', (request, response, next) => { // get request to api/persons
    Person.find({}).then(persons => {
        response.json(persons)
    }).catch(error => next(error))
})

app.get('/info', (request, response, next) => { // get request to /info
    Person.find({}).then(persons => {
        const numOfPeople = `<h1>phonebook has info for ${persons.length} person</h1>`
        const date = new Date()
        const currentTime = `<h1>${date}</h1>`
        response.send(`${numOfPeople}\n${currentTime}`)
    }).catch(error => next(error))

})

app.get('/api/persons/:id', (request, response, next) => { // get request to each individual id
    Person.findById(request.params.id).then(person => {
        if(person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => { // deletes a person
    Person.findByIdAndRemove(request.params.id).then(result =>{
        response.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => { // creates a new person
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    }).catch(error => next(error))

})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const newPerson = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, newPerson, {new: true}).then(updatedPerson => {
        res.json(updatedPerson)
    }).catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})