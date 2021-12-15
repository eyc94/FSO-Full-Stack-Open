import React, { useState } from 'react';

const App = () => {
    // Save clicks of each button to its own tate.
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    return (
        <>
            <h2>Give Feedback</h2>
            <button>good</button>
            <button>neutral</button>
            <button>bad</button>

            <h2>Statistics</h2>
            <div>good {good}</div>
            <div>neutral {neutral}</div>
            <div>bad {bad}</div>
        </>
    )
};

export default App;