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

