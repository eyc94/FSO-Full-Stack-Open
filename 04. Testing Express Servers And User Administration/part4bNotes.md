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

