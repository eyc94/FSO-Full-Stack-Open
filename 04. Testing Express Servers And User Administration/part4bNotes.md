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

## async/await
- Look at the `async` and `await` keywords.
- Makes it possible to use `asynchronous functions that return a promise` in a way that makes the code look synchronous.
- Fetching of notes from DB with promises looks like:
```javascript
Note.find({}).then(notes => {
    console.log('operation returned the following notes', notes);
});
```
- `Note.find()` returns a promise which we can access by registering a callback function with `then`.
- Write in the callback function the code we want to run when the operation finishes.
- Troublesome if we wanted to make several asynchronous calls in sequence.
- Asynchronous calls are made in the callback.
    - This leads to complicated code and what is called `callback hell`.
- Can use `chaining promises` to keep it under control a bit.
    - Example below of fetching all notes and then deleting the first one.
```javascript
Note.find({})
    .then(notes => {
        return notes[0].remove();
    })
    .then(response => {
        console.log('the first note is removed');
        // More code here.
    });
```
- The then-chain is okay. We can do better.
- The `generator functions` provided a clever way of writing asynchronous code in a way that looks synchronous.
    - Clunky and not widely used.
- The `async` and `await` keywords bring the same functionality as the generators.
- Fetch all notes in DB by using the `await` operator like so:
```javascript
const notes = await Note.find({});

console.log('operation returned the following notes', notes);
```
- Code above looks synchronous.
- Execution of code is paused at `const notes = await Note.find({});`.
    - Waits until promise is `fulfilled`.
    - Then continues to the next line.
    - When execution continues, result of operation that returned a promise is assigned to the `notes` variable.
- The complicated example above could be implemented using await like this:
```javascript
const notes = await Note.find({});
const response = await notes[0].remove();

console.log('the first note is removed');
```
- Code is a lot simpler than the then-chain.
- The await operator has to return a promise.
- Using `await` is possible only inside of an `async` function.
    - In order for previous examples to work, they have to be using async functions.
    - Notice first line in arrow function definition:
```javascript
const main = async () => {
    const notes = await Note.find({});
    console.log('operation returned the following notes', notes);

    const response = await notes[0].remove();
    console.log('the first note is removed');
};

main();
```
- Code declares that the function assigned to `main` is asynchronous.
- The code calls the function with `main()`.

## async/await In The Backend
- Change backend to async/await.
- Can change route handler functions into async functions.
- Route for fetching all notes:
```javascript
notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({});
    response.json(notes);
});
```
- Test endpoint through browser.
- Run tests we ran earlier.

## More Tests and Refactoring The Backend
- Refactoring brings the risk of regression.
    - Breaking existing functionality.
- Refactor other operations by writing tests first for each route of API.
- Start with adding new note.
    - Test adding new note.
    - Verify amount of notes returned by API increases by 1.
    - Verify new note is on the list.
```javascript
test('a valid note can be added', async () => {
    const newNote = {
        content: 'async/await simplifies making async calls',
        important: true
    };

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/notes');

    const contents = response.body.map(r => r.content);

    expect(response.body).toHaveLength(initialNotes.length + 1);
    expect(contents).toContain(
        'async/await simplifies making async calls'
    );
});
```
- Tests pass.
- Write a test that verifies that a note without content will not be added to DB.
```javascript
test('note without content is not added', async () => {
    const newNote = {
        important: true
    };

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(400);
    
    const response = await api.get('/api/notes');

    expect(response.body).toHaveLength(initialNotes.length);
});
```
- Both tests fetch all notes.
- Good to extract the repeated steps into a separate module.
    - Extract function into a new file called `tests/test_helper.js` in the same directory as test file.
