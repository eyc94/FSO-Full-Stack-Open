# Saving Data to MongoDB
- Before talking about databases, we take a look at debugging Node apps.

## Debugging Node Applications
- Harder to debug Node apps than it is to debug JS running in browser.
- The `console.log()` method is tried and true.

#### Visual Studio Code
- VSCode debugger is useful.
    - Launch with `F5` to `Start Debugging`.
    - Note the app should not be running in a different console.
- Newer versions of VSCode may have `Run` instead of `Debug`.
    - May have to configure `launch.json` to start debugging.
    - Choose `Add Configuration...` on drop-down menu.
        - Next to green play button.
        - Above `VARIABLES` menu.
        - Select `Run "npm start" in a debug terminal`.

#### Chrome Dev Tools
- Debugging also done with Chrome developer console by starting app with:
```
node --inspect index.js
```
- Access debugger by clicking green icon - node logo - appearing in the Chrome dev console.
- Set breakpoints in the `Sources` tab.

#### Question Everything
- Be systematic and question everything about where the bug may be.
- Stop and fix before proceeding!

## MongoDB
- Need a DB to store notes indefinitely.
- Most DBs that we are familiar with are relation DBs.
- We will use `MongoDB` which is a `document database`.
- Relational and document databases are different.
    - Organize data differently.
    - Support different query languages.
- Document databases are categorized under the `NoSQL` umbrella term.
- Read chapters on `collections` and `documents` to get a better idea on how a document database stores data.
    - Collections: `docs.mongodb.com/manual/core/databases-and-collections/`
    - Documents: `docs.mongodb.com/manual/core/document/`
- You can install and run MongoDB locally.
    - We will, however, use Mongo database service.
    - Preferred is `MongoDB Atlas`.
- After creating and logging into account, Atlas recommends creating cluster.
    - In latest versions of Atlas, you may see create a database.
- Choose `AWS` as the provider and a region you're close to.
- Create cluster.
- Do not continue before cluster is ready.
- Let's create credentials for app to connect to the database.
    - Click `Database Access` tab.
    - Grant user with permissions to read and write to any database.
- Define the IP addresses that are allowed access to database.
    - All access from anywhere.
- Click `Connect` and choose `Connect your application`.
- You will see the `MongoDB URI`.
    - This is the address of the database that we will supply to the MongoDB client library we will add to our app.
    - Looks like this:
```
mongodb+srv://fullstack:<PASSWORD>@<CLUSTER_NAME>.mongodb.net/test?retryWrites=true
```
- Can use DB directly from JS code with the official `MongoDB Node.JS Driver`:
    - `https://mongodb.github.io/node-mongodb-native/`
    - However, it's cumbersome.
- We use the `Mongoose` library instead.
    - Offers higher level API.
- `Mongoose` is described as an `object document mapper (ODM)`.
    - Saving JS objects as Mongo documents is straightforward with this library.
- Install `Mongoose`.
```
npm install mongoose
```
- Do not add code dealing with Mongo to our backend just yet.
- Make a practice app.
- Create new file `mongo.js`:
```javascript
const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@<CLUSTER_NAME>.mongodb.net/test?retryWrites=true`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
});

const Note = mongoose.model('Note', noteSchema);

const note = new Note({
    content: 'HTML is Easy',
    date: new Date(),
    important: true
});

note.save().then(result => {
    console.log('note saved!');
    mongoose.connection.close();
});
```
- Remember that your MongoDB URI is different than above.
- The password is also passed in as a command line parameter.
- Access it like so:
```javascript
const password = process.argv[2];
```
- Running `node mongo.js <password>` makes Mongo add a new document to the database.
- Remember the password is the credentials we made earlier.
    - URL encode password with special characters.
- View current state of DB in the `Collection` section in the `Overview` tab.
- We can change the name of the database from the URI: `mongodb+srv://fullstack:<PASSWORD>@<CLUSTER_NAME>.mongodb.net/<name_of_database>?retryWrites=true`
- Change the DB name to `note-app` instead:
    - `mongodb+srv://fullstack:<PASSWORD>@<CLUSTER_NAME>.mongodb.net/note-app?retryWrites=true`
- Run the code again.
- Data is now stored in the right database.
- You can create a database by clicking `Create Database`.
- You can also automatically create one because MongoDB Atlas auto creates a new DB when an app tries to connect to a DB that does not exist.

## Schema
- After establishing connection to DB, we define the `schema` for a note and the matching `model`.
```javascript
const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
});

const Note = mongoose.model('Note', noteSchema);
```
- Define `schema` of a note that is stored in the `noteSchema` variable.
    - It basically tells Mongoose how the note objects are to be stored in the DB.
- In `Note` model definition, the first parameter is the name of the model.
    - This is singular.
    - The name of the collection is lowercased plural (e.g. `notes`).
    - Mongoose convention to auto name collections are plural when schema refers to them in the singular (e.g. `Note`).
- Document DBs like Mongo are `schemaless`.
    - Doesn't care about the structure of data.
    - Can store documents with different fields in the same collection.
- Idea of Mongoose is that the data in the DB is given a `schema at the level of the application` that defines the shape of the documents stored in any given collection.

## Creating and Saving Objects
- App creates new object with the `Note` model:
```javascript
const note = new Note({
    content: 'HTML is Easy',
    date: new Date(),
    important: false
});
```
- Models are `constructor functions`.
    - Create new JS objects based on parameters.
    - These objects have the properties of the model.
    - They also have the method for saving the object to the DB.
- Save object to DB with `save` method.
    - Provided with event handler with the `then` method.
```javascript
note.save().then(result => {
    console.log('note saved!');
    mongoose.connection.close();
});
```
- When object is saved to DB, event handler provided to `then` gets executed.
    - Closes connection to database.
    - If connection is not closed, the program will never finish executing.
- The result of the save operation is in `result` parameter.
    - Not interesting to look at when we save just 1 note.
    - Can look at it if you're curious.
- MongoDB documentation is not that great/consistent.

## Fetching Objects From The Database
- Comment code for generating new notes and replace with this:
```javascript
Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note);
    });
    mongoose.connection.close();
});
```
- When executed, program prints all the notes stored in the database.
- Objects retrieved with `find` method of the `Note` model.
    - Parameter of `find` is an object that tells what the search conditions are.
    - Parameter is an empty object, so we get all notes in the `notes` collection.
    - Search condition adheres to Mongo search query syntax.
- We can restrict search to only include important notes like so:
```javascript
Note.find({ important: true }).then(result => {
    // ...
});
```

## Backend Connected To A Database
- We have enough knowledge to start using Mongo in our app.
- Copy the Mongoose definitions to `index.js`.
```javascript
const mongoose = require('mongoose');

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!!
const url = 'mongodb+srv://fullstack:<PASSWORD>@<CLUSTER_NAME>.mongodb.net/note-app?retryWrites=true';

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
});

const Note = mongoose.model('Note', noteSchema);
```
- Change handler for fetching all notes:
```javascript
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    });
});
```
- We can verify backend works for displaying all documents.
    - Go to `localhost:3001/api/notes`.
- Frontend assumes every object has a unique id in the `id` field.
- We don't want to return the mongo versioning field `__v` to frontend.
- One way to format objects returned by Mongoose is to `modify` the `toJSON` method of schema.
    - Used on all instances of the models produced with that schema.
- Modify like so:
```javascript
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
```
- The `_id` property of Mongoose objects look like strings, but it's an object.
- The `toJSON` method transforms it to a string.
- Respond to HTTP request with a list of objects formatted with the `toJSON` method:
```javascript
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    });
});
```
- `notes` variable is assigned an array of objects returned by Mongo.
- When response is sent in JSON format, the `toJSON` method of each object in array is called automatically by `JSON.stringify` method.

## Database Configuration Into Its own Module
- Extract Mongoose specific code to its own module.
- Create new directory called `models`.
    - Add a file called `note.js`.
```javascript
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB');
    });

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
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
- Node `modules` are defined differently than defining `ES6 modules` in Part 2.
- Public interface of module is defined by setting value to the `module.exports` variable.
    - Set to the `Note` model.
    - Variables defined in the module like `mongoose` and `url` are not accessible to users of the module.
- Importing is like this in `index.js`:
```javascript
const Note = require('./models/note');
```
- `Note` is assigned to the object that the module defines.
- As you may have noticed, the connection is slightly different:
```javascript
const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    });
```
- Address of DB is passed via environment variable.
- both event handlers log messages to console.
- Many ways to define environment variables.
- One way is to define it when it's started:
```
MONGODB_URI=address_here npm run dev
```
- A sophisticated way is to use `dotenv` library.
- Install like so:
```
npm install dotenv
```
- To use the library, create a `.env` file at the root.
- Environment variables are defined inside of the file:
```
MONGODB_URI='mongodb+srv://<USER>:<PASSWORD>@<CLUSTER_NAME>.mongodb.net/<DB_NAME>?retryWrites=true'
PORT=3001
```
- Should ignore `.env` right away, so place it in `.gitignore`.
    - This is confidential, so it should be ignored.
- `.env` variables used with `require('dotenv').config()`.
    - Reference in code with the `process.env.<ENV_VARIABLE>` syntax.
- Change `index.js`:
```javascript
require('dotenv').config();
const express = require('express');
const app = express();
const Note = require('./models/note');

// ...

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```
- Import `dotenv` before `note` model.

## Using Database In Route Handlers
- Change the rest of the backend to use the database.
- Creating new note is like this:
```javascript
app.post('/api/notes', (request, response) => {
    const body = request.body;

    if (body === undefined) {
        return response.status(400).json({ error: 'content missing '});
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });

    note.save().then(savedNote => {
        response.json(savedNote);
    });
});
```
- The note objects are created with `Note` constructor function.
- Response sent inside of callback of `save` function.
    - Ensures only to send response when successful operation.
- The `savedNote` is the newly created note.
    - It's sent back in the response formatted with the `toJSON` method.
- Use Mongoose's `findById` method to get an individual note.
```javascript
app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note);
    });
});
```

## Verifying Frontend & Backend Integration
- When backend gets expanded, it's a good idea to test the backend first with the browser, Postman, or the VS Code REST client.
- Then, test that the frontend works with the backend.
- Integrate the frontend and backend one functionality at a time.

## Error Handling
- Visiting URL of a note with an id that does not exist leads to a response that is `null`.
- Change behavior so that if note with given id does not exist, server responds with 404.
- Implement a `catch` block to handle cases where promise returned by `findById` method is `rejected`.
```javascript
app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).end();
        });
});
```
- No matching note means `note` is `null` and the else statement runs.
    - Results in status 404.
- If promise returned by `findById` is rejected, server returns status 500 internal server error.
- One more type of error when we request an id in the wrong format.
- Make small adjustment in `catch` block:
```javascript
app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => {
            console.log(error);
            response.status(400).send({ error: 'malformatted id' });
        });
});
```
- Format of id is incorrect means the catch block will run.
- Appropriate status code is 400 bad request.
- Never a bad idea to print error.

