import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        axios
            .get('https://restcountries.com/v3.1/all')
            .then(response => {
                setCountries(response.data);
            });
    }, []);

    return (
        <div>
            <div>find countries <input /></div>
        </div>
    )
};

export default App;