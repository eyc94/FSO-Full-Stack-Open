import React from 'react';
import Person from './Person';

const Persons = (props) => {
    return (
        <>
            {props.persons.map(person =>
                <Person delPerson={() => props.delPerson(person.id, person.name)} key={person.name} name={person.name} number={person.number} />
            )}
        </>
    )
};

export default Persons;