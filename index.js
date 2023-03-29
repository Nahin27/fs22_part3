const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
morgan.token('requestBody', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestBody'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => { //generates a random id for post requests
    return Math.floor(Math.random() * 1000000000)
}

app.get('/api/persons', (request, response) => { // get request to api/persons
    response.json(persons)
})

app.get('/info', (request, response) => { // get request to /info
    const numOfPeople = `<h1>Phonebook has info for ${persons.length} people</h1>`
    const date = new Date()
    const currentTime = `<h1>${date}</h1>`
    response.send(`${numOfPeople}\n${currentTime}`)
})

app.get('/api/persons/:id', (request, response) => { // get request to each individual id
    const id = Number(request.params.id) // gets the id from the url
    const person = persons.find(person => person.id === id) // finds person with corresponding id
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => { // deletes a person
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => { // creates a new person
    const body = request.body
    const checkName = persons.find(person => body.name === person.name)

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    if(checkName) {
        return response.status(400).json({
            error: 'the name already exists'
        })
    }
    
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})