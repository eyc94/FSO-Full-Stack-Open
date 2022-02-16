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
