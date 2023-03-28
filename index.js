const express = require('express')
const app = express()

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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const numOfPeople = `<h1>Phonebook has info for ${persons.length} people</h1>`
    const date = new Date()
    const currentTime = `<h1>${date}</h1>`
    response.send(`${numOfPeople}\n${currentTime}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(`id is ${id}`)
    const person = persons.find(person => person.id === id)
    console.log(`person is ${person}`)
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})