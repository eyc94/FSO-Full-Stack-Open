# Structure of Backend Application & Introduction to Testing
- Continue working on Notes Backend repo.

## Project Structure
- Modify structure of project to adhere to Node.js best practices.
- End up with this structure:
```
- index.js
- app.js
- build
    - ...
- controllers
    - notes.js
- models
    - note.js
- package-lock.json
- package.json
- utils
    - config.js
    - logger.js
    - middleware.js
```
- We have been using `console.log` and `console.error` to print information.
    - Not a good way to do things.
    - Separate all printing to console to its own module `utils/logger.js`.
```javascript
const info = (...params) => {
    console.log(...params);
};

const error = (...params) => {
    console.error(...params);
};

module.exports = {
    info, error
};
```
- The logger has two functions:
    - `info` for printing normally.
    - `error` for printing error messages.
- Best to put in separate module because we only have to make changes in one place.
- Contents of `index.js` is now:
```javascript
const app = require('./app'); // The actual Express application.
const http = require('http');
const config = require('./utils/config');
const logger = require('./utils/logger');

const server = http.createServer(app);

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
```
- Notice the `index.js` file imports the actual application from `app.js` and starts it.
- The `logger` module's `info` function is used to print that the app is running.
- The handling of environment variables is extracted into a separate `utils/config.js` file.
```javascript
require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
    MONGODB_URI,
    PORT
};
```
- Other parts of the app can access the environment variables by importing the config module.
```javascript
const config = require('./utils/config');

logger.info(`Server running on port ${config.PORT}`);
```
- Route handlers have been moved to their own module as well.
- Event handlers of routes are referred to as `controllers`.
    - So, we create a `controllers` folder.
    - All routes related to notes are in `notes.js` module in `controllers` folder.
- Contents of `notes.js` is:
```javascript
const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    });
});

notesRouter.get('/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

notesRouter.post('/', (request, response, next) => {
    const body = request.body;

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });

    note.save()
        .then(savedNote => {
            response.json(savedNote);
        })
        .catch(error => next(error));
});

notesRouter.delete('/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

notesRouter.put('/:id', (request, response, next) => {
    const body = request.body;

    const note = {
        content: body.content,
        important: body.important
    };

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote);
        })
        .catch(error => next(error));
});

module.exports = notesRouter;
```
- Almost an exact copy of previous `index.js`.
- Difference is that we create a new `router` object.
```javascript
const notesRouter = require('express').Router();

// ...

module.exports = notesRouter;
```
- Can export this module to anyone who wants to use it.
- All routes now defined for the router object.
- Paths in route handlers have shortened.
- Previously:
```javascript
app.delete('/api/notes/:id', (request, response) => {
```
- Now:
```javascript
notesRouter.delete('/:id', (request, response) => {
```
- Express manual's explanation:
    - **A router object is an isolated instance of middleware and routes. You can think of it as a "mini-application", capable only of performing middleware and routing functions. Every Express application has a built-in app router.**
- The router is a `middleware`.
    - Defines `related routes` in a single place.
- The `app.js` that creates the application takes the router into use:
```javascript
const notesRouter = require('./controllers/notes');
app.use('/api/notes', notesRouter);
```
- Router we defined is used *if* the URL of request starts with `/api/notes`.
    - Because of this, notesRouter must only define relative parts of the routes.
    - Like empty routes `/` or just the parameter `/:id`.
- Our `app.js` looks like this:
```javascript
const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const notesRouter = require('./controllers/notes');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB');
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message);
    });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/notes', notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
```
- File takes different middleware into use.
    - One is the `notesRouter` attached to `/api/notes` route.
    - Other is the custom ones.
- Customer middleware moved to `utils/middleware.js` module.
```javascript
const logger = require('./logger');

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method);
    logger.info('Path:  ', request.path);
    logger.info('Body:  ', request.body);
    logger.info('---');
    next();
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
};
```
- Responsibility of connecting to database is given to `app.js`.
- The `note.js` file in `models` only defines the Mongoose schema for notes.
```javascript
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minLength: 5
    },
    date: {
        type: Date,
        required: true
    },
    important: Boolean
});

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Note', noteSchema);
```
- To recap, the structure of project is below:
```
- index.js
- app.js
- build
    - ...
- controllers
    - notes.js
- models
    - note.js
- package-lock.json
- package.json
- utils
    - config.js
    - logger.js
    - middleware.js
```
- Small apps don't matter when it comes to structure.
    - Only when apps scale and get too big.
- The above structure follows some standards and best practices from the internet.

## Testing Node Applications
- We have neglected automated testing.
- Look at unit tests first.
    - Not much to test because application is so simple.
