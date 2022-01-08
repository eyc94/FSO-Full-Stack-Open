import React from 'react';

const Filter = (props) => {
    return (
        <div>
            Filter Name: <input value={props.filterName} onChange={props.changeHandler} />
        </div>
    )
};

export default Filter;