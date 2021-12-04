# Component State, Event Handlers

- Go back to React and start with new example:
```javascript
const Hello = (props) => {
    return (
        <div>
            <p>
                Hello {props.name}, you are {props.age} years old
            </p>
        </div>
    )
};

const App = () => {
    const name = 'Peter';
    const age = 10;

    return (
        <div>
            <h1>Greetings</h1>
            <Hello name="Maya" age={26 + 10} />
            <Hello name={name} age={age} />
        </div>
    )
};
```

## Component Helper Functions
- Expand `Hello` component to guess year of birth of person being greeted.
```javascript
const Hello = (props) => {
    const bornYear = () => {
        const yearNow = newDate().getFullYear();
        return yearNow - props.age;
    };

    return (
        <div>
            <p>
                Hello {props.name}, you are {props.age} years old
            </p>
            <p>So you were probably born in {bornYear()}</p>
        </div>
    )
};
```
- Logic for guessing year of birth is in its own function.
- Age of person not passed as parameter to new function.
    - Age is directly accessed by props.
- Helper function defined inside function that defines behavior of component.
- Common to define functions in functions.

## Destructuring
- Small but useful feature of JS allows us to `destructure` values from objects and arrays upon assignment.
- We referenced data to our components as `props.name` and `props.age`.
- We can assign values of properties to variables `name` and `age` directly.
- We know `props` is an object:
```javascript
props = {
    name: 'Arto Hellas',
    age: 35
};
```
```javascript
const Hello = (props) => {
    const name = props.name;
    const age = props.age;

    const bornYear = () => new Date().getFullYear() - age;

    return (
        <div>
            <p>Hello {name}, you are {age} years old</p>
            <p>So you were probably born in {bornYear()}</p>
        </div>
    )
};
```
- Notice the compact version of bornYear function.
- Destructuring makes it easier.
```javascript
const Hello = (props) => {
    const { name, age } = props;

    const bornYear = () => new Date().getFullYear() - age;

    return (
        <div>
            <p>Hello {name}, you are {age} years old</p>
            <p>So you were probably born in {bornYear()}</p>
        </div>
    )
};
```
- Take it a step further:
```javascript
const Hello = ({ name, age }) => {
    const bornYear = () => new Date().getFullYear() - age;

    return (
        <div>
            <p>Hello {name}, you are {age} years old</p>
            <p>So you were probably born in {bornYear()}</p>
        </div>
    )
};
```

## Page Re-rendering
- Appearance remains the same after initial rendering.
- Create a counter where the value increased as a function of time or at the click of a button.
- Modify `App.js`:
```javascript
import React from 'react';

const App = (props) => {
    const { counter } = props;
    return (
        <div>{counter}</div>
    )
};

export default App;
```
- Modify `index.js`:
```javascript
import ReactDOM from 'react-dom';
import App from './App';

let counter = 1;

ReactDOM.render(
    <App counter={counter} />,
    document.getElementById('root')
)
```
- Changing file `index.js` does not refresh page automatically so reloading browser is necessary.
- `App` is given value of counter via `counter` prop.
- Component won't re-render if we add a counter increment.
- Component can re-render by adding `ReactDOM.render` method.
```javascript
let counter = 1;

const refresh = () => {
    ReactDOM.render(<App counter={counter} />,
    document.getElementById('root'));
};

refresh();
counter += 1;
refresh();
counter += 1;
refresh();
```
- Component renders 3 times first with 1, then 2, and finally 3.
- Values 1 and 2 are shown for a short time, so cannot notice them.
- We can increment every second instead using `setInterval` method.
```javascript
setInterval(() => {
    refresh();
    counter += 1;
}, 1000);
```
- Making repeated calls to `ReactDOM.render` is NOT recommended.

## Stateful Component
- Components have not contained any state that could change during lifecycle of component.
- Add state to our application's `App` component with React's `state hook`.
- Change `index.js` back to:
```javascript
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
```
- Modify `App.js`:
```javascript
import React, { useState } from 'react';

const App = () => {
    const [ counter, setCounter ] = useState(0);

    setTimeout(
        () => setCounter(counter + 1),
        1000
    );

    return (
        <div>{counter}</div>
    )
};

export default App;
```
- The file imports the `useState` function.
- We see the function call which adds `state` to the component and initializes it to 0.
- Function returns an array of two items.
    - Assign items to variables `counter` and `setCounter` by using destructuring syntax.
    - `counter` is assigned initial value of state, 0.
    - `setCounter` is assigned to a function used to *modify* the state.
- Application calls `setTimeout` and passes two parameters:
    - The first is a function to increment the counter state.
    - The second is a timeout of 1 second.
- The function passed to `setTimeout` is called one second after calling `setTimeout`.
- When `setCounter` is called, React re-renders the component.
    - This means function body of component gets re-executed.

## Event Handling
- Change app so that counter is incremented on the click of a button.
    - Done using a `button` element.
- Button elements support `mouse events`.
    - `click` is the most common.
    - `click` event can also happen with the keyboard or touch screen.
- In React, registering an event handler to a `click` event is like this:
```javascript
const App = () => {
    const [ counter, setCounter ] = useState(0);

    const handleClick = () => {
        console.log('clicked');
    };

    return (
        <div>
            <div>{counter}</div>
            <button onClick={handleClick}>
                plus
            </button>
        </div>
    )
};
```
- Value of `onClick` attribute is a reference to the `handleClick` function.
- Every click of the button causes the `handleClick` function to be called.
    - Every click event causes the 'clicked' to log to console.
- The event handler function can also be directly defined in value.
```javascript
const App = () => {
    const [ counter, setCounter ] = useState(0);

    return (
        <div>
            <div>{counter}</div>
            <button onClick={() => console.log('clicked')}>
                plus
            </button>
        </div>
    )
};
```
- Change the event handler to:
```javascript
<button onClick={() => setCounter(counter + 1)}>
    plus
</button>
```
- The desired behavior is achieved.
- The `counter` is increased by 1 *and* component gets re-rendered.
- Add a button to reset counter:
```javascript
const App = () => {
    const [ counter, setCounter ] = useState(0);

    return (
        <div>
            <div>{counter}</div>
            <button onClick={() => setCounter(counter + 1)}>
                plus
            </button>
            <button onClick={() => setCounter(0)}>
                zero
            </button>
        </div>
    )
};
```

## Event Handler is a Function
- Event handlers are supposed to be a function or a function reference.
- We cannot use a function call.
- Defining event handlers within JSX-templates is not good.
- Separate them into separate functions:
```javascript
const App = () => {
    const [ counter, setCounter ] = useState(0);

    const increaseByOne = () => setCounter(counter + 1);
    const setToZero = () => setCounter(0);

    return (
        <div>
            <div>{counter}</div>
            <button onClick={increaseByOne}>
                plus
            </button>
            <button onClick={setToZero}>
                zero
            </button>
        </div>
    )
};
```