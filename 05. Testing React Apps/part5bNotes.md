# props.children & Prototypes

## Displaying The Login Form Only When Appropriate
- Modify app to show login form only when user clicks login button.
- Allow user to cancel login with button.
- Extract login form to its own component:
```javascript
const LoginForm = ({ handleSubmit, handleUsernameChange, handlePasswordChange, username, password }) => {
    return (
        <div>
            <h1>Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    username
                    <input
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div>
                    password
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
};
```
- Notice we destructured the `props` object to its variables.
- If not, it would look like this:
```javascript
const LoginForm = (props) => {
    return (
        <div>
            <h1>Login</h2>
            <form onSubmit={props.handleSubmit}>
                <div>
                    username
                    <input
                        value={props.username}
                        onChange={props.handleUsernameChange}
                    />
                </div>
                // ...
                <button type="submit">login</button>
            </form>
        </div>
    );
};
```
- Fast way of implementing functionality is to change `loginForm` of `App` like so:
```javascript
const App = () => {
    const [loginVisible, setLoginVisible] = useState(false);

    // ...

    const loginForm = () => {
        const hideWhenVisible = { display: loginVisible ? 'none' : '' };
        const showWhenVisible = { display: loginVisible ? '' : 'none' };

        return (
            <div>
                <div style={hideWhenVisible}>
                    <button onClick={() => setLoginVisible(true)}>log in</button>
                </div>
                <div style={showWhenVisible}>
                    <LoginForm
                        username={username}
                        password={password}
                        handleUsernameChange={({ target }) => setUsername(target.value)}
                        handlePasswordChange={({ target }) => setPassword(target.value)}
                        handleSubmit={handleLogin}
                    />
                    <button onClick={() => setLoginVisible(false)}>cancel</button>
                </div>
            </div>
        );
    };

    // ...
};
```
- The `loginVisible` state determines whether login form is visible or not.
    - Both buttons have event handler defined directly inline.
- We use inline style rule to make the `display` property `none` if we do not want to show component.
- We use ternary operator.

## The Components Children, AKA. props.children
- Code for visibility is considered its own logical entity.
- Extract to its own module.
- Implement a `Togglable` component:
```javascript
<Togglable buttonLabel='login'>
    <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
    />
</Togglable>
```
- Notice the closing tag for `Togglable` is different than `LoginForm`.
- Notice `Togglable` wraps `LoginForm`.
    - So `LoginForm` is a child of `Togglable`.
- Can put any React elements between the `Togglable` tags.
```javascript
<Togglable buttonLabel='reveal'>
    <p>this line is at start hidden</p>
    <p>also this is hidden</p>
</Togglable>
```
- Code for `Togglable` component:
```javascript
import { useState } from 'react';

const Togglable = (props) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? 'none' : '' };
    const showWhenVisible = { display: visible ? '' : 'none' };

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>cancel</button>
            </div>
        </div>
    );
};

export default Togglable;
```
- So `props.children` is used for referencing the child components of the component.
- Child components are the React components we define in the opening and closing tags.
- So the children are rendered in the code that is used for rendering the component itself.
- `children` is automatically added by React and always exists.
    - If component is closed with auto closing tag `/>`, `props.children` is empty.
- `Togglable` is reusable and we can use for form that is used to create notes.
- Extract the form to another component first:
```javascript
const NoteForm = ({ onSubmit, handleChange, value }) => {
    return (
        <div>
            <h2>Create a new note</h2>

            <form onSubmit={onSubmit}>
                <input
                    value={value}
                    onChange={handleChange}
                />
                <button type="submit">save</button>
            </form>
        </div>
    );
};
```
- Define form component inside of `Togglable` component:
```javascript
<Togglable buttonLabel="new note">
    <NoteForm
        onSubmit={addNote}
        value={newNote}
        handleChange={handleNoteChange}
    />
</Togglable>
```

## State of the Forms
- State is currently in the `App` component.
- React docs say where to place state:
    - **Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.**
- Think of the state of the form.
    - Creating new notes.
    - Handled originally in the `App` component but it doesn't use it.
    - Just move it to the corresponding components.
```javascript
import { useState } from 'react';

const NoteForm = ({ createNote }) => {
    const [newNote, setNewNote] = useState('');

    const handleChange = (event) => {
        setNewNote(event.target.value);
    };

    const addNote = (event) => {
        event.preventDefault();
        createNote({
            content: newNote,
            important: Math.random() > 0.5
        });

        setNewNote('');
    };

    return (
        <div>
            <h2>Create a new note</h2>

            <form onSubmit={addNote}>
                <input
                    value={newNote}
                    onChange={handleChange}
                />
                <button type="submit">save</button>
            </form>
        </div>
    );
};

export default NoteForm;
```
- `newNote` state is moved from `App` to the note form component.
- There is one prop left, `createNote`.
    - Form calls this when new note is created.
- `App` component is simpler.
- The `addNote` function receives a new note as a parameter and function is the only prop we send to form.
```javascript
const App = () => {
    // ...
    const addNote = (noteObject) => {
        noteService
            .create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote));
            });
    };
    // ...
    const noteForm = () => {
        <Togglable buttonLabel='new note'>
            <NoteForm createNote={addNote} />
        </Togglable>
    };

    // ...
};
```
- Can do the same for the login form.

# References to Components With ref
- Current implementation is good but needs improvements.
- New note is created, and the new note form is still there.
    - We want to hide the new note form.
    - Form currently stays visible.
    - This is controlled by the `visible` variable of `Togglable` component.
    - Need to access outside of component.
