import React from 'react';

const Person = (props) => {
    const deleteHandler = () => {
        console.log('hi', props.identifier);
    };

    return (
        <div key={props.name}>
            {props.name} {props.number}
            <button onClick={deleteHandler}>Delete</button>
        </div>
    )
};

export default Person;