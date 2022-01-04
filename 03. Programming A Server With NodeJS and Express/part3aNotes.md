# Node.js and Express
**NOTE: Created a different repo (FSO-Notes-Backend) to follow along!**

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

## REST
- Expand app to provide same RESTful HTTP API as `json-server`.
- REST (Representation State Transfer).
    - Architectural style meant for building scalable web apps.
- We are only concerned with how RESTful APIs are typically understood in web apps.
    - Original definition of REST is not limited to web apps.
- Remember that singular things, like notes, are `resources`.
    - Each resource has a unique URL.
    - Usually with resource type and id.
- Assume root URL of our service is `www.example.com/api`.
    - Define resource type of note to be `notes`.
    - Address of note with id of 10 is: `www.example.com/api/notes/10`.
    - Address for all notes is: `www.example.com/api/notes`.
- We can execute different operations on resources defined by the HTTP `verb`.
- This is what is called a `uniform interface`.
    - Consistent way of defining interfaces that makes it possible for systems to co-operate.
- Our model is good for a straightforward CRUD API.
    - Referred to as `resource oriented architecture` instead of REST.

## Fetching A Single Resource
- Expand app to offer REST interface for operating on individual notes.
- Create `route` for fetching single resource.
- Unique address is of form `notes/10` where 10 is the id.
    - Define `parameters` in express using colon syntax.
```javascript
app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    const note = notes.find(note => note.id === id);
    response.json(notes);
});
```
- The route above handles all HTTP GET requests of the form `/api/notes/SOMETHING`, where `SOMETHING` is a string.
- `id` parameter in the route of request can be accessed through the `request` object.
```javascript
const id = request.params.id;
```
- `find` method of arrays to find the note with the matching id.
- The note is returned to sender of request.
- Going to `http://localhost:3001/api/notes/1` displays an empty page.
    - Add `console.log` commands to figure out why.
```javascript
app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    console.log(id);
    const note = notes.find(note => note.id === id);
    console.log(note);
    response.json(notes);
});
```
- Notice that `find` method does not find a matching note.
- Add `console.log` inside comparison function passed `find` method.
```javascript
app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    console.log(id);
    const note = notes.find(note => {
        console.log(note.id, typeof note.id, id, typeof id, note.id === id);
        return note.id === id;
    });
    console.log(note);
    response.json(notes);
});
```
- Visit URL again.
- This is printed:
```
1 'number' '1' 'string' false
2 'number' '2' 'string' false
3 'number' '3' 'string' false
```
- `id` variable is a string where the ids of notes are integers.
    - The triple equals considers all values of different types to not be equal by default.
    - This means 1 is not '1'.
- Fix by changing id parameter from string to `number`.
```javascript
app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);
    response.json(notes);
});
```
- Fetching now works.
- Another problem is searching for a note with an id that does not exist.
    - Server responds with status code 200 OK.
    - However, no data is sent back.
    - Reason is `note` variable is set to `undefined` if no matching note is found.
    - Handle on server in a better way.
    - If no note is found, respond with status code `404 not found`.
```javascript
app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);

    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    }
});
```
- No data is attached to response.
    - Use `status` method to set status.
    - Use `end` method to respond to request without sending data.
- The 'if' statement uses the fact that JS objects are truthy.
    - An `undefined` object is falsy evaluating to false.
- However, notice nothing is really displayed indicating a 404 error.
    - This is okay because REST APIs are interfaces for programmatic use.

## Deleting Resources
- Implement route for deleting resources.
- Done with HTTP DELETE request to URL of resource.
```javascript
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);

    response.status(204).end();
});
```
- Successful deletion means we respond to request with status code `204 no content` and return no data with the response.
    - No consensus on what status code is returned with DELETE request if resource does not exist.
    - Only 2 options are 204 and 404.
    - For simplicity's sake, use 204 in both cases.

## Postman
- How do we test delete operation?
- HTTP GET requests are easy to make from browser.
- Many tools to test backends easier.
    - Command line program `curl`.
    - We instead use `Postman` for testing the application.
- Install `Postman` and try it.
- Define URL and select DELETE request type.
- Make GET request to notes and verify deletion of note.
- Notes are only saved to memory so restarting application returns notes to original state.

