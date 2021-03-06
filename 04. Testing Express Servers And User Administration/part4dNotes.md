# Token Authentication
- Users log into our app.
- User info should be automatically attached to the notes they create.
- Implement `token based authentication` to the backend.
- There is a diagram you can look at:
    - `https://fullstackopen.com/en/part4/token_authentication#limiting-creating-new-notes-to-logged-in-users`
1. User logs into a login form implemented with React.
2. React code sends username and password to server address `/api/login` as HTTP POST request.
3. Server generates `token` if username and password are correct.
    - This identifies the user.
    - Signed digitally, so hard to falsify.
4. Backend responds with successful status code and returns token in response.
5. Browser saves token.
6. When user creates notes, React code send token to server with request.
7. Server uses token to identify user.
- Implement logging in.
- Install `jsonwebtoken` library to generate `JSON web tokens`.
```
npm install jsonwebtoken
```
- Login functionality code goes to `controllers/login.js`.
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
    const body = request.body;

    const user = await User.findOne({ username: body.username });
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        });
    }

    const userForToken = {
        username: user.username,
        id: user._id
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    response
        .status(200)
        .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
```
- Code searches for user in DB by username in request.
- Then, it checks the password in request.
- Passwords themselves are not stored in DB (their hashes are).
    - So, we use `bcrypt.compare` method to check if the password is correct.
- If no user or incorrect password, return with status code 401 unauthorized.
- Correct password and user means token is created with `jwt.sign`.
- Token has username and user id in a digitally signed form.
    - Signed with environment variable `SECRET` in the `.env` file.
- Status code 200 response is next.
- The token and username and name is sent back in response body.
- Add the code to `app.js`:
```javascript
const loginRouter = require('./controllers/login');

// ...

app.use('/api/login', loginRouter);
```
- So, it doesn't work because we forgot to set the environment variable.
    - It works when we do.
    - It can be any string.

## Limiting Creating New Notes To Logged In Users
- Only possible to create new notes if post request has valid token attached.
- Notes is saved to the notes list of the user identified by token.
- Several ways to send token from browser to server.
    - We use `Authorization` header.
    - Tells which `authentication scheme` is used.
    - We use `Bearer` scheme.
- If the token is `eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW`, the `Authorization` header is:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW
```
- Creating new note changes like this:
```javascript
const jwt = require('jsonwebtoken');

// ...
const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7);
    }
    return null;
}

notesRouter.post('/', async (request, response) => {
    const body = request.body;
    const token = getTokenFrom(request);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' });
    }
    const user = await User.findById(decodedToken.id);

    const note = new Note({
        content: body.content,
        important: body.important === undefined ? false : body.important,
        date: new Date(),
        user: user._id
    });

    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    response.json(savedNote);
});
```
- The helper function `getTokenFrom` isolates the token `Authorization` header.
- Validity of token checked by `jwt.verify`.
- Decodes the token or returns Object which the token was based on.
- No token means an error is returned.
- Decoded object from token has username and id to tell who made request.
    - If no id, error status code 401.
    - Resolved request means execution is normal.
- New note can be created using Postman.
    - Only if `Authorization` header is given correct value.
    - `bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW`
    - Second value is token returned by login operation.

## Error Handling
- Can get a `JsonWebTokenError` if invalid token.
- Extend error handling middleware to take into account the different decoding errors.
```javascript
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id'
        });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({
            error: error.message
        });
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        });
    }

    logger.error(error.message);

    next(error);
};
```

## Problems of Token-Based Authentication
- Easy to implement but one problem.
- Once an app gets a token, the API has a blind trust to the token holder.
- What if we want to revoke access?
- Two solutions:
    - Easier is to limit the validity period of a token.
    - Other is to save information about each token to backend DB and to check for each API request if they have access rights.
        - Called a `server side session`.
```javascript
loginRouter.post('/', async (request, response) => {
    const body = request.body;

    const user = await User.findOne({ username: body.username });
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        });
    }

    const userForToken = {
        username: user.username,
        id: user._id
    };

    // Token expires in 60*60 seconds, that is, in one hour.
    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60*60 }
    );

    response
        .status(200)
        .send({ token, username: user.username, name: user.name });
});
```
- Once token expires, client needs new token.
    - Just log back in.
- Fix error handling to give proper error in case of expired token.
```javascript
const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id'
        });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({
            error: error.message
        });
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        });
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        });
    }

    next(error);
};
```
- The shorter the time, the safer it is.
    - However, this means users log in more frequently.
- Saving tokens in backend means that performance takes a hit.
    - Token validity needs to be checked on every API request from DB.
    - Sometimes best to save sessions corresponding to a key-value-database such as `Redis`.
    - Fast in usage scenarios but limited compared to MongoDB.
- Instead of using `Authorization` header, `cookies` are used for transferring token between client and server.

## End Notes
- Most tests are broken now because of the changes made.
- Usernames and passwords and apps using token authentication must be over `HTTPS`.

