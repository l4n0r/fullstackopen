import { useState } from 'react'

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

const Persons = ({ persons, filter }) => (
	<ul>
		{persons.filter(
			person => person.name.toLowerCase().includes(
				filter.toLowerCase()
			)).map(
				person => <li key={person.name}>{person.name} {person.number}</li>
			)
		}
	</ul>
)

const App = () => {
	const [persons, setPersons] = useState([
		{ name: 'Arto Hellas', number: '040-123456', id: 1 },
		{ name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
		{ name: 'Dan Abramov', number: '12-43-234345', id: 3 },
		{ name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
	])
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
			alert(newName + ' is already added to phonebook')
			return
		}

		const newPerson = {
			id: persons.length,
			name: newName,
			number: newNumber
		}
		setPersons(persons.concat(newPerson))
	}

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
			<Persons persons={persons} filter={newNameFiltered} />
		</div>
	)
}

export default App