## The Visual Studio Code REST Client
- If you use Visual Studio Code, you can use VSCode `REST client` instead.
- Once plugin installed, make folder at root named `requests`.
    - Save all REST client requests in the folder as files ending with `.rest` extension.
- Create a new `get_all_notes.rest` file and define request that fetches all notes.
```rest
GET http://localhost:3001/api/notes
```
- Click `Send Request` and REST client executes the HTTP request and response from server is opened in the editor.

## The WebStorm HTTP Client
- If you use `IntelliJ WebStorm`, there is a similar process with its builtin HTTP Client.
- Create new file with extension `.rest` and editor will display options to create and run requests.

## Receiving Data
- Make it possible to add new notes to the server.
    - Done with HTTP POST request to address `http://localhost:3001/api/notes`.
    - Send all information for new note in the request `body` in JSON format.
- To access data easily, we need the help of the expres `json-parser` by using the command `app.use(express.json())`.
- Activate json-parser and implement an initial handler for dealing with the HTTP POST requests:
```javascript
const express = require('express');
const app = express();

app.use(express.json());

// ...

app.post('/api/notes', (request, response) => {
    const note = request.body;
    console.log(note);
    response.json(note);
});
```
- Event handler function can access the data from the `body` property of the `request` object.
- Without json-parser, the `body` would be `undefined`.
    - The json-parser takes the JSON data of a request, transforms to JS object, and attaches it to the `body` property of the `request` before route handler is called.
- Currently, app does not nothing but print the received data to the console and sending it back in the response.
- Before proceeding, verify with Postman that the data is actually received by the server.
    - Set the correct request type and URL.
    - Need to define the data sent in the `body`.
    - Make sure to click `Body` tab with raw `JSON` ticked.
- App should print to the console whatever is sent in the body we defined.
- If using VSCode's REST client, POST request can be sent with REST client like so:
```rest
POST http://localhost:3001/api/notes
Content-Type: application/json

{
    "content": "VS Code REST client is pretty nice",
    "important": false
}
```
- We create a new file called `create_note.rest` for the request above.
- One benefit to using REST client over Postman:
    - Requests are readily available at the root.
    - So, they can be distributed to everyone on the dev team.
    - We can also add multiple requests in the same file with `###` separators.
```rest
GET http://localhost:3001/api/notes/

###
POST http://localhost:3001/api/notes/ HTTP/1.1
Content-Type: application/json

{
    "name": "sample",
    "important": false
}
```
- Might want to see headers set in the HTTP request.
    - Use `get` method of the `request` object.
    - Can be used to get value of a single header.
    - `request` object also has the `headers` property that contains all headers of a specific request.
- Finalize the handling of the request.
```javascript
app.post('/api/notes', (request, response) => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;

    const note = request.body;
    note.id = maxId + 1;

    notes = notes.concat(note);

    response.json(note);
});
```
- Need a unique id first.
    - Find out largest id in the current list.
    - Assign to `maxId` variable.
    - The id of the new note is then `maxId + 1`.
    - Not recommended to implement it this way, but it'll do for now.
- There is the problem that request object can have properties that do not match.
    - To fix this, we make it that the `content` property may not be empty.
    - The `important` and `date` properties will be given default values.
    - All other properties discarded.
```javascript
const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;
    return maxId + 1;
};

app.post('/api/notes', (request, response) => {
    const body = request.body;

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        });
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    };

    notes = notes.concat(note);

    response.json(note);
});
```
- Notice the `generateId` function that generates the id number.
    - It has been separated into its own function.
- If received data is missing a value for `content` property, server responds with a status code `400 bad request`.
- Notice the return statement. If it wasn't there, the code will cascade down, and the bad note will still get saved.
- If content has a value, we create a note based off the received data.
    - Notice that the date is now generated by the server itself.
- If the `important` property is missing, it defaults to `false`.
    - It uses the logical OR.
- Let's examine the function body of `generateId` closely.
```javascript
Math.max(...notes.map(n => n.id))
```
- We know `notes.map(n => n.id)` creates a new array containing all ids of the notes.
- `Math.max()` returns the max values of all numbers passed to it.
    - However, `notes.map(n => n.id)` is an `array` so it cannot be passed directly as a parameter to `Math.max()`.
    - Array can be transformed into individual members by using the spread syntax `...`.
