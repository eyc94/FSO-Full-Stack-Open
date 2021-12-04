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