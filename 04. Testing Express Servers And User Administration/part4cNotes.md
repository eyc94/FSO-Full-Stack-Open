# User Administration
- Add user authentication and authorization.
- Users stored in DB.
- Notes linked to user who created it.
- Deleting and editing only allowed for the user who created it.
- Add information about users to the DB.
    - There is a one-to-many relationship between User and Note.
- Implementation is straightforward in a relational DB.
- Many different ways of modeling situation in document DB (non-relational).
- Currently, we have notes in a `notes` collection in the DB.
    - If we don't want to make changes to it, we need new collection for the `users`.
    - Can use object id's in Mongo to reference documents in other collections.
    - This is like a foreign key reference in relational DBs.
- Mongo does not support join queries like relational DBs do.
    - They have `lookup aggregation queries` but this is not discussed here.
- We will just make multiple queries if needed.
    - Mongoose takes care of joining and aggregating data.

## References Across Collections
- Relational DBs just require that our note contains a `reference key` to the user that created it.
    - Can do the same in document DBs.
- Assume `users` contains two users:
```javascript
[
    {
        username: 'mluukkai',
        _id: 123456
    },
    {
        username: 'hellas',
        _id: 141414
    }
];
```
- The `notes` contains three notes with a `user` field that references a user in `users`:
```javascript
[
    {
        content: 'HTML is easy',
        important: false,
        _id: 221212,
        user: 123456
    },
    {
        content: 'The most important operations of HTTP protocol are GET and POST',
        important: true,
        _id: 221255,
        user: 123456
    },
    {
        content: 'A proper dinosaur codes with Java',
        important: false,
        _id: 221244,
        user: 141414
    }
];
```
- Document DBs don't require the user id be in notes collection.
- It could be the opposite or both!
```javascript
[
    {
        username: 'mluukkai',
        _id: 123456,
        notes: [221212, 221255]
    },
    {
        username: 'hellas',
        _id: 141414,
        notes: [221244]
    }
];
```
- Users can have many notes, so notes is stored as an array.
- Can also be good to nest entire notes array as part of the documents in the users collection:
```javascript
[
    {
        username: 'mluukkai',
        _id: 123456,
        notes: [
            {
                content: 'HTML is easy',
                important: false
            },
            {
                content: 'The most important operations of HTTP protocol are GET and POST',
                important: true
            }
        ]
    },
    {
        username: 'hellas',
        _id: 141414,
        notes: [
            {
                content: 'A proper dinosaur codes with Java',
                important: false
            }
        ]
    }
];
```
- Notice there are no ids in the notes.
- They are tightly nested in users collection.
- Schema usually and must support use case of application.

## Mongoose Schema For Users
- We make the decision to store ids of notes in the user document.
- Define model for a user in `models/user.js`:
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String,
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        // The passwordHash should not be revealed.
        delete returnedObject.passwordHash;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
```
- Notes are stored in user document as array of Mongo ids.
- The type of the `notes` field is `ObjectId`.
- It references `Note`.
- Expand schema of Note in `models/note.js` as well:
```javascript
const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minLength: 5
    },
    date: Date,
    important: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});
```
- Now the notes have references to the user who created them.
- References now stored in both documents.
    - This is different than relational DBs.

## Creating Users
- Make route for creating new users.
    - Users have unique `username`, a name, and a `passwordHash`.
- `passwordHash` is output of one-way hash function applied to user's pass.
- Do not store unencrypted passwords in DB as plain text.
- Install `bcrypt` package for generating password hashes:
```
npm install bcrypt
```
- Make HTTP POST requests to `users` path.
- Make a `controllers/users.js` file to make a router to handle users.
    - Use route in main `app.js`:
```javascript
const usersRouter = require('./controllers/users');

// ...

app.use('/api/users', usersRouter);
```
- Contents of router file:
```javascript
const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
    const body = request.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    });

    const savedUser = await user.save();

    response.json(savedUser);
});

module.exports = usersRouter;
```
- We store the `hash` of the pass sent not the pass itself.
- Code does not have error handling for verifying usernames and passwords are in correct format.
- Should test new feature manually.
    - Better to automate tests.
- Initial tests:
```javascript
const bcrypt = require('bcrypt');
const User = require('../models/user');

// ...

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('secret', 10);
        const user = new User({ username: 'root', passwordHash });

        await user.save();
    });

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen'
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });
});
```
- Notice we use the `usersInDb()` helper function.
    - It is defined in the `tests/test_helper.js` file.
```javascript
const User = require('../models/user');

// ...

const usersInDb = async () => {
    const users = await User.find({});
    return users.map(u => u.toJSON());
};

module.exports = {
    initialNotes,
    nonExistingId,
    notesInDb,
    usersInDb
};
```
- The `beforeEach` creates a new user with username of `root` to the DB.
- Write new test that verifies user of same username cannot be created.
```javascript
describe('when there is initially one user in db', () => {
    // ...

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen'
        };

        const result = await api
            .get('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        
        expect(result.body.error).toContain('`username` to be unique');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
});
```
- Test does not pass!
    - Practicing `test-driven development (TDD)` where tests are written before implementations.
- Use Mongoose validators to help with uniqueness.
- Use the `mongoose-unique-validator` npm package.
```
npm install mongoose-unique-validator
```
- Make the changes to `models/user.js` file:
```javascript
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    name: String,
    passwordHash: String,
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]
});

userSchema.plugin(uniqueValidator);

// ...
```
- Can also test other validation properties.
- Let's add initial implementation of a route handler that returns all users in DB:
```javascript
usersRouter.get('/', async (request, response) => {
    const users = await User.find({});
    response.json(users);
});
```
- Send a POST request to `/api/users/` via Postman when making new users in the format:
```json
{
    "notes": [],
    "username": "root",
    "name": "Superuser",
    "password": "salainen"
}
```

