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