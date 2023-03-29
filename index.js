require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()
const cors = require('cors')
morgan.token('requestBody', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestBody'))

app.get('/api/persons', (request, response) => { // get request to api/persons
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => { // get request to /info
    Person.find({}).then(persons => {
        const numOfPeople = `<h1>phonebook has info for ${persons.length} person</h1>`
        const date = new Date()
        const currentTime = `<h1>${date}</h1>`
        response.send(`${numOfPeople}\n${currentTime}`)
    })

})

app.get('/api/persons/:id', (request, response) => { // get request to each individual id
    Person.findById(request.params.id).then(person => {
        if(person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    }).catch(error => {
        return response.status(400).send({error: 'error'})
    })
})

app.delete('/api/persons/:id', (request, response) => { // deletes a person
    Person.findByIdAndRemove(request.params.id).then(result =>{
        response.status(204).end()
    }).catch(error => {
        console.log(error)
        return response.status(400).send({error: 'error'})
    })
})

app.post('/api/persons', (request, response) => { // creates a new person
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
    })

})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body
    const newPerson = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, newPerson, {new: true}).then(updatedPerson => {
        res.json(updatedPerson)
    }).catch(error => {
        res.status(400).send({error:'error'})
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})