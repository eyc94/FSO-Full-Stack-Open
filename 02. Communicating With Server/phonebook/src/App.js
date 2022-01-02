import React, { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';
import personService from './services/persons';

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filterName, setFilterName] = useState('');
    const [message, setMessage] = useState('this is a message...');

    useEffect(() => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons);
            });
    }, []);

    const addPerson = (event) => {
        event.preventDefault();
        const personObject = {
            name: newName,
            number: newNumber
        };

        if (persons.filter(person => person.name.toLowerCase() === newName.toLowerCase()).length > 0) {
            const updateMessage = `${newName} is already added to the phonebook. Replace the old number with the new one?`;
            // Use "if" window.confirm() to confirm update or not.
            if (window.confirm(updateMessage)) {
                const personToChange = persons.find(p => p.name.toLowerCase() === newName.toLowerCase());
                const changedPerson = { ...personToChange, number: newNumber };
                personService
                    .update(personToChange.id, changedPerson)
                    .then(returnedPerson => {
                        setPersons(persons.map(person => person.name.toLowerCase() !== newName.toLowerCase() ? person : returnedPerson));
                    });
            }
        } else {
            personService
                .create(personObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson));
                });
        }
        setNewName('');
        setNewNumber('');
    };

    const delPerson = (id, name) => {
        const delMessage = `Delete ${name}?`;
        if (window.confirm(delMessage)) {
            personService
                .del(id)
                .then(response => {
                    setPersons(persons.filter(person => person.id !== id));
                });
        }
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
            <Notification message={message} />
            <Filter filterName={filterName} changeHandler={handleFilterChange} />
            <h2>Add New</h2>
            <PersonForm
                submitHandler={addPerson}
                nameValue={newName}
                nameChangeHandler={handlePersonChange}
                numValue={newNumber}
                numChangeHandler={handleNumberChange}
            />
            <h2>Numbers</h2>
            <Persons delPerson={delPerson} persons={personsToShow} />
        </div>
    )
};

export default App;