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
