
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const Person = require('./models/person')

morgan.token('body', (req, res) => req.body ? JSON.stringify(req.body) : '')

const mongoUrl = process.env.MONGO_URL
if (!mongoUrl) {
  console.log('MONGO_URL env var not provided. Cant start application, exiting...')
  process.exit(1)
}
mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl)
  .then( result => console.log('connected to MongoDB'))
  .catch( error => {
    console.log('error connecting to MongoDB:', error)
    console.log('exiting...')
    process.env.exit(1)
  })

const app = express()

app.use(express.static('dist'))
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, resp, next) => {
  Person.find({})
    .then( results => resp.json(results) )
    .catch( error => next(error) )
})
app.get('/api/persons/:id', (req, resp, next) => {
  const id = req.params.id

  Person.findById(id)
    .then(result => {
      if (result) {
        resp.json(result)
        return
      }
      resp.status(404).send({ error: 'No such person in phonebook' })
    })
    .catch( error => next(error) )

})
app.post('/api/persons', (req, resp, next) => {
  if (!req.body) {
    resp.status(400).send({ error: 'Missing body or it\'s not in a json format' }).end()
    return
  }
  const requiredFields = ['name', 'number']
  const bodyFields = Object.keys(req.body)
  const requiredPresent = requiredFields.every( val => bodyFields.includes(val))

  if (!requiredPresent) {
    resp.status(400).json({ error: `Missing required fields. Required: ${requiredFields.join(', ')}` })
    return
  }

  // dont allow same name person to be added twice
  Person.find({ name: req.body.name })
    .then( results => {
      if (results.length > 0) {

        resp.status(400).send({ error: `Person with name ${req.body.name} is already in phonebook` })
        return
      }

      const newPerson = new Person( {
        name: req.body.name,
        number: req.body.number,
      })
      return newPerson.save()
        .then( result => resp.status(201).send(result) )
        .catch( error => next(error) )
    })
    .catch( error => next(error))
})
app.put('/api/persons/:id', (req, resp, next) => {
  if (!req.body) {
    resp.status(400).send({ error: 'Missing body or it\'s not in a json format' }).end()
    return
  }

  const id = req.params.id
  const { name, number } = req.body

  Person.findById(id)
    .then( person => {
      if (!person) {
        return resp.status(404).send({ error: 'No such person in phonebook' })
      }

      person.name = name
      person.number = number
      person.save()
        .then( updatedPerson => resp.json(updatedPerson))
        .catch( error => next(error) )
    } )
    .catch( error => next(error) )
})
app.delete('/api/persons/:id', (req, resp, next) => {
  const id = req.params.id

  Person.findByIdAndDelete(id)
    .then( result => resp.status(204).end() )
    .catch( error => next(error) )
})

app.get('/info', (req, resp) => {
  Person.find( {} )
    .then(persons => {
      const phonebookInfo = `Phonebook has info for ${persons.length} people`
      resp.status(200).send(`<p>${phonebookInfo}</p><p>${new Date()}</p>`)
    })
})

const handleErrors = (error, req, resp, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return resp.status(400).send({ error: 'Malformed object id' })
  } else
    if (error.name === 'ValidationError') {
      return resp.status(400).send({ error: error.message })
    }
  next(error)
}
app.use(handleErrors)

const PORT = process.env.PORT ? process.env.PORT : 3001
app.listen(PORT)