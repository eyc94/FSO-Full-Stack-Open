import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './components/Button';

const App = () => {
    const [countries, setCountries] = useState([]);
    const [countryFilter, setCountryFilter] = useState('');

    useEffect(() => {
        axios
            .get('https://restcountries.com/v3.1/all')
            .then(response => {
                setCountries(response.data);
            });
    }, []);

    const handleChangeFilter = (event) => {
        setCountryFilter(event.target.value);
    };

    const showHandler = () => {

    };

    const countriesToShow = countries.filter(country => {
        return country.name.common.toLowerCase().includes(countryFilter.toLowerCase());
    });

    // If there is 1 country matched.
    if (countriesToShow.length === 1) {
        const keys = Object.keys(countriesToShow[0].languages);
        return (
            <div>
                <div>find countries <input value={countryFilter} onChange={handleChangeFilter} /></div>
                <h2>{countriesToShow[0].name.common}</h2>
                <div>Capital: {countriesToShow[0].capital[0]}</div>
                <div>Population: {countriesToShow[0].population}</div>
                <h3>Languages</h3>
                <ul>
                    {keys.map(key =>
                        <li key={key}>{countriesToShow[0].languages[key]}</li>
                    )}
                </ul>
                <img src={countriesToShow[0].flags.png}></img>
            </div>
        )
    }

    // If there are more than 10 countries.
    if (countriesToShow.length > 10) {
        return (
            <div>
                <div>find countries <input value={countryFilter} onChange={handleChangeFilter} /></div>
                Too many matches, specify another filter
            </div>
        )
    }

    // If there are 10 or less countries.
    return (
        <div>
            <div>find countries <input value={countryFilter} onChange={handleChangeFilter} /></div>
            {countriesToShow.map(country => {
                return (
                    <div key={country.name.common}>
                        {country.name.common}
                        <Button country={country} />
                    </div>
                )
            })}
        </div>
    )
};

export default App;