```javascript
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

const nonExistingId = async () => {
    const note = new Note({ content: 'willremovethissoon', date: new Date() });
    await note.save();
    await note.remove();

    return note._id.toString();
};

const notesInDb = async () => {
    const notes = await Note.find({});
    return notes.map(note => note.toJSON());
};

module.exports = {
    initialNotes, nonExistingId, notesInDb
};
```
- Check notes stored in DB with `notesInDb` function.
- `initialNotes` contains the initial database state.
- `nonExistingId` used for creating DB object ID that does not belong to any note object in DB.
- The tests can now use the helper module.
```javascript
const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Note = require('../models/note');

beforeEach(async () => {
    await Note.deleteMany({});

    let noteObject = new Note(helper.initialNotes[0]);
    await noteObject.save();

    noteObject = new Note(helper.initialNotes[1]);
    await noteObject.save();
});

test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

test('all notes are returned', async () => {
    const response = await api.get('/api/notes');

    expect(response.body).toHaveLength(helper.initialNotes.length);
});

test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes');

    const contents = response.body.map(r => r.content);

    expect(contents).toContain(
        'Browser can execute only Javascript'
    );
});

test('a valid note can be added', async () => {
    const newNote = {
        content: 'async/await simplifies making async calls',
        important: true
    };

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

    const contents = notesAtEnd.map(n => n.content);
    expect(contents).toContain(
        'async/await simplifies making async calls'
    );
});

test('note without content is not added', async () => {
    const newNote = {
        important: true
    };

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(400);
    
    const notesAtEnd = await helper.notesInDb();

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
});

afterAll(() => {
    mongoose.connection.close();
});
```
- Tests work.
- Refactor code to use async/await syntax.
- Make changes to code handling add new note.
```javascript
notesRouter.post('/', async (request, response, next) => {
    const body = request.body;

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });

    const savedNote = await note.save();
    response.json(savedNote);
});
```
- Notice we don't handle errors.

## Error Handling and async/await
- If there is an error, it will be unhandled.
- Request would never receive the response.
- Recommended to use `try/catch` mechanism to handle errors.
```javascript
notesRouter.post('/', async (request, response, next) => {
    const body = request.body;

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });

    try {
        const savedNote = await note.save();
        response.json(savedNote);
    } catch (exception) {
        next(exception);
    }
})
```
- The catch block calls `next`.
    - Passes request handling to error handling middleware.
- Write tests for fetching and removing an individual note.
```javascript
test('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb();

    const notesToView = notesAtStart[0];

    const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    
    const processedNoteToView = JSON.parse(JSON.stringify(noteToView));

    expect(resultNote.body).toEqual(processedNoteToView);
});

test('a note can be deleted', async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToDelete = notesAtStart[0];

    await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204);
    
    const notesAtEnd = await helper.notesInDb();

    expect(notesAtEnd).toHaveLength(
        helper.initialNotes.length - 1;
    );

    const contents = notesAtEnd.map(r => r.content);

    expect(contents).not.toContain(noteToDelete.content);
});
```
- Tests pass so refactor the tested routes to use async/await.
```javascript
notesRouter.get('/:id', async (request, response, next) => {
    try {
        const note = await Note.findById(request.params.id);

        if (note) {
            response.json(note);
        } else {
            response.status(404).end();
        }
    } catch (exception) {
        next(exception);
    }
});

notesRouter.delete('/:id', async (request, response, next) => {
    try {
        await Note.findByIdAndRemove(request.params.id);
        response.status(204).end();
    } catch (exception) {
        next(exception);
    }
});
```

## Eliminating The try-catch
- So async/await unclutters code but the try/catch is the price to pay for it.
- Route handlers follow this structure:
```javascript
try {
    // do the async operations here
} catch (exception) {
    next(exception);
}
```
- Can we refactor to eliminate try/catch?
    - The `express-async-errors` library has a solution for this.
- Install:
```
npm install express-async-errors
```
- Using library in `app.js`:
```javascript
const config = require('./utils/config');
const express = requress('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const notesRouter = require('./controllers/notes');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

// ...

module.exports = app;
```
- Eliminates try/catch.
- Route for deleting note with try/catch:
```javascript
notesRouter.delete('/:id', async (request, response, next) => {
    try {
        await Note.findByIdAndRemove(request.params.id);
        response.status(204).end();
    } catch (exception) {
        next(exception);
    }
});
```
- Route for deleting note without try/catch:
```javascript
notesRouter.delete('/:id', async (request, response) => {
    await Note.findByIdAndRemove(request.params.id);
    response.status(204).end();
});
```
- No more call to `next(exception)`.
- Library handles everything under the hood.
- Other routes become:
```javascript
notesRouter.post('/', async (request, response) => {
    const body = request.body;

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });

    const savedNote = await note.save();
    response.json(savedNote);
});

notesRouter.get('/:id', async (request, response) => {
    const note = await Note.findById(request.params.id);
    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    }
});
```

