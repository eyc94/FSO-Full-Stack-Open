# Testing The Backend
- Start writing tests for the backend.
- Doesn't make sense to write `unit tests` for this because there is no complicated logic.
- Only thing we can possibly unit test for is the `toJSON` method used for formatting notes.
- Can be good to implement some of the backend tests by mocking the database and not using a real one.
    - One library used for this is `mongo-mock`.
- Backend application is simple.
    - We will test entire app through its REST API.
    - Database is also included.
    - Testing multiple components of the system as a group is called `integration testing`.

## Test Environment
- Remember when backend is running on Heroku, it is in `production mode`.
- Convention of Node is to define the execution mode of app with `NODE_ENV` environment variable.
    - Current app loads env variables defined in `.env` if app is *not* in production mode.
- Common practice to define separate modes for development and testing.
- Change scripts so when tests run, `NODE_ENV` gets the value `test`.
```json
{
    // ...
    "scripts": {
        "start": "NODE_ENV=production node index.js",
        "dev": "NODE_ENV=development nodemon index.js",
        // ...
        "test": "NODE_ENV=test jest --verbose --runInBand"
    },
    // ...
}
```
- Notice we added the `runInBand` option to the npm script of test.
    - Prevents Jest from running tests in parallel.
    - We'll discuss once tests start using the database.
- Specified mode to be development in the `dev` script.
- Specified mode to be production in the `start` script.
- One problem with the above is that it will not work on windows.
    - Solve this by installing `cross-env` package as a development dependency.
```
npm install --save-dev cross-env
```
- Now we can do cross-platform compatibility using the cross-env library in npm scripts:
```json
{
    // ...
    "scripts": {
        "start": "cross-env NODE_ENV=production node index.js",
        "dev": "cross-env NODE_ENV=development nodemon index.js",
        // ...
        "test": "cross-env NODE_ENV=test jest --verbose --runInBand"
    },
    // ...
}
```
- If deploying this application to Heroku, if cross-env is saved as a dev dependency, it will cause an error.
- Fix by changing cross-env to production dependency.
```
npm i cross-env -P
```
- We can modify the way our app runs in different modes.
    - Could define app to use a separate test database when it is running tests.
- Create separate test database in MongoDB Atlas.
    - Not optimal when you have many people developing the same app.
- Test execution typically requires that a single database instance is not used by tests that are running concurrently.
- Better to run tests using DB installed and running in the dev's local machine.
- Optimal to have every test execution use its own DB.
    - Simple to achieve by `running Mongo in-memory` or using `Docker` containers.
    - We will just use MongoDB Atlas DB.
- Make changes to module that defines the app's config:
```javascript
require('dotenv').config();

const PORT = process.env.PORT;

const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

module.exports = {
    MONGODB_URI,
    PORT
};
```
- The `.env` file has separate database addresses for development and test.
```
MONGODB_URI='mongodb+srv://first-user:<PASSWORD>@cluster0.r0xrw.mongodb.net/<DATABASE_NAME>?retryWrites=true&w=majority'
PORT=3001

TEST_MONGODB_URI='mongodb+srv://first-user:<password>@cluster0.r0xrw.mongodb.net/<TEST_DATABASE_NAME>?retryWrites=true&w=majority'
```
- The `config` module we made resembles the `node-config` package.
    - We write our own for practice since our app is simple and it's best to learn.
- These are the only changes we need to make.

## supertest
- Use `supertest` package to help write tests for testing the API.
- Install as development dependency.
```
npm install --save-dev supertest
```
- Write first test in `tests/note_api.test.js` file:
```javascript
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('notes are returns as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

afterAll(() => {
    mongoose.connection.close();
});
```
- The test imports that Express app from `app.js` module.
    - Wraps the module with `supertest` function into a `superagent` object.
    - The object is assigned to `api` variable.
    - Tests can use `api` for making HTTP requests to the backend.
- Test makes GET request to `api/notes` url.
    - Verifies request is responded to with status code 200.
    - Also verifies that `Content-Type` header is set to `application/json`.
    - Use `RegEx` syntax for `/application\/json/`
        - `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions`
- Arrow function that defines the test is preceded by `async` keyword.
- Method call for `api` object is preceded by `await` keyword.
- We will look at the `async/await` magic later after writing more tests.
- The async/await syntax is related to the fact that making a request to API is an `asynchronous` operation.
    - The `async/await` can be used for writing asynchronous code with the appearance of synchronous code.
