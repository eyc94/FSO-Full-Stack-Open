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