## Optimizing The beforeEach Function
- Take a look at `beforeEach` function.
```javascript
beforeEach(async () => {
    await Note.deleteMany({});

    let noteObject = new Note(helper.initialNotes[0]);
    await noteObject.save();

    noteObject = new Note(helper.initialNotes[1]);
    await noteObject.save();
});
```
- Saves the notes from `initialNotes` in two operations.
- Better way to save multiple objects to DB:
```javascript
beforeEach(async () => {
    await Note.deleteMany({});
    console.log('cleared');

    helper.initialNotes.forEach(async (note) => {
        let noteObject = new Note(note);
        await noteObject.save();
        console.log('saved');
    });

    console.log('done');
});

test('notes are returned as json', async () => {
    console.log('entered test');
    // ...
});
```
- Save notes from `initialNotes` with `forEach` method.
- Tests don't work as intended.
- The logs output this:
```
cleared
done
entered test
saved
saved
```
- Test starts before DB initialized.
- This is because the `forEach` loops generates its own asynchronous operation.
- `beforeEach` does not wait for them to finish executing.
- The `await` commands are defined in the `forEach` NOT in `beforeEach`.
- The `await` is basically in a separate function that `beforeEach` will NOT wait for.
- One way to fix is to wait for all of the asynchronous operations to finish executing with `Promise.all` method.
```javascript
beforeEach(async () => {
    await Note.deleteMany({});

    const noteObjects = helper.initialNotes
        .map(note => new Note(note));
    const promiseArray = noteObjects.map(note => note.save());
    await Promise.all(promiseArray);
});
```
- An array of Mongoose objects are created with `Note` constructor for each note in `initialNotes`.
- Creates a new array of promises that result from calling the `save` method.
- The `Promise.all` converts an array of promises to just one promise.
    - The single promise is fulfilled when every promise is resolved.
- The `await Promise.all(promiseArray);` basically waits for all promises to be fulfilled (saved to DB).
- We can access the returned values of all promises by assigning to variable.
- `Promise.all` executes all promises in parallel.
    - If you don't want them to execute in parallel, just use a `for...of` block.
```javascript
beforeEach(async () => {
    await Note.deleteMany({});

    for (let note of helper.initialNotes) {
        let noteObject = new Note(note);
        await noteObject.save();
    }
});
```

## Refactoring Tests
- Current test coverage is lacking.
- Requests like `GET /api/notes/:id` and `DELETE /api/notes/:id` are not tested when request is sent with invalid id.
- Improve readability by using `describe` blocks.
- Below has minor improvements:
```javascript
const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Note = require('../models/note');

beforeEach(async () => {
    await Note.deleteMany({});
    await Note.insertMany(helper.initialNotes);
});

describe('when there is initially some notes saved', () => {
    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('all notes are returned', async () => {
        const response = await api.get('/api/notes');
        expect(response.body).toHaveLength(helper.initialNotes.length);
    });

    test('a specific note is within the returned notes', async () => {
        const response = await api.get('/api/notes');
        const contents = response.body.map(r => r.content);
        expect(contents).toContain(
            'Browser can execute only Javascript'
        );
    });
});

describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
        const notesAtStart = await helper.notesInDb();
        const noteToView = notesAtStart[0];
        const resultNote = await api
            .get(`/api/notes/${noteToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        
        const processedNoteToView = JSON.parse(JSON.stringify(noteToView));
        expect(resultNote.body).toEqual(processedNoteToView);
    });

    test('fails with statuscode 404 if note does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId();
        console.log(validNonexistingId);
        await api
            .get(`/api/notes/${validNonexistingId}`)
            .expect(404);
    });

    test('fails with statuscode 400 id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445';
        await api
            .get(`/api/notes/${invalidId}`)
            .expect(400);
    });
});

describe('addition of a new note', () => {
    test('succeeds with valid data', async () =>{
        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true
        };

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const notesAtEnd = await helper.notesInDb();
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

        const contents = notesAtEnd.map(n => n.content);
        expect(contents).toContain(
            'async/await simplifies making async calls'
        );
    });

    test('fails with status code 400 if data invalid', async () => {
        const newNote = {
            important: true
        };

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400);

        const notesAtEnd = await helper.notesInDb();
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
    });
});

describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is invalid', async () => {
        const notesAtStart = await helper.notesInDb();
        const notesToDelete = notesAtStart[0];

        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .expect(204);
        
        const notesAtEnd = await helper.notesInDb();

        expect(notesAtEnd).toHaveLength(
            helper.initialNotes.length - 1
        );

        const contents = notesAtEnd.map(r => r.content);
        expect(contents).not.toContain(noteToDelete.content);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
```