- Create new file `utils/for_testing.js` and write simple functions we can use for test writing practice.
```javascript
const palindrome = (string) => {
    return string
        .split('')
        .reverse()
        .join('');
};

const average = (array) => {
    const reducer = (sum, item) => {
        return sum + item;
    };

    return array.reduce(reducer, 0) / array.length;
};

module.exports = {
    palindrome,
    average
};
```
- The `average` function uses array `reduce` method.
    - Watch these first three videos from `Functional JavaScript` series on YouTube.
    - `https://www.youtube.com/watch?v=BMUiFMZr7vk`
    - `https://www.youtube.com/watch?v=bCqtb-Z5YGQ`
    - `https://www.youtube.com/watch?v=Wl98eZpkp-c`
- Many test libraries or `test runners` available for JavaScript.
- We will use a testing library developed and used internally by Facebook called `jest`.
    - `https://jestjs.io`
    - Resembles the previous king of JS testing libraries, `Mocha`.
        - `https://mochajs.org`
- `jest` shines when testing React apps and backend.
    - May not work with Windows if path has spaces in its name.
- Install `jest` as a development dependency because we only need it during development of the app.
```
npm install --save-dev jest
```
- Define an `npm script` called `test` to execute tests with Jest.
    - Report about test execution with `verbose` style.
```json
{
    // ...
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        "build:ui": "rm -rf build && cd <frontend_path> && npm run build && cp -r build <backend_path>",
        "deploy": "git push heroku master",
        "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
        "logs:prod": "heroku logs --tail",
        "lint": "eslint .",
        "test": "jest --verbose"
    },
    // ...
}
```
- Jest requires to specify that the execution environment is Node.
- Add to `package.json`:
```json
{
    // ...
    "jest": {
        "testEnvironment": "node"
    }
}
```
- Or, Jest can look for a config file with the name `jest.config.js` where we define execution environment:
```javascript
module.exports = {
    testEnvironment: 'node'
};
```
- Create a different directory for our tests called `tests`.
- Create a new file called `palindrome.test.js`:
```javascript
const palindrome = require('../utils/for_testing').palindrome

test('palindrome of a', () => {
    const result = palindrome('a');

    expect(result).toBe('a');
});

test('palindrome of react', () => {
    const result = palindrome('react');

    expect(result).toBe('tcaer');
});

test('palindrome of releveler', () => {
    const result = palindrome('releveler');

    expect(result).toBe('releveler');
});
```
- The ESLint config is going to complain about `test` and `expect` commands.
    - This is because the config does not allow `globals`.
- Rid complains by adding `"jest": true` to the `env` property in the `.eslintrc.js` file.
```javascript
module.exports = {
    'env': {
        'commonjs': true,
        'es2021': true,
        'node': true,
        'jest': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 12
    },
    'rules': {
        // ...
    },
}
```
- The first row imports the function to be tested and assigns it to a variable called `palindrome`.
```javascript
const palindrome = require('../utils/for_testing').palindrome
```
- Individual test cases defined with `test` function.
    - First parameter is the test description as a string.
    - Second is a `function` that defines functionality for the test case.
- Functionality looks like so:
```javascript
() => {
    const result = palindrome('react');

    expect(result).toBe('tcaer');
}
```
- First, execute the code to be tested.
    - Generate palindrome for the string `react`.
- Next, verify result with `expect` function.
    - The `expect` function wraps the resulting value into an object that offers `matcher` functions.
    - These functions can be used to verify correctness of result.
    - Use the `toBe` matcher to compare two strings.
- Jest expects the names of test files to contain `.test`.
    - Every test file will have extension `.test.js`.
- Add few tests for the `average` function into a new file `tests/average.test.js`.
```javascript
const average = require('../utils/for_testing').average

describe('average', () => {
    test('of one value is the value itself', () => {
        expect(average([1]).toBe(1));
    });

    test('of many is calculated right', () => {
        expect(average([1, 2, 3, 4, 5, 6]).toBe(3.5));
    });

    test('of empty array is zero', () => {
        expect(average([]).toBe(0));
    });
});
```
- Function does not work correctly with an empty array.
    - In JS, dividing by 0 results in `NaN`.
    - Fix by changing the `for_testing.js` file's `average` function definition.
```javascript
const average = array => {
    const reducer = (sum, item) => {
        return sum + item;
    };

    return array.length === 0
        ? 0
        : array.reduce(reducer, 0) / array.length;
};
```
- If length of array is 0, return 0.
- Other cases, use `reduce` method to calculate average.
- Notice how we defined a `describe` block around the tests that was given the name `average`.
```javascript
describe('average', () => {
    // tests
});
```
- The `describe` block is used to group tests into logical collections.