import React, { useState } from 'react';
import Filter from './components/Filter';

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '123-342-8382', id: 1 },
        { name: 'Ada Lovelace', number: '048-372-0982', id: 2 },
        { name: 'Dan Abramov', number: '203-193-2394', id: 3 },
        { name: 'Mary Poppendieck', number: '119-399-1928', id: 4 }
    ]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filterName, setFilterName] = useState('');

    const addPerson = (event) => {
        event.preventDefault();
        const personObject = {
            name: newName,
            number: newNumber
        };

        if (persons.filter(person => person.name.toLowerCase() === newName.toLowerCase()).length > 0) {
            const msg = `${newName} is already added to the phonebook`;
            window.alert(msg);
        } else {
            setPersons(persons.concat(personObject));
        }
        setNewName('');
        setNewNumber('');
    };

    const handlePersonChange = (event) => {
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilterName(event.target.value);
    };

    const personsToShow = persons.filter(person => {
        return person.name.toLowerCase().includes(filterName.toLowerCase());
    });

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter filterName={filterName} changeHandler={handleFilterChange} />
            <h2>Add New</h2>
            <form onSubmit={addPerson}>
                <div>name: <input value={newName} onChange={handlePersonChange} /></div>
                <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
                <div><button type="submit">add</button></div>
            </form>
            <h2>Numbers</h2>
            {personsToShow.map(person =>
                <div key={person.name}>{person.name} {person.number}</div>
            )}
        </div>
    )
};

export default App;