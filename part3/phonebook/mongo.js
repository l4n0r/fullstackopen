const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

mongoose.set('strictQuery', false)
mongoose.connect(url)

const peoplechema = new mongoose.Schema({
	name: String,
	number: String,
})
const Person = mongoose.model('Person', peoplechema)

if (process.argv.length < 3) {
	Person.find({}).then(result => {
		console.log('phonebook:')
		result.forEach(person => {
			console.log(`${person.name} ${person.number}`)
		})
		mongoose.connection.close()
		return
	})
} else {
	const name = process.argv[2]
	const number = process.argv[3]
	const person = new Person({
		name,
		number
	})
	
	person.save().then(result => {
		console.log(`added ${name} number ${number} to phonebook`)
		mongoose.connection.close()
	})
}

