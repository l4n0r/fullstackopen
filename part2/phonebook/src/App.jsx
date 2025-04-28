import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ name, onChange }) => <div>filter shown with: <input value={name} onChange={onChange} /></div>

const Form = ({ onSubmit, name, onChangeName, number, onChangeNumber }) => (
	<form onSubmit={onSubmit}>
		<div>name: <input value={name} onChange={onChangeName} /></div>
		<div>number: <input value={number} onChange={onChangeNumber} /></div>
		<div>
			<button type="submit">add</button>
		</div>
	</form>
)

const Persons = ({ persons, filter, deletePerson }) => (
	<ul>
		{persons.filter(
			person => person.name.toLowerCase().includes(
				filter.toLowerCase()
			)).map(
				person => <li key={person.name}>{person.name} {person.number}
					<button onClick={() => deletePerson(person.id)}>delete</button>
				</li>
			)
		}
	</ul>
)

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [newNameFiltered, setNewNameFiltered] = useState('')

	const handleChangeName = (event) => setNewName(event.target.value)
	const handleChangeNumber = (event) => setNewNumber(event.target.value)
	const handleChangeNameFiltered = (event) => setNewNameFiltered(event.target.value)

	const handleAddPerson = (event) => {
		event.preventDefault()

		const sameNamePersons = persons.filter((person) => person.name === newName)
		if (sameNamePersons.length > 0) {
			let samePerson = sameNamePersons[0]
			if (!window.confirm(`${samePerson.name} is already added to phoneobok, replace the number?`)) return
			personService.update(samePerson.id, {...samePerson, number: newNumber}).then(updatedPerson => setPersons(persons.map(p => p.id === updatedPerson.id ? updatedPerson : p)))
			return
		}

		let idsTakenOrdered = persons.map(person => Number(person.id)).sort((a, b) => Number(a) - Number(b))
		let newId = 0;
		for (let i = 0; i < idsTakenOrdered.length; i++) {
			if (idsTakenOrdered[i] !== newId) break
			newId++;
		}

		const newPerson = {
			id: newId.toString(),
			name: newName,
			number: newNumber
		}

		personService.create(newPerson).then(returnedPerson => {
			setPersons(persons.concat(returnedPerson))
			setNewName('')
			setNewNumber('')
		})
	}

	const getPersons = () => {
		personService
			.getAll()
			.then(initialPersons => setPersons(initialPersons))
	}

	const deletePerson = id => {
		if (!window.confirm("are you sure?")) return
		personService.remove(id).then(personDeleted => setPersons(persons.filter(person => person.id !== personDeleted.id)))
	}

	useEffect(getPersons, [])

	return (
		<div>
			<h2>Phonebook</h2>
			<Filter name={newNameFiltered} onChange={handleChangeNameFiltered} />

			<h2>Add a new</h2>
			<Form
				onSubmit={handleAddPerson}
				name={newName}
				onChangeName={handleChangeName}
				number={newNumber}
				onChangeNumber={handleChangeNumber}
			/>

			<h2>Numbers</h2>
			<Persons persons={persons} filter={newNameFiltered} deletePerson={deletePerson} />
		</div>
	)
}

export default App