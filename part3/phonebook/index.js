const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(express.json())
morgan.token('body', (req) => {
	if (req.method === 'POST' || req.method === 'PUT') return JSON.stringify(req.body)
	return '';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

app.get('/api/people', (request, response) => {
	Person.find({}).then(people => response.json(people))
})

app.get('/api/people/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
		}).catch(error => next(error))
})

app.put('/api/people/:id', (request, response, next) => {
	const { name, number } = request.body

	Person.findById(request.params.id)
		.then(person => {
			if (!person) {
				return response.status(404).end()
			}

			person.name = name
			person.number = number

			return person.save().then((updatedPerson) => {
				response.json(updatedPerson)
			})
		})
		.catch(error => next(error))
})

app.post('/api/people', (request, response, next) => {
	const body = request.body

	if (!body.name || !body.number) {
		return response.status(400).json({ error: 'invalid name or number' })
	}

	const person = new Person({
		name: body.name,
		number: body.number
	})

	person.save().then(savedPerson => {
		response.json(savedPerson)
	}).catch(error => (next(error)))
})

app.delete('/api/people/:id', (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then(deletedPerson => {
			response.json(deletedPerson)
			response.status(204).end()
		}).catch(error => (next(error)))
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}

	next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})