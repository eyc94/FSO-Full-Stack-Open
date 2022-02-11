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

