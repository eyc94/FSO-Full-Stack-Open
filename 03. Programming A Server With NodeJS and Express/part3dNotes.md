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

## Deploying The Database Backend To Production
- We have to make a new production build because of the changes in the frontend.
- The `dotenv` is only used when backend is not in `production mode`.
- We defined environment variables in `.env`, but we should define variables for database URL in production.
    - Done with `heroku config:set` command:
```
$ heroku config:set MONGODB_URI=mongodb+srv://fullstack:<PASSWORD>@<CLUSTER_NAME>.mongodb.net/<name_of_database>?retryWrites=true
```
- If the command above causes an error, just give the value an apostrophe.
```
$ heroku config:set MONGODB_URI='mongodb+srv://fullstack:<PASSWORD>@<CLUSTER_NAME>.mongodb.net/<name_of_database>?retryWrites=true'
```

## Lint
- Look at a tool called `lint`.
    - **Generally, lint or a linter is any tool that detects and flags errors in programming languages, including stylistic errors. The term lint-like behavior is sometimes applied to the process of flagging suspicious language usage. Lint-like tools generally perform static analysis of source code.**
- In JS, the leading tool is `ESlint`.
- Install ESlint as a development dependency to the backend project:
```
npm install eslint --save-dev
```
- Initialize a default ESlint configuration with:
```
npx eslint --init
```
- Answer all questions.
- The configuration is saved into `.eslintrc.js`.
```javascript
module.exports = {
    'env': {
        'commonjs': true,
        'es2021': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 12
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ],
        'eqeqeq': 'error',
            'no-trailing-spaces': 'error',
    'object-curly-spacing': [
        'error', 'always'
    ],
    'arrow-spacing': [
        'error', { 'before': true, 'after': true }
    ]
    }
}
```
- Change rule about indentation:
```javascript
"indent": [
    "error",
    2
],
```
- Inspecting and validating files like `index.js` is done like so:
```
npx eslint index.js
```
- Recommended to create `npm script` for linting.
```json
{
    // ...
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        // ...
        "lint": "eslint ."
    },
    // ...
}
```
- The `npm run lint` will check every file in the project.
- The `build` folder will get checked too, so add to `.eslintignore` to not do this.
```
build
```
- Better alternative to linter in command line is to configure `eslint-plugin` to the editor.
- It'll run it continuously.
- We can add more rules. Let's add `eqeqeq` rule that warns us, if equality is checked with anything but the triple equals operator.
- Add it under `rules` in the file:
```javascript
{
    // ...
    'rules': {
        // ...
        'eqeqeq': 'error',
    },
}
```
- Add few more changes to rules:
    - Prevent trailing spaces at the end of lines.
    - Require there be a space before and after curly braces.
    - Demand consistent use of whitespaces in the function parameters of arrow functions.
```javascript
{
    // ...
    'rules': {
        // ...
        'eqeqeq': 'error',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': [
            'error', 'always'
        ],
        'arrow-spacing': [
            'error', { 'before': true, 'after': true }
        ]
    },
}
```
- Default config takes predetermined rules into use from `eslint:recommended`:
```javascript
'extends': 'eslint:recommended',
```
- This includes rule about `console.log` commands.
- Disabling rule is done by defining value to 0 in the file.
- Do the `no-console` rule:
```javascript
{
  // ...
  'rules': {
    // ...
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
        'error', 'always'
    ],
    'arrow-spacing': [
        'error', { 'before': true, 'after': true }
    ],
    'no-console': 0
  },
}
```
- Recommended to run linter from command line when making changes to `.eslintrc.js` file.
    - Verifies file is correctly formatted.
- Many projects adopted the Airbnb `JS style guide` by taking Airbnb's `ESlint` configuration into use:
    - `https://github.com/airbnb/javascript`
    - `https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb`