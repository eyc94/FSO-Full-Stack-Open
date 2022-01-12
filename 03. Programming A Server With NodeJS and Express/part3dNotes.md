# Validation and ESLint
- We do not want notes that do not have a missing or empty `content`.
- This is checked in our route handler:
```javascript
app.post('/api/notes', (request, response) => {
    const body = request.body;
    if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' });
    }

    // ...
});
```
- No content means we respond to request with status code 400 bad request.
- One better way to validate format of data before storing in DB is to use the `validation` functionality in Mongoose.
- Define validation rules for fields in the schema:
```javascript
const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 5,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    important: Boolean
});
```
- The `content` must be at least 5 characters long and required.
- The `date` is also required.
- The `important` is the same as before.
- The `minLength` and `required` validators are built-in, but we can create custom validators.
- Operation throws exception if we try to add object to DB that breaks constraint.
- Change handler to pass exceptions to the error handler.
```javascript
app.post('/api/notes', (request, response, next) => {
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
```
- Expand error handler to deal with these validation errors:
```javascript
const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};
```

## Promise Chaining
- Route handlers change format of response data to the correct format by implicitly calling `toJSON` from `response.json`.
- Can also call it explicitly like so:
```javascript
app.post('/api/notes', (request, response, next) => {
    // ...

    note.save()
        .then(savedNote => {
            response.json(savedNote.toJSON());
        })
        .catch(error => next(error));
});
```
- Cleaner with `promise chaining`:
```javascript
app.post('/api/notes', (request, response, next) => {
    // ...

    note
        .save()
        .then(savedNote => {
            return savedNote.toJSON();
        })
        .then(savedAndFormattedNote => {
            response.json(savedAndFormattedNote);
        })
        .catch(error => next(error));
});
```
- The first `then` receives `savedNote` object returned by Mongoose and format it.
    - Result is returned.
    - The `then` method of a promise also returns a promise.
    - So, we can access formatted note by registering a new callback with `then` method.
- Clean code up more with compact arrow syntax:
```javascript
app.post('/api/notes', (request, response, next) => {
    // ...

    note
        .save()
        .then(savedNote => savedNote.toJSON());
        .then(savedAndFormattedNote => {
            response.json(savedAndFormattedNote);
        })
        .catch(error => next(error));
});
```
- The promise chaining here is not that great.
- It's better when we deal with many asynchronous operations done in sequence.
- We will learn more about `asynch/await` syntax in JavaScript which makes writing asynchronous operations easier.