- Many ways to close form from parent component.
- Use the `ref` mechanism of React.
    - Offers reference to component.
- Change the `App` like so:
```javascript
import { useState, useEffect, useRef } from 'react';

const App = () => {
    // ...
    const noteFormRef = useRef();

    const noteForm = () => {
        <Togglable buttonLabel='new note' ref={noteFormRef}>
            <NoteForm createNote={addNote} />
        </Togglable>
    };
};
```
- The `useRef` is used to make a `noteFormRef` ref.
    - Assigned to `Togglable` component that has creation note form.
    - `noteFormRef` acts as reference to component.
    - Ensures same reference (ref) is kept throughout re-renders of component.
- Change the `Togglable` component:
```javascript
import { useState, forwardRef, useImperativeHandle } from 'react';

const Togglable = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? 'none' : '' };
    const showWhenVisible = { display: visible ? '' : 'none' };

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    useImperativeHandle(ref, () => {
        return {
            toggleVisibility
        };
    });

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>cancel</button>
            </div>
        </div>
    );
});

export default Togglable;
```
- Function creating component is wrapped in `forwardRef` call.
- Component can access the ref that is assigned to it.
- Component uses `useImperativeHandle` hook to make `toggleVisibility` function available outside of component.
- Hide form by calling `noteFormRef.current.toggleVisibility()` after new note is created.
```javascript
const App = () => {
    // ...
    const addNote = (noteObject) => {
        noteFormRef.current.toggleVisibility();
        noteService
            .create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote));
            });
    };
    // ...
};
```
- `useImperativeHandle` function is a React hook.
    - Used for defining functions in component which can be called from outside component.
- Changes state of component.
- Looks unpleasant.
- Can look better with older React class-based components.
    - Take a look at Part 7.
- There are other use cases for refs than accessing React components.

## One Point About Components
- When we define components in React:
```javascript
const Togglable = () => {
    // ...
};
```
- And we use it like this:
```javascript
<div>
    <Togglable buttonLabel="1" ref={togglable1}>
        first
    </Togglable>

    <Togglable buttonLabel="2" ref={togglable2}>
        second
    </Togglable>

    <Togglable buttonLabel="3" ref={togglable3}>
        third
    </Togglable>
</div>
```
- We create 3 separate instances of component that all have their own separate state.
- `ref` attribute is used for assigning a reference to each components in variables `togglable1`, `togglable2`, and `togglable3`.

## PropTypes
- `Togglable` component assumes `buttonLabel` attribute is given on its call.
    - If forgotten, it just creates a small button with no text in it.
- Can enforce that the `buttonLabel` is defined.
- Expected and required props of component are defined with `prop-types` package.
    - Install it:
```
npm install prop-types
```
- Define `buttonLabel` prop as a mandatory or `required` string-type prop:
```javascript
import PropTypes from 'prop-types';

const Togglable = React.forwardRef((props, ref) => {
    // ...
});

Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
};
```
- Console displays red error message if `buttonLabel` is left undefined.
- Define PropTypes to `LoginForm` component as well:
```javascript
import PropTypes from 'prop-types';

const LoginForm = ({ handleSubmit, handleUsernameChange, handlePasswordChange, username, password }) => {
    // ...
};

LoginForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleUsernameChange: PropTypes.func.isRequired,
    handlePasswordChange: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
};
```
- If type of prop is wrong, an error will also be thrown.

## ESlint
- Used `ESlint` code style in Part 3 for backend.
- Use it for frontend too.
- `create-react-app` has ESlint installed to project by default.
    - Just tweak configs in `.eslintrc.js` file.
- Don't run `eslint --init` command because it installs latest version of ESlint that is not compatible.
- Start testing frontend.
    - Install the `eslint-plugin-test` package to avoid linter errors.
```
npm install --save-dev eslint-plugin-jest
```
- Create `.eslintrc.js` with the following:
```javascript
/* eslint-env node */
module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest/globals": true 
    },
    "extends": [ 
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react", "jest"
    ],
    "rules": {
        "indent": [
            "error",
            2  
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "eqeqeq": "error",
        "no-trailing-spaces": "error",
        "object-curly-spacing": [
            "error", "always"
        ],
        "arrow-spacing": [
            "error", { "before": true, "after": true }
        ],
        "no-console": 0,
        "react/prop-types": 0,
        "react/react-in-jsx-scope": "off"
    },
    "settings": {
        "react": {
        "version": "detect"
        }
    }
};
```
- If using VSCode with ESLint plugin, you might need to add additional workspace setting to work.
- If you see `Failed to load plugin react: Cannot find module 'eslint-plugin-react'`, additional config is needed.
    - Add the line `"eslint.workingDirectories": [{ "mode": "auto" }]` to `settings.json` in workspace seems to fix it.
- Create `.eslintignore` with the following:
```
node_modules
build
.eslintrc.js
```
- Add npm script:
```javascript
{
    // ...
    {
        "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject",
        "server": "json-server -p3001 db.json",
        "eslint": "eslint ."
    },
    // ...
}
```
- The component `Togglable` causes a nasty looking warning: `Component definition is missing display name`.
- React dev tools also shows that component has no name.
    - Easy fix:
```javascript
import { useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const Togglable = React.forwardRef((props, ref) => {
    // ...
});

Togglable.displayName = 'Togglable';

export default Togglable;
```
- The `create-react-app` has its own default config of ESLint.
    - We overrid it.
    - Documentations mention that it is ok to replace default but does not encourage it.
