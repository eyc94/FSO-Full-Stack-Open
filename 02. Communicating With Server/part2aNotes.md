# Rendering a Collection, Modules

## console.log()
- Experienced programmers use `console.log()` very often.
- Remember not to concatenate in a `console.log()`. Use a comma.

## Protip: Visual Studio Code Snippets
- Easy to create snippets for VSCode.
    - Snippets are shortcuts for quickly generating commonly re-used portions of code.
    - Like `sout` in Netbeans.
- Instructions to create snippets: `https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets`
- There are ready-made snippets as VSCode plugins.
- Most important snippet is for `console.log()`.
    - `clog` can be created like:
```javascript
{
    "console.log": {
        "prefix": "clog",
        "body": [
            "console.log('$1')",
        ],
        "description": "Log output to console"
    }
}
```
- However, using the log function is so common, so VSCode has a snippet built in.
    - Type `log` and tab to autocomplete.

## JavaScript Arrays
- We will be using the functional programming methods of arrays.
    - `find`, `filter`, and `map`.
- These videos will help: `https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84`
    - Higher Order Functions: `https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84`
    - Map: `https://www.youtube.com/watch?v=bCqtb-Z5YGQ&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=3`
    - Reduce Basics: `https://www.youtube.com/watch?v=Wl98eZpkp-c&t=31s`

## Event Handlers Revisited
- Look at the previous part's explanation.
- Can also find information on passing event handlers to child components.

## Rendering Collections
- We now do the 'frontend' or browser-side application logic in React.
- This is for an app that is similar to example app from part 0.
- Start with `App.js`:
```javascript
import React from 'react';

const App = (props) => {
    const { notes } = props;

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                <li>{notes[0].content}</li>
                <li>{notes[1].content}</li>
                <li>{notes[2].content}</li>
            </ul>
        </div>
    )
};
```
- Next with `index.js`:
```javascript
import ReactDOM from 'react-dom';
import App from './App';

const notes = [
    {
        id: 1,
        content: 'HTML is easy',
        date: '2019-05-30T17:30:31.098Z',
        important: true
    },
    {
        id: 2,
        content: 'Browser can execute only JavaScript',
        date: '2019-05-30T18:39:34.091Z',
        important: false
    },
    {
        id: 3,
        content: 'GET and POST are the most important methods of HTTP protocol',
        date: '2019-05-30T19:20:14.298Z',
        important: true
    }
];

ReactDOM.render(
    <App notes={notes} />,
    document.getElementById('root')
);
```
- We see the array of notes.
- Indexing that way works because we have exactly 3 items in the array.
- Index is hard-coded.
- Instead of generating React elements using indices, use the array `map` function.
- We can generate React elements like so.
```javascript
notes.map(note => <li>{note.content}</li>);
```
- The result is an array of `li` elements:
```javascript
[
    <li>HTML is easy</li>,
    <li>Browser can execute only JavaScript</li>,
    <li>GET and POST are the most important methods of HTTP protocol</li>
]
```
- Can be placed inside `ul` tags:
```javascript
const App = (props) => {
    const { notes } = props;

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note => <li>{note.content}</li>)}
            </ul>
        </div>
    )
};
```
- Notice the JS code in the JSX template wrapped in curly braces.
- We can make it more readable.
```javascript
const App = (props) => {
    const { notes } = props;

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note =>
                    <li>
                        {note.content}
                    </li>
                )}
            </ul>
        </div>
    )
};
```