import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filterName, setFilterName] = useState('');

    useEffect(() => {
        axios
            .get('http://localhost:3001/persons')
            .then(response => {
                setPersons(response.data);
            });
    }, []);

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
            axios
                .post('http://localhost:3001/persons', personObject)
                .then(response => {
                    setPersons(persons.concat(response.data));
                });
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
            <PersonForm
                submitHandler={addPerson}
                nameValue={newName}
                nameChangeHandler={handlePersonChange}
                numValue={newNumber}
                numChangeHandler={handleNumberChange}
            />
            <h2>Numbers</h2>
            <Persons persons={personsToShow} />
        </div>
    )
};

export default App;