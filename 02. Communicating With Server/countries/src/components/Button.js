import React, { useState } from 'react';

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
                <div>
                    <h2>{props.country.name.common}</h2>
                    <div>Capital: {props.country.capital[0]}</div>
                    <div>Population: {props.country.population}</div>
                    <h3>Languages</h3>
                    <ul>
                        {keys.map(key =>
                            <li key={key}>{props.country.languages[key]}</li>
                        )}
                    </ul>
                    <img src={props.country.flags.png}></img>
                </div>
            </>
        )
    }

    return (
        <button onClick={showHandler}>{show ? 'hide' : 'show'}</button>
    )
};

export default Button;