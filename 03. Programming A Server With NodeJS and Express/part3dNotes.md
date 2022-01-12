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

