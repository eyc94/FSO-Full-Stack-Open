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