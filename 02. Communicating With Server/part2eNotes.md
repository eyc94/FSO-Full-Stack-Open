# Adding Styles To React App
- Appearance of app is modest.
- Add styles to React app.
    - Different ways of doing this.
- Add CSS to app the old-school way.
    - A single file that handles the CSS code.
- Add new file `index.css` under the `src` folder.
- Add to application by importaing to `index.js` file.
```javascript
import './index.css';
```
- Add rule to `index.css`:
```css
h1 {
    color: green;
}
```
- When `index.js` changes, React does not automatically notice it, so refresh browser.
- CSS has selectors and declarations.
    - Selectors define which elements rule applies to.
    - Selector above is the `h1` header tag.
    - Declaration sets color to green.
- 1 CSS rule can have a lot of properties.
- Make previous rule text cursive.
```css
h1 {
    color: green;
    font-style: italic;
}
```
- Can use many types of CSS selectors.
- If we wanted to target each note with our style, use the selector `li`.
    - All notes are wrapped in `li` tag.
```javascript
const Note = ({ note, toggleImportance }) => {
    const label = note.important ? 'make not important' : 'make important';

    return (
        <li>
            {note.content}
            <button onClick={toggleImportance}>{label}</button>
        </li>
    )
};
```
- Add the rule to our style sheet:
```css
li {
    color: grey;
    padding-top: 3px;
    font-size: 15px;
}
```
- Problematic because there may be other `li` tags.
- Better to use `class selectors`.
- In HTML, classes are defined like:
```html
<li class="note">some text...</li>
```
- In React, we use `className` attribute instead of `class`.
- Make the changes to `Note` component:
```javascript
const Note = ({ note, toggleImportance }) => {
    const label = note.important ? 'make not important' : 'make important';

    return (
        <li className='note'>
            {note.content}
            <button onClick={toggleImportance}>{label}</button>
        </li>
    )
};
```
- Class selectors defined with a dot.
```css
.note {
    color: grey;
    padding-top: 5px;
    font-size: 15px;
}
```
- If you add other `li` elements to app, they are not affected by the above rule.

## Improved Error Message
- There was an error handling implementation that triggers if the user tries to change the importance of a note that was deleted.
- Implement error message as its own React component.
```javascript
const Notification = ({ message }) => {
    if (message === null) {
        return null;
    }

    return (
        <div className='error'>
            {message}
        </div>
    )
};
```
- If `message` is `null`, nothing is rendered.
- Otherwise, the message gets rendered inside of a div element.
- Add new piece of state called `errorMessage` to `App`.
    - Initialize with error message to test component:
```javascript
const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState('some error happened...');

    // ...

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all' }
                </button>
            </div>
            // ...
        </div>
    )
};
```
- Add style rule for the error message:
```css
.error {
    color: red;
    background: lightgrey;
    font-size: 20px;
    border-style: solid;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
}
```
- Add logic to display error.
- Change `toggleImportanceOf` function:
```javascript
const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
        .update(changedNote).then(returnedNote => {
            setNotes(notes.map(note => note.id !== id ? note : returnedNote));
        })
        .catch(error => {
            setErrorMessage(
                `Note '${note.content};' was already removed from the server.`
            );
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
            setNotes(notes.filter(n => n.id !== id));
        });
};
```
- When error occurs, we add error message to state.
- At the same time, a timer is started.
    - This sets `errorMessage` state to `null` after five seconds.

## Inline Styles
- Can write styles directly in code.
    - This is called `inline styles`.
- Any component can be given a set of CSS properties as a JS object through the `style` attribute.
- CSS rules defined differently in JS than in normal CSS.
    - Say I wanted to give an element a color green and italic font 16 pixels in size.
- This is what it looks like in CSS:
```css
{
    color: green;
    font-style: italic;
    font-size: 16px;
}
```
- This is what it looks like as a React inline style object:
```javascript
{
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
}
```
- Every CSS property is a separate property of JS object.
- Numeric is integers.
- Notice the hyphenated words turn to camelCase.
- Add bottom block to app by creating a `Footer` component:
```javascript
const Footer = () => {
    const footerStyle = {
        color: 'green',
        fontStyle: 'italic',
        fontSize: 16
    };
    return (
        <div style={footerStyle}>
            <br />
            <em>Note app, Eric Chin 2022</em>
        </div>
    )
};

const App = () => {
    // ...

    return (
        <div>
            <h1>Notes</h1>

            <Notification message={errorMessage} />

            // ...

            <Footer />
        </div>
    )
};
```
- Limitations with inline styles.
    - `pseudo-classes` can't be used straightforwardly.
- Goes against the grain of old conventions.
    - Best practice to separate CSS from content (HTML) and functionality (JS).
    - Write them in separate files.
- Philosophy of React is the opposite of this.
    - Separation of CSS, HTML and JS does not scale well in larger apps.
    - React bases division of application along the lines of its logical functional entities.
- Structural units making up application's functional entities are React components.
    - Component defines HTML for structuring content, the JS functions for determining functionality, and also component's styling.
    - All in one place.
    - This is to make components independent and reusable.