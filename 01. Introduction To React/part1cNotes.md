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
