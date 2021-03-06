import React, { useState, useEffect } from 'react';
import Weather from './Weather';

const CountryInfo = (props) => {
    const keys = Object.keys(props.country.languages);

    return (
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
            <Weather country={props.country} />
        </div>
    )
};

export default CountryInfo;