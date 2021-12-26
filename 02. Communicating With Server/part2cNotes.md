# Getting Data From The Server
- We will work on backend (server-side) functionality in part 3.
- Familiarize ourselves with how code executing in the browser communicates with the backend.
- Use a tool used during development called `JSON Server` to act as our server.
- Create `db.json` in root directory of project:
```json
{
    "notes": [
        {
            "id": 1,
            "content": "HTML is easy",
            "date": "2019-05-30T17:30:31.098Z",
            "important": true
        },
        {
            "id": 2,
            "content": "Browser can execute only JavaScript",
            "date": "2019-05-30T18:39:34.091Z",
            "important": false
        },
        {
            "id": 3,
            "content": "GET and POST are the most important methods of HTTP protocol",
            "date": "2019-05-30T19:20:14.298Z",
            "important": true
        }
    ]
}
```
- Can install JSON server globally on machine but is not necessary:
```
npm install -g json-server
```
- From root directory of app, run `json-server` using `npx`:
```
npx json-server --port 3001 --watch db.json
```
- `json-server` runs on port 3000 by default.
- The apps created with create-react-app uses 3000 by default, so we use 3001 for the `json-server`.
- Navigate to `http://localhost:3001/notes`.
    - Can see `json-server` serves the notes we wrote to the file in JSON format.
    - Might need plugin to view the data in JSON format.
- The workflow:
    - Save notes to the server (json-server).
    - React code fetches notes from the server and renders to screen.
    - When new note is added, React code also sends the note to the server.
    - This makes new note persist in "memory".
- `json-server` stores data in `db.json`.
- Real world uses databases to store data.
- `json-server` is a handy tool that enables server-side functionality in development phase without the need to program any of it.

## The Browser As A Runtime Environment
- First task:
    - Fetch existing notes to React app from `http://localhost:3001/notes`.
- Part 0 example project used `XMLHttpRequest`.
    - HTTP request made using an XHR object.
    - Introduced in 1999.
    - No longer recommended and browsers now support the `fetch` method based on `promises`.

## npm
- Can use the promise based function `fetch` to get data from server.
    - Good tool that is standardized and supported by all modern browsers.
- We use the `axios` library for communication between the browser and server.
    - Like fetch but more pleasant to use.
    - Adding external libraries (npm packages) to React projects.
- All JS projects are basically defined using `npm` (node package manager).
- Projects using create-react-app also use npm.
- To see if a project uses npm, look for `package.json` file in the root.
```json
{
    "name": "part2-notes",
    "version": "0.1.0",
    "private": true,
    "dependencies": {
        "@testing-library/jest-dom": "^5.11.9",
        "@testing-library/react": "^11.2.3",
        "@testing-library/user-event": "^12.6.0",
        "react": "^17.0.1",
        "react-dom": "^17.0.1",
        "react-scripts": "4.0.1",
        "web-vitals": "^0.2.4"
    },
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    },
    "eslintConfig": {
        "extends": [
            "react-app",
            "react-app/jest"
        ]
    },
    "browserslist": {
        "production": [
            ">0.2%",
            "not dead",
            "not op_mini all"
        ],
        "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
        ]
    }
}
```
- Right now, dependencies is most important.
    - This defines what dependencies (external libraries) the project has.
- We want to use axios.
    - Can define library in `package.json`.
    - Better to install from command line.
```
npm install axios
```
- `npm` should be run in the project root (where package.json is).
- The dependencies change:
```json
{
    "dependencies": {
        "@testing-library/jest-dom": "^5.11.9",
        "@testing-library/react": "^11.2.3",
        "@testing-library/user-event": "^12.6.0",
        "axios": "^0.21.1",
        "react": "^17.0.1",
        "react-dom": "^17.0.1",
        "react-scripts": "4.0.1",
        "web-vitals": "^0.2.4"
    },
    // ...
}
```
- The `npm install` command also downloaded the library code.
    - Code found in `node_modules` folder in the root.
- Make another addition:
    - Install `json-server` as a development dependency (used ony during development):
```
npm install json-server --save-dev
```
- Make a small addition to the `scripts` part of `package.json`.
```json
{
    // ... 
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject",
        "server": "json-server -p3001 --watch db.json"
    },
}
```
- We can conveniently start json-server from root with:
```
npm run server
```
- We used `npm install` twice.
```
npm install axios
npm install json-server --save-dev
```
- `axios` is installed as a runtime dependency.
    - Execution of program requires existence of this library.
- `json-server` is installed as a development dependency.
    - The program itself does not require it.
    - Used for assistance during software development.

## Axios and Promises
- json-server is assumed to run on port 3001.
- Use 2 terminal windows.
    - Run json-server.
    - Run application.
- Import library like any other to `index.js`:
```javascript
import axios from 'axios';

const promise = axios.get('http://localhost:3001/notes');
console.log(promise);

const promise2 = axios.get('http://localhost:3001/foobar');
console.log(promise2);
```
- Opening `http://localhost:3000` gets things printed to console.
- Note:
    - When `index.js` changes, React does not automatically refresh.
    - A way to make React notice changes in `index.js`.
        - Create `.env` file in root.
        - Add `FAST_REFRESH=false` line.
        - Restart application.
