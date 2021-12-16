import React, { useState } from 'react';

const Button = (props) => {
    return (
        <button onClick={props.handleClick}>{props.text}</button>
    )
};

const StatisticLine = (props) => {
    if (props.text === "positive") {
        return (
            <div>{props.text} {props.value} %</div>
        )
    }
    return (
        <div>{props.text} {props.value}</div>
    )
};

const Statistics = (props) => {
    if (props.good === 0 && props.neutral === 0 && props.bad === 0) {
        return (
            <div>
                No feedback given
            </div>
        )
    }

    return (
        <>
            <StatisticLine text="good" value={props.good} />
            <StatisticLine text="neutral" value={props.neutral} />
            <StatisticLine text="bad" value={props.bad} />
            <StatisticLine text="all" value={props.total} />
            <StatisticLine text="average" value={props.average} />
            <StatisticLine text="positive" value={props.positive} />
        </>
    )
};

const App = () => {
    // Save clicks of each button to its own state.
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    const total = good + neutral + bad;
    const average = (good - bad) / total;
    const positive = good / total * 100;

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
            <Button handleClick={goodClickHandler} text="good" />
            <Button handleClick={neutralClickHandler} text="neutral" />
            <Button handleClick={badClickHandler} text="bad" />

            <h2>Statistics</h2>
            <Statistics
                good={good}
                neutral={neutral}
                bad={bad}
                total={total}
                average={average}
                positive={positive}
            />
        </>
    )
};

export default App;