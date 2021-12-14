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
