import React from 'react';

const Person = (props) => {
    return (
        <div key={props.name}>
            {props.name} {props.number}
            <button onClick={props.delPerson}>Delete</button>
        </div>
    )
};

export default Person;