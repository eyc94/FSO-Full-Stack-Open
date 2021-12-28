import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        console.log(event.target.value);
        setCountryFilter(event.target.value);
    };

    return (
        <div>
            <div>find countries <input value={countryFilter} onChange={handleChangeFilter} /></div>
        </div>
    )
};

export default App;