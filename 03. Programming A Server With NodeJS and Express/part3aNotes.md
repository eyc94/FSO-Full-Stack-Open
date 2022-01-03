# Node.js and Express
- Shift focus to backend.
    - Implement functionality on server side of stack.
- Build backend on top of `NodeJS`.
    - `NodeJS` is a JS runtime based on Google's `Chrome V8` JS engine.
- Browsers don't 100% support new JS features, so code running in browser must be *transpiled* with `babel`.
    - Different with JS running in backend.
    - Newest version of Node supports a lot of the new features of JS.
- Goal is to implement backend that works with notes application from Part 2.
- Start by creating a "hello world" application.
- We do NOT use `create-react-app` to initialize this project.
- The npm was mentioned in Part 2.
    - Tool for managing JS packages.
- Go to a directory of your choice.
    - Create new template for app with `npm init`.
    - Answer questions.
    - Result generates a `package.json` file at the root of project.
    - This contains information about the project.
```json
{
    "name": "backend",
    "version": "0.0.1",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "EC",
    "license": "MIT"
}
```
- The entry point is `index.js`.
- Make a change to the `scripts` object:
```json
{
    // ...
    "scripts": {
        "start": "node index.js",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    // ...
}
```
- Create first version of app by adding `index.js` file to the root.
```javascript
console.log('hello world');
```
- Run program directly with Node:
```
node index.js
```
- Or run as `npm script`:
```
npm start
```
- The `start` script works because of what we defined in `package.json`
- More customary to run tasks using npm scripts.
- We see the default `npm test` script.
    - Project does not have testing library, so `npm test` just executes the command listed as the value of "test".

# Simple Web Server
- Change the app into a web server by editing `index.js`:
```javascript
const http = require('http');

const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World');
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
```
- Once app is running, the message is printed to console.
- Open app at `http://localhost:3001`.
    - Server works the same regardless of latter part of URL.
    - `http://localhost:3001/foo/bar` also works.
- First line of code:
```javascript
const http = require('http');
```
- Imports Node's built-in web server module.
- Modules are defined using export and used with import.
- Node.js uses `CommonJS` modules.
    - Node does not support ES6 modules.
    - CommonJS modules function just like ES6 modules.
- Next chunk of code:
```javascript
const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World');
});
```
- `createServer` creates a new web server.
- Event handler called *every time* an HTTP request is made to `http://localhost:3001`.
    - Request responded to with status code 200.
    - With `Content-Type` set to `text/plain`.
    - Content to be returned set to `Hello World`.
- Last row binds http server assigned to the `app` variable.
    - Listens to HTTP requests on port 3001.
```javascript
const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
```
- Purpose of backend server here is to provide raw data in JSON format to frontend.
- Immediately change our server to return a hardcoded list of notes in the JSON format.
```javascript
const http = require('http');

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
];

const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(notes));
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
```
- Restart server and refresh browser.
- The `application/json` value of `Content-Type` header tells receiver that data is in JSON format.
- `notes` array transforms into JSON with `JSON.stringify(notes)` method.
- Opening browser displays the same format like before when we used `json-server` to serve the notes.

## Express
- What we did above implementing server code directly with Node's built-in `http` web server is cumbersome.
    - When app grows larger, it's tougher.
- Many libraries to make server side development with Node easier.
    - Pleasing interface to work with http module.
    - Provides better abstraction.
    - Most popular library is `express`.
- Install express:
```
npm install express
```
- Dependency is then added to `package.json`:
```json
{
    // ...
    "dependencies": {
        "express": "^4.17.1"
    }
}
```
- The code for dependencies is found in `node_modules` folder in the root.
- What does the caret mean in front of the version number of express?
    - Versioning model in npm is called `semantic versioning`.
    - Caret means that when dependency is updated, version of express will be at least 4.17.1.
    - Installed version can have a larger `patch` number (last digit), or a larger `minor` number (middle digit).
    - The `major` number (first digit) must be the same.
- Update dependencies with:
```
npm update
```
- If working on another computer, we can install all dependencies with the `package.json` file with the command:
```
npm install
```
- If `major` number of version does not change, newer versions should be `backwards compatible`.
- Future versions with 4 as the major number would still work with our version right now.

## Web and Express
- Go back to application and make changes:
```javascript
const express = require('express');
const app = express();

let notes = [
    ...
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (request, response) => {
    response.json(notes);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```
- Restart app.
- We import `express`.
    - This is a function used to create an express app.
    - Store this in `app` variable.
```javascript
const express = require('express');
const app = express();
```
- There are two routes to the app.
- The first one defines event handler used to handle HTTP GET requests make to app's root.
```javascript
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});
```
- Event handler gets 2 parameters.
    - First is the `request` parameter. It contains all information of the HTTP request.
    - Second is the `response` parameter. Defines how the request is responded to.
- Request is answered by using `send` method of `response` object.
    - Server responds to request by sending a response containing string `<h1>Hello World</h1>` passed to the `send` method.
    - Parameter is a string.
    - Express automatically sets value of `Content-Type` header to `text/html`.
    - Status code defaults to 200.
    - Verify in `Network` tab.
- Second route defines an event handler that handles HTTP GET requests made to `notes` path:
```javascript
app.get('/api/notes', (request, response) => {
    response.json(notes);
});
```
- Request responded to with `json` method of `response` object.
    - Calling this sends the `notes` array passed to it as a JSON formatted string.
    - Express automatically sets `Content-Type` header with value `application/json`.
- Take a look at data sent in JSON format.
- Earlier we had to transform data into JSON format with `JSON.stringify` method.
```javascript
response.end(JSON.stringify(notes));
```
- No longer necessary with express because it happens automatically.
- `JSON` is a string NOT a JS object like the value assigned to `notes`.

## nodemon
- Making changes to app code requires restarting application to see changes.
    - This is cumbersome.
- Solution is `nodemon`.
    - **nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.**
- Install `nodemon` as development dependency:
```
npm install --save-dev nodemon
```
- Contents of `package.json` also changed:
```json
{
    // ...
    "dependencies": {
        "express": "^4.17.1"
    },
    "devDependencies": {
        "nodemon": "^2.0.7"
    }
}
```
- You can manually change from dependencies to devDependencies if you made a mistake on installation.
- `devDependencies` not needed when app is run on production mode on the production server (Heroku).
- Start application with `nodemon`:
```
node_modules/.bin/nodemon index.js
```
- Changes to app causes server to restart automatically.
- Backend server automatically restarts but still need to refresh browser.
    - Unlike React, we don't have `hot reload` function to reload browser.
- Command is long, so create a script.
```json
{
    // ...
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    // ...
}
```
- No need to specify `node_modules/.bin/nodemon` because `npm` automatically knows to search for the file from that directory.
- Start server in development mode with:
```
npm run dev
```
- Unlike `start` and `test` scripts, we have to add `run` to command.

