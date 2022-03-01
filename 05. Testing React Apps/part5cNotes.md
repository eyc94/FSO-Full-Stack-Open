# Testing React Apps
- Many ways to test React apps.
- Still using `Jest` testing library.
    - Configured by default to apps created with `create-react-app`.
- Need another testing library that helps render components.
    - This is `react-testing-library`.
- Install it:
```
npm install --save-dev @testing-library/react @testing-library/jest-dom
```
- Also installed `jest-dom`.
    - Provides Jest-related helper methods.
- Write tests for the component responsible for rendering a note:
```javascript
const Note = ({ note, toggleImportance }) => {
    const label = note.important
        ? 'make not important'
        : 'make important';

    return (
        <li className='note'>
            {note.content}
            <button onClick={toggleImportance}>{label}</button>
        </li>
    );
};
```
- The `li` element has CSS classname `note`.
    - This is used to access the component in our tests.

