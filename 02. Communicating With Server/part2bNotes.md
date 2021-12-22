# Forms
- Expand application by allowing users to add new notes.
- Best to store notes in `App` component's state to allow our page to update when adding new notes.
- Import the `useState` function and use it to define a piece of state.
    - Initialized with the initial notes array passed in props.
```javascript
import React, { useState } from 'react';
import Note from './components/Note';

const App = (props) => {
    const [notes, setNotes] = useState(props.notes);

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note =>
                    <Note key={note.id} note={note} />
                )}
            </ul>
        </div>
    )
};

export default App;
```
- The arrays of notes passed in to props is used as the initial state of the `notes` state.
- Can start with empty list of notes by setting initial value to an empty array.
    - Omit `props` because it's not used.
```javascript
const App = () => {
    const [notes, setNotes] = useState([]);

    // ...
};
```
- Stick with the initial value for the time being.
- Add an HTML `form` to component that is used to add new note.
```javascript
const App = (props) => {
    const [notes, setNotes] = useState(props.notes);

    const addNote = (event) => {
        event.preventDefault();
        console.log('button clicked', event.target);
    };

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note =>
                    <Note key={note.id} note={note} />
                )}
            </ul>
            <form onSubmit={addNote}>
                <input />
                <button type="submit">save</button>
            </form>
        </div>
    )
};
```
- The `addNote` function is an event handler to the form element.
    - This is called when user submits the form by clicking the submit button.
- The `event` parameter is the `event` that triggers the call to the event handler function:
    - The `event.preventDefault()` prevents the page from reloading.
    - This is the default behavior of submitting a form.
- The target is stored in `event.target`.
    - This is the form we defined.
- How do we access data in form's `input` element?
    - First method is through the use of `controlled components`.
- Add new piece of state called `newNote`.
    - This is to store user submitted input.
    - Set this as the input element's `value` attribute.
```javascript
const App = (props) => {
    const [notes, setNotes] = useState(props.notes);
    const [newNote, setNewNote] = useState(
        'a new note...'
    );

    const addNote = (event) => {
        event.preventDefault();
        console.log('button clicked', event.target);
    };

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note =>
                    <Note key={note.id} note={note} />
                )}
            </ul>
            <form onSubmit={addNote}>
                <input value={newNote} />
                <button type="submit">save</button>
            </form>
        </div>
    )
};
```
- Placeholder text for initial value of `newNote` is in the input element.
- However, input text cannot be edited.
    - There is a warning in the console to indicate what might have gone wrong.
    - We assigned a piece of the `App` component's state as the `value` attribute of input element.
        - This means the `App` component **controls** the behavior of the input element.
- To allow edits to input element, register an event handler.
    - This event handler synchronizes the changes made to the input with the component's state:
```javascript
const App = (props) => {
    const [notes, setNotes] = useState(props.notes);
    const [newNote, setNewNote] = useState(
        'a new note...'
    );

    const addNote = (event) => {
        event.preventDefault();
        console.log('button clicked', event.target);
    };

    const handleNoteChange = (event) => {
        console.log(event.target.value);
        setNewNote(event.target.value);
    };

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note =>
                    <Note key={note.id} note={note} />
                )}
            </ul>
            <form onSubmit={addNote}>
                <input
                    value={newNote}
                    onChange={handleNoteChange}
                />
                <button type="submit">save</button>
            </form>
        </div>
    )
};
```
- We registered event handler to the `onChange` attribute of the form's `input` element.
- Event handler is called every time a change occurs in the input element.
- Event handler receives the event object as its `event` parameter.
- The `target` property of event object is the controlled `input` element.
- The `event.target.value` is the input value of that element.
- Do not need `event.preventDefault()` because it's not a form submission.
- The `newNote` state contains the current value of the input.
- Complete `addNote` function for creating new notes:
```javascript
const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
        content: newNote,
        date: = new Date().toISOString(),
        important: Math.random() < 0.5,
        id: notes.length + 1
    };

    setNotes(notes.concat(nobeObject));
    setNewNote('');
};
```
- Created a new object called `noteObject`.
    - Gets content from component's `newNote` state.
- The `id` is based on total number of notes.
    - This works because notes are never deleted.
- Our note has a 50% chance of being important.
- We see the new note is added to the list of notes using `concat` method.
    - The method creates a new copy of the array with the new item added to the end.
    - NEVER mutate state directly in React.
- The event handler also resets the value of the controlled input element.
    - Done by calling `setNewNote` with an empty string.

## Filtering Displayed Elements
- View only important notes.
- Add piece of state to `App` that keeps track of which notes to display.
```javascript
const App = (props) => {
    const [notes, setNotes] = useState(props.notes);
    const [newNote, setNewNote] = useState('');
    const [showAll, setShowAll] = useState(true);

    // ...
};
```
- Make a `notesToShow` variable that stores list of all notes to display.
- Items of this list depend on state of `showAll`.
```javascript
import React, { useState } from 'react';
import Note from './components/Note';

const App = (props) => {
    const [notes, setNotes] = useState(props.notes);
    const [newNote, setNewNote] = useState('');
    const [showAll, setShowAll] = useState(true);

    // ...

    const notesToShow = showAll
        ? notes
        : notes.filter(note => note.important === true);
    
    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notesToShow.map(note =>
                    <Note key={note.id} note={note} />
                )}
            </ul>
        </div>
    )
};
```
- The `notesToShow` variable depends on the state of `showAll`.
- Uses a conditional operator.
    - If `showAll` is true, the app just shows all notes.
    - Otherwise, the `notes` array is filtered to hold only those notes that are important.
    - This filtered array is now in `notesToShow` array.
- Comparison operator is redundant.
    - Value of `note.important` is true or false either way.
```javascript
notes.filter(note => note.important);
```
- Safer to use triple equals than double equals.
- Need to add functionality to change the state of `showAll` from true to false and vice versa.
```javascript
import React, { useState } from 'react';
import Note from './components/Note';

const App = (props) => {
    const [notes, setNotes] = useState(props.notes);
    const [newNote, setNewNote] = useState('');
    const [showAll, setShowAll] = useState(true);

    // ...

    return (
        <div>
            <h1>Notes</h1>
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all' }
                </button>
            </div>
            <ul>
                {notesToShow.map(note =>
                    <Note key={note.id} note={note} />
                )}
            </ul>
        </div>
    )
};
```
- The displayed notes depend on the button I press.
    - The button changes the state of `showAll`.
- Event handler for the button calls the function that modifies the `showAll` state.
    - Simple so it is defined in the attribute.
- Text of button depends on `showAll` state as well.