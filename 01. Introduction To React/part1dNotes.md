# A More Complex State, Debugging React Apps

## Complex State
- Our application consists of just an integer.
- What if we require a more complex state?
    - We can use `useState` to create separate "pieces" of state.
- Create two pieces of state named `left` and `right`.
```javascript
const App = () => {
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(0);

    return (
        <div>
            {left}
            <button onClick={() => setLeft(left + 1)}>
                left
            </button>
            <button onClick={() => setRight(right + 1)}>
                right
            </button>
            {right}
        </div>
    )
};
```
- Component above accesses two functions `setLeft` and `setRight` that it uses to update two pieces of state.
- Component's state or piece of its state can be any type.
    - Can implement same functionality by saving click count of both `left` and `right` buttons into an object.
```javascript
{
    left: 0,
    right: 0
}
```
- If so, the app looks like this:
```javascript
const App = () => {
    const [clicks, setClicks] = useState({
        left: 0, right: 0
    });

    const handleLeftClick = () => {
        const newClicks = {
            left: clicks.left + 1,
            right: clicks.right
        };
        setClicks(newClicks);
    };

    const handleRightClick = () => {
        const newClicks = {
            left: clicks.left,
            right: clicks.right + 1
        };
        setClicks(newClicks);
    };

    return (
        <div>
            {clicks.left}
            <button onClick={handleLeftClick}>left</button>
            <button onClick={handleRightClick}>right</button>
            {clicks.right}
        </div>
    )
};
```
- Component now has only a single piece of state.
- Event handlers change the state of the application.
- When the left button is clicked, it creates a new object.
    - This new object is then passed to the function that chnages the state to the new object.
    - The left property is now incremented.
    - The right property is the same.
- Can use `object spread` to write this more neatly.
```javascript
const handleLeftClick = () => {
    const newClicks = {
        ...clicks,
        left: clicks.left + 1
    };
    setClicks(newClicks);
};

const handleRightClick = () => {
    const newClicks = {
        ...clicks,
        right: clicks.right + 1
    };
    setClicks(newClicks);
};
```
- The `...clicks` basically copies the old object properties to the new object.
- We just have to modify the `left` or `right` properties depending on what button.
- Why didn't we just update state directly:
```javascript
const handleLeftClick = () => {
    clicks.left++;
    setClicks(clicks);
};
```
- It is **forbidden** in React to mutate states directly.
- Changing state must always be done by setting state to a new object.
- Storing click counters in a different piece of state is a better choice.

## Handling Arrays
- Create an array `allClicks` that remembers every click that occurs in the application.
```javascript
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
            <button onClick={handleLeftClick}>left</button>
            <button onClick={handleRightClick}>right</button>
            {right}
            <p>{allClicks.join(' ')}</p>
        </div>
    )
};
```
- Each click is stored in separate piece of state called `allClicks`.
    - `allClicks` is initialized as an empty array.
- When the left button is clicked, the letter `L` is added to `allClicks`.
- The state `allClicks` contains the previous state letters plus the new letter `L`.
    - Notice `concat()` is used.
    - Returns a new copy of the array with the new item added to it.
- We call the `join` method on the `allClicks` array.
    - This joins all items into a single string.
    - The letters are all separated with a space.

## Conditional Rendering
- Modify app so the rendering of clicking history is handled by `History` component.
```javascript
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
    // ...

    return (
        <div>
            {left}
            <button onClick={handleLeftClick}>left</button>
            <button onClick={handleRightClick}>right</button>
            {right}
            <History allClicks={allClicks} />
        </div>
    )
};
```
- Behavior of component is now delegated to the `History` component.
- This displays something to the user depending on whether a button has been clicked or not.
    - This is determined by looking at the length of `allClicks`.
    - When a button is not pressed, `allClicks` is empty.
- So, the text displayed differs depending on whether the `allClicks` is empty or not.
- This is called `conditional rendering` because the component rendering depends on conditions.
- There are other ways to do conditional rendering offered by React.
- Refactor again by using `Button` component.
```javascript
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

const Button = ({ handleClick, text }) => {
    <button onClick={handleClick}>
        {text}
    </button>
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
```

## Old React
- We used `state hook` to add state.
- Before hooks, there was no way to add state to components.
- Components requiring states had to be defined as `class` components.
    - Done using JS class syntax.
- Good to know legacy React for older systems out there.

## Debugging React Applications
- Large part of developer's time is figuring out why something is broken.
- Good practice and tools is important.
- Keep developer console open at all times!!
- Fix the bug before coding more.
- Print based debugging is a good idea too.
- Should print variables out to the console as well.
- Need to transform destructured back to less compact way before printing it.
- You can pause execution of app code console's debugger by writing `debugger` command.
- Can also add breakpoints in `Sources` tab.
- `Scope` tab shows values of component's variables.
- Recommended to add `React developer tools` extension:
    - `https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi`
    - Adds new `Components` tab to developer tools.
    - Can be used to inspect different React elements in the app with their props and state.
    - Shows state of hooks in order they were defined.

## Rules of Hooks
- Few limitations and rules.
- `useState` and `useEffect` must **not** be called from in a loop, conditional expression, or any place that is not a function defining a component.
    - This ensures no erratic behavior.
- Recap below:
```javascript
const App = () => {
    // these are ok
    const [age, setAge] = useState(0);
    const [name, setName] = useState('Juha Tariainen');

    if (age > 10) {
        // this does not work!
        const [foobar, setFoobar] = useState(null);
    }

    for (let i = 0; i < age; i++) {
        // also this is not good
        const [rightWay, setRightWay] = useState(false);
    }

    const notGood = () => {
        // and this is also illegal
        const [x, setX] = useState(-1000);
    };

    return (
        // ...
    )
};
```

