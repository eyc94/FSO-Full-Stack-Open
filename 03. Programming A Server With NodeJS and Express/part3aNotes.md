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