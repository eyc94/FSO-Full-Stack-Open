import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = (props) => {
    const [weather, setWeather] = useState(null);
    const api_key = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        axios
            .get(`http://api.openweathermap.org/data/2.5/weather?q=${props.country.capital[0]}&appid=${api_key}`)
            .then(response => {
                setWeather({
                    temperature: response.data.main.temp,
                    icon: response.data.weather[0].icon,
                    windSpeed: response.data.wind.speed,
                    windDirection: response.data.wind.deg
                });
            });
    }, [api_key, props.country.capital[0]]);

    if (weather === null) {
        return <p>Loading weather info...</p>
    }

    return (
        <>
            <h3>Weather in {props.country.capital[0]}</h3>
            <div><strong>Temperature: </strong>{weather.temperature - 273.15} Celcius</div>
            <img src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}></img>
            <div><strong>Wind: </strong>{weather.windSpeed} MPH Direction {weather.windDirection} Degrees</div>
        </>
    )
};

export default Weather;