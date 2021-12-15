import React, { useState } from 'react';

const Display = ({ counter }) => <div>{counter}</div>;

const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>
        {text}
    </button>
);

const History = (props) => {
    if (props.allClicks.length === 0) {
        return (
            <div>
                the app is used by pressing the buttons
            </div>
        )
    }

    return (
        <div>
            button press history: {props.allClicks.join(' ')}
        </div>
    )
};

const App = () => {
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(0);
    const [allClicks, setAll] = useState([]);

    const handleLeftClick = () => {
        setAll(allClicks.concat('L'));
        setLeft(left + 1);
    };

    const handleRightClick = () => {
        setAll(allClicks.concat('R'));
        setRight(right + 1);
    };

    return (
        <div>
            {left}
            <Button handleClick={handleLeftClick} text='left' />
            <Button handleClick={handleRightClick} text='right' />
            {right}
            <History allClicks={allClicks} />
        </div>
    )
};

export default App;

// Part 1C.
// import React, { useState } from 'react';

// const Display = ({ counter }) => <div>{counter}</div>;

// const Button = ({ onClick, text }) => (
//     <button onClick={onClick}>
//         {text}
//     </button>
// );

// const App = () => {
//     const [counter, setCounter] = useState(0);

//     const increaseByOne = () => setCounter(counter + 1);
//     const decreaseByOne = () => setCounter(counter - 1);
//     const setToZero = () => setCounter(0);

//     return (
//         <div>
//             <Display counter={counter} />
//             <Button onClick={increaseByOne} text='plus' />
//             <Button onClick={setToZero} text='zero' />
//             <Button onClick={decreaseByOne} text='minus' />
//         </div>
//     )
// };

// export default App;

// Code before "Page re-rendering" section of part 1.
// const Hello = ({ name, age }) => {
//     const bornYear = () => new Date().getFullYear() - age;

//     return (
//         <div>
//             <p>
//                 Hello {name}, you are {age} years old
//             </p>
//             <p>So you were probably born in {bornYear()}</p>
//         </div>
//     )
// };

// const App = () => {
//     const name = "Peter";
//     const age = 10;

//     return (
//         <div>
//             <h1>Greetings</h1>
//             <Hello name="Maya" age={26 + 10} />
//             <Hello name={name} age={age} />
//         </div>
//     )
// };