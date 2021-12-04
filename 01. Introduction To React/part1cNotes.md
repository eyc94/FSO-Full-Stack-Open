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