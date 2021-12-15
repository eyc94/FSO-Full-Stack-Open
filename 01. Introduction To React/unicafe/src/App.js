import React, { useState } from 'react';

const App = () => {
    // Save clicks of each button to its own tate.
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    const goodClickHandler = () => {
        setGood(good + 1);
    };

    const neutralClickHandler = () => {
        setNeutral(neutral + 1);
    };

    const badClickHandler = () => {
        setBad(bad + 1);
    };

    return (
        <>
            <h2>Give Feedback</h2>
            <button onClick={goodClickHandler}>good</button>
            <button onClick={neutralClickHandler}>neutral</button>
            <button onClick={badClickHandler}>bad</button>

            <h2>Statistics</h2>
            <div>good {good}</div>
            <div>neutral {neutral}</div>
            <div>bad {bad}</div>
        </>
    )
};

export default App;