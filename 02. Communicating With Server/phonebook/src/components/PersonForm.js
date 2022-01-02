import React from 'react';

const PersonForm = (props) => {
    return (
        <form onSubmit={props.submitHandler}>
            <div>Name: <input value={props.nameValue} onChange={props.nameChangeHandler} /></div>
            <div>Number: <input value={props.numValue} onChange={props.numChangeHandler} /></div>
            <div><button type="submit">add</button></div>
        </form>
    )
};

export default PersonForm;