- Once all tests run, you have to close connection.
    - Achieved with `afterAll` method:
```javascript
afterAll(() => {
    mongoose.connection.close();
});
```
- You might get this warning:
    - **Jest did not exit one second after the test run has completed.**
- Add a `jest.config.js` file at the root:
```javascript
module.exports = {
    testEnvironment: 'node'
};
```
- Tests may take longer than the default Jest test timeout of 5000ms.
    - Solved by adding third parameter to test function:
```javascript
test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/);
}, 100000);
```
- Third parameter sets timeout to 100000 ms.
- Remember that we extracted Express app into `app.js`.
- `index.js` launches the app at the specified port with Node's built-in `http` object.
```javascript
const app = require('./app');
const http = require('http');
const config = require('./utils/config');
const logger = require('./utils/logger');

const server = http.createServer(app);

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});
```
- Tests only use express application defined in `app.js`.
```javascript
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

// ...
```
- Documentation for supertest:
    - **If the server is not already listening for connections then it is bound to an ephemeral port for you so there is no need to keep track of ports.**
- So, supertest makes sure that the app being tested is started at the port that it uses internally.
- Write more tests:
```javascript
test('there are two notes', async () => {
    const response = await api.get('/api/notes');

    expect(response.body).toHaveLength(2);
});

test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes');

    expect(response.body[0].content).toBe('HTML is easy');
});
```
- Store response of request to `response` variable.
- Instead of using `supertest` for verifying status code and headers, we inspect the response data stored in `response.body`.
- Verify format and content of response with `expect` method of Jest.
- Normally, we use callback functions to access data returned by promises.
```javascript
const response = await api.get('/api/notes');

// Execution gets here only after the HTTP request is complete.
// The result of HTTP request is saved in variable 'response'.
expect(response.body).toHaveLength(2);
```
- Middleware that outputs info about HTTP requests is obstructing test execution output.
    - Modify logger so that it does not print to console in test mode.
```javascript
const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params);
    }
};

const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error(...params);
    }
};

module.exports = {
    info, error
};
```

## Initializing The Database Before Tests
- Tests are passing but they rely on state of the database.
- To make tests more robust, we have to reset the DB and make the test data in a controlled manner before running tests.
- We are using the `afterAll` function to close connection to DB after tests are finished.
- We can use other functions like before executing operations once before any test is run.
- Or, we can use functions every time before a test is run.
```javascript
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Note = require('../models/note');
const initialNotes = [
    {
        content: 'HTML is easy',
        date: new Date(),
        important: false
    },
    {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true
    }
];

beforeEach(async () => {
    await Note.deleteMany({});
    let noteObject = new Note(initialNotes[0]);
    await noteObject.save();
    noteObject = new Note(initialNotes[1]);
    await noteObject.save();
});

// ...
```
- DB is cleared at the start.
- We save two notes stored in `initialNotes` to DB.
- We ensure that the DB is in the same state before every test is run.
- Make changes to the last two tests:
```javascript
test('all notes are returned', async () => {
    const response = await api.get('/api/notes');

    expect(response.body).toHaveLength(initialNotes.length);
});

test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes');

    const contents = response.body.map(r => r.content);
    expect(contents).toContain(
        'Browser can execute only Javascript'
    );
});
```
- The `response.body.map(r => r.content)` creates an array that has the content of every note returned by API.
- The `toContain` function checks that the given note (parameter) is in the list of contents.

## Running Tests One By One
- The `npm test` runs all tests.
- It's better to run one or two tests.
    - Can use the `only` method to do this.
    - If tests are written across multiple files, this method is not good.
- Better option is to specify the tests that need to be run as parameter of the `npm test` command.
- The command below only runs tests in `tests/note_api.test.js`.
```
npm test -- tests/note_api.test.js
```
- The `-t` option is used for running tests with a specific name:
```
npm test -- -t "a specific note is within the returned notes"
```
- Can be name of test or describe block.
- Parameter can also be just a part of the name.
- Command below runs all tests that contain 'notes' in their name:
```
npm test -- -t 'notes'
```
- When running a single test, mongoose connection might stay open if no tests using the connection are run.
    - Might be because supertest primes connection but Jest does not run the afterAll portion of code.