## Event Handling Revisited
- Assume development of this simple application with the `App` component.
```javascript
const App = () => {
    const [value, setValue] = useState(10);

    return (
        <div>
            {value}
            <button>reset to zero</button>
        </div>
    )
};
```
- Desire to reset value when clicking the button.
- In order to make button react to a click event, we need to add an `event handler` to it.
    - Event handlers must always be a function or a reference to a function.
    - Will not work if event handler is a variable of any other type.
- If event handler was defined as a string, React warns us.
```javascript
<button onClick="crap...">button</button>
```
- The following also does not work.
```javascript
<button onClick={value + 1}>button</button>
```
- The above just returns the result of the operation.
- React will warn us.
- The below does not work either.
```javascript
<button onClick={value = 0}>button</button>
```
- The above is a variable assignment.
- React will warn us again.
- Also flawed because we must never mutate state directly.
- What about this one?
```javascript
<button onClick={console.log('clicked the button')}>
    button
</button>
```
- The log works when component is rendered but nothing happens on button click.
    - The event handler is a function call.
    - Event handler is assigned the returned value from the log function.
    - This is `undefined`.
- The log function gets executed with the component is rendered.
    - So, gets printed once to console.
- The below is flawed as well.
```javascript
<button onClick={setValue(0)}>button</button>
```
- The above is bad. Think about it.
    - The component is rendered and calls the `setValue(0)` function.
    - Changes to state causes re-rendering.
    - The component re-renders but calls the function again.
    - This is an infinite cycle.
- The proper way:
```javascript
<button onClick={() => console.log('clicked the button')}>
    button
</button>
```
- Now the event handler is a function defined with arrow syntax.
- No function gets called on component render.
- The function is just assigned to the button.
- Calling of function happens when button is clicked.
- Implement resetting the state like so:
```javascript
<button onClick={() => setValue(0)}>button</button>
```
- Defining event handlers in the onClick attribute of buttons is not the best idea.
- Often defined in a different place.
- The following assigns a function to the `handleClick` variable.
```javascript
const App = () => {
    const [value, setValue] = useState(10);

    const handleClick = () => {
        console.log('clicked the button');
    };

    return (
        <div>
            {value}
            <button onClick={handleClick}>button</button>
        </div>
    )
};
```
- The `handleClick` variable is referencing the function now.
- Reference is passed to the button as an `onClick` attribute.
- Our event handler function can have many commands.
    - Use curly braces.
```javascript
const App = () => {
    const [value, setValue] = useState(10);

    const handleClick = () => {
        console.log('clicked the button');
        setValue(0);
    };

    return (
        <div>
            {value}
            <button onClick={handleClick}>button</button>
        </div>
    )
};
```

## Function That Returns a Function
- Another way to use an event handler is to use function that returns a function.
- Make the following changes to code:
```javascript
const App = () => {
    const [value, setValue] = useState(10);

    const hello = () => {
        const handler = () => console.log('hello world');
        return handler;
    };

    return (
        <div>
            {value}
            <button onClick={hello()}>button</button>
        </div>
    )
};
```
- Event handler is now a function call.
- When React renders the component, the return value of `hello()` gets assigned to the `onClick` attribute.
    - The return value is a function.
    - The event handler is now a function.
- Change code a little bit.
```javascript
const App = () => {
    const [value, setValue] = useState(10);

    const hello = (who) => {
        const handler = () => {
            console.log('hello', who);
        }
        return handler;
    };

    return (
        <div>
            {value}
            <button onClick={hello('world')}>button</button>
            <button onClick={hello('react')}>button</button>
            <button onClick={hello('function')}>button</button>
        </div>
    )
};
```
- The app has 3 buttons with event handlers defined by the `hello` function.
    - This function accepts a parameter.
    - The function call returns a function definition that contains a log command with the string passed as a parameter.
- The `hello` function that creates the event handlers is like a factory that makes customized event handlers for greeting people.
- Refactor a bit:
```javascript
const hello = (who) => {
    return () => {
        console.log('hello', who);
    }
};
```
- We can omit braces as well.
```javascript
const hello = (who) => () => {
    console.log('hello', who);
};
```
- Use the same trick to make event handlers that set the state of component to a certain value.
```javascript
const App = () => {
    const [value, setValue] = useState(10);

    const setToValue = (newValue) => () => {
        setValue(newValue);
    }

    return (
        <div>
            {value}
            <button onClick={setToValue(1000)}>thousand</button>
            <button onClick={setToValue(0)}>reset</button>
            <button onClick={setToValue(value + 1)}>increment</button>
        </div>
    )
};
```
- Return `setToValue` function to a normal function.
```javascript
const App = () => {
    const [value, setValue] = useState(10);

    const setToValue = (newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            {value}
            <button onClick={() => setToValue(1000)}>
                thousand
            </button>
            <button onClick={() => setToValue(0)}>
                reset
            </button>
            <button onClick={() => setToValue(value + 1)}>
                increment
            </button>
        </div>
    )
};
```
- Matter of taste and preference when it comes to implementing how to define event handler functions.

## Passing Event Handlers to Child Components
- Extract button to its own component.
```javascript
const Button = (props) => {
    <button onClick={props.handleClick}>
        {props.text}
    </button>
};
```
- Component gets event handler function from `handleClick` prop.
- It gets text from the `text` prop.
- Make sure the correct attribute names are assigned and written when passing props to the component.