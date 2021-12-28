import React, { useState } from 'react';
import CountryInfo from './CountryInfo';

const Button = (props) => {
    const [show, setShow] = useState(false);

    const showHandler = () => {
        setShow(!show);
    };

    const keys = Object.keys(props.country.languages);

    if (show) {
        return (
            <>
                <button onClick={showHandler}>{show ? 'hide' : 'show'}</button>
                <CountryInfo country={props.country} />
            </>
        )
    }

    return (
        <button onClick={showHandler}>{show ? 'hide' : 'show'}</button>
    )
};

export default Button;