- The axios' method `get` returns a `promise`.
- Documentation about promises:
    - **A Promise is an object representing the eventual completion or failure of an asynchronous operation.**
    - A Promise has 3 distinct states:
        1. The promise is pending: Final value is not available yet.
        2. The promise is fulfilled: Operation completed and final value is available, which is usually successful. The state is called resolved.
        3. The promise is rejected: Error prevented final value from being determined, which means failure.
    - First promise is `fulfilled`, meaning success.
    - Second promise is `rejected`.
        - This is because we make an HTTP GET request to a non-existent address.
- When we want to access result of operation represented by promise, register event handler to promise.
    - Done using `then` method:
```javascript
const promise = axios.get('http://localhost:3001/notes');

promise.then(response => {
    console.log(response);
});
```
- We get the response printed to the console.
- JS runtime environment calls callback function registered by `then`.
    - Provides the `response` object as parameter.
    - `response` object has all data for response to an HTTP GET request.
        - Response includes returned data, status code, and headers.
- Storing promise object in variable is not necessary.
    - More common to chain the `then` method to the axios method call.
```javascript
axios.get('http://localhost:3001/notes').then(response => {
    const notes = response.data;
    console.log(notes);
});
```
- The code above gets the data from response and stores in notes and prints it.
- More readable below:
```javascript
axios
    .get('http://localhost:3001/notes')
    .then(response => {
        const notes = response.data;
        console.log(notes);
    });
```
- Data returned is plain text (one long string).
    - Axios can parse into JS array.
    - Server said the data is formatted as `application/json; charset=utf-8` with the `Content-Type` header.
- Can now use data fetched from server.
- Request notes from local server and render them as the `App` component.
    - Bad approach because we render the entire `App` component only when we successfully get a response.
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import axios from 'axios';

axios.get('http://localhost:3001/notes').then(response => {
    const notes = response.data;
    ReactDOM.render(
        <App notes={notes} />,
        document.getElementById('root')
    );
});
```
- App is problematic.
- Move fetching of data into the `App` component.
- Where should `axios.get` be placed in the component.

## Effect-Hooks
- Used `state hooks`.
- Now using `effect hooks`.
    - **The Effect Hook lets you perform side effects in function components. Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.**
- Effect hooks are used when fetching data from a server.
- Remove fetching of data from `index.js`.
    - No need to pass data as props to `App` component.
```javascript
ReactDOM.render(
    <App />,
    document.getElementById('root')
);
```
- Change `App` component:
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Note from './components/Note';

const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [showAll, setShowAll] = useState(true);

    useEffect(() => {
        console.log('effect');
        axios
            .get('http://localhost:3001/notes')
            .then(response => {
                console.log('promise fulfilled');
                setNotes(response.data);
            });
    }, []);
    console.log('render', notes.length, 'notes');

    // ...
};
```
- This is what's printed to the console.
```
render 0 notes
effect
promise fulfilled
render 3 notes
```
- Body of the function is executed.
- Component rendered for the first time.
    - The render 0 notes is printed, meaning data has not yet been fetched.
- The function defined in the `useEffect` function is executed immediately after rendering.
```javascript
() => {
    console.log('effect');
    axios
        .get('http://localhost:3001/notes')
        .then(response => {
            console.log('promise fulfilled');
            setNotes(response.data);
        });
}
```
- Then, 'effect' is printed.
- The command `axios.get` starts fetching of data from server.
- Also registers the following function as an `event handler` for the operation.
```javascript
response => {
    console.log('promise fulfilled');
    setNotes(response.data);
}
```
- When data arrives from server, JS runtime calls function registered as event handler.
    - Prints 'promise fulfilled'.
    - Stores notes received from server to state using state modifying function.
- The call to state modifying function re-renders component.
    - The 'render 3 notes' is printed.
    - Notes fetched from server are rendered to screen.
- Rewrite code a bit differently.
```javascript
const hook = () => {
    console.log('effect');
    axios
        .get('http://localhost:3001/notes')
        .then(response => {
            console.log('promise fulfilled');
            setNotes(response.data);
        });
};

useEffect(hook, []);
```
- It's a lot more clear.
- `useEffect` takes two parameters.
    - The first is the effect itself (the function).
        - **By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.**
    - By default, effect is always run after the component has been rendered.
        - We only want to execute the effect with the first render.
    - The second parameter is used to tell how often the effect is run.
        - If empty array `[]`, the effect is only run along with the first render of the component.
- Understanding the order of execution is important!
- We still have a problem that when adding new notes, they are not stored on the server.

## The Development Runtime Environment
- Review what happens and where.
- Basically, the JS of our React app is run in the browser.
    - Browser gets JS code from `React dev server`.
    - `React dev server` is the app that runs after `npm start`.
    - The dev server transforms JS code to format understood by browser.
        - Stitches JS from different files into one file.
- React app running in browser fetches JSON data from `json-server` running on port 3001.
    - The server we query data from, `json-server`, gets the data from `db.json`.
- All parts of the app happen to reside in the developer's machine (localhost).
- Situation changes when deploying to internet.