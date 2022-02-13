# Login In Frontend
- Last two parts were about backend.
- Part 2 was last time we dealt with frontend.
    - Does not yet support user management that we did in backend in Part 4.
- The frontend just shows existing notes.
    - Cannot add new notes because of what we did in Part 4.
    - Backend expects a token verifying user's identity is sent with the new note.
    - We can change from important to not important.
- Being implementing user login.
- In this part, we assume new users will not be added from the frontend.

## Handling Login
- Login form is on the top.
- Form to add new notes is on the bottom.
- Code in the `App` component looks like this:
```javascript
const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        noteService
            .getAll().then(initialNotes => {
                setNotes(initialNotes);
            });
    }, []);

    // ...

    const handleLogin = (event) => {
        event.preventDefault();
        console.log('logging in with', username, password);
    };

    return (
        <div>
            <h1>Notes</h1>

            <Notification message={errorMessage} />

            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>

            // ...
        </div>
    );
};

export default App;
```
- Frontend doesn't show notes if it's not connected to backend.
- Start the backend with `npm run dev` from Part 4.
    - This runs backend on port 3001.
- In a separate terminal window, start the frontend with `npm start`.
- You can now see the notes saved in MongoDB.
- Login form is handled same way in Part 2.
    - App state has `username` and `password` states that get data from form.
    - Form fields have event handlers.
    - There is the onChange event handler that gets data and changes the state.
    - Object is given to event handler as a parameter.
    - Object is destructured to get just the `target` from the object.
    - We then save the value to the state.
- The `handleLogin` function is not yet implemented.
- Logging in happens by sending HTTP POST request to `/api/login`.
- Separate code responsible for this request to its own module to file `services/login.js`.
    - Use `async/await` instead of promises for HTTP requests:
```javascript
import axios from 'axios';
const baseUrl = '/api/login';

const login = async credentials => {
    const response = await axios.post(baseUrl, credentials);
    return response.data;
};

export default { login };
```
- Method for handling login is now implemented like so:
```javascript
import loginService from './services/login';

const App = () => {
    // ...

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const user = await loginService.login({
                username, password
            });
            setUser(user);
            setUsername('');
            setPassword('');
        } catch (exception) {
            setErrorMessage('Wrong credentials');
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }
    }

    // ...
};
```
- If login succeeds, form fields are emptied and server response is saved to `user` field of app's state.
- If login fails, user is notified with error message.
- Show login form if user is not logged in.
- Form for adding new notes is shown only if logged in.
- Add two helper functions to `App` for generating the forms:
```javascript
const App = () => {
    // ...

    const loginForm = () => {
        <form onSubmit={handleLogin}>
            <div>
                username
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type="submit">login</button>
        </form>
    };

    const noteForm = () => {
        <form onSubmit={addNote}>
            <input
                value={newNote}
                onChange={handleNoteChange}
            />
            <button type="submit">save</button>
        </form>
    };

    return (
        // ...
    );
};
```
- Conditionally render them:
```javascript
const App = () => {
    // ...

    const loginForm = () => {
        // ...
    };

    const noteForm = () => {
        // ...
    };

    return (
        <div>
            <h1>Notes</h1>

            <Notification message={errorMessage} />

            {user === null && loginForm()}
            {user !== null && noteForm()}

            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {notesToShow.map((note, i) => 
                    <Note
                        key={i}
                        note={note}
                        toggleImportance={() => toggleImportanceOf(note.id)}
                    />
                )}
            </ul>

            <Footer />
        </div>
    );
};

export default App;
```
- Can use a React trick to render forms conditionally:
```javascript
{
    user === null && loginForm()
}
```
- If the first statement is false, the second is not executed at all.
- Make it more straightforward using `conditional operator`:
```javascript
return (
    <div>
        <h1>Notes</h1>

        <Notification message={errorMessage} />

        {user === null ?
            loginForm() :
            noteForm()
        }

        <h2>Notes</h2>

        // ...
    </div>
)
```
- Do one more modification.
- If user is logged-in, display their name.
```javascript
return (
    <div>
        <h1>Notes</h1>

        <Notification message={errorMessage} />

        {user === null ?
            loginForm() :
            <div>
                <p>{user.name} logged-in</p>
                {noteForm()}
            </div>
        }

        <h2>Notes</h2>

        // ...

    </div>
)
```
- Main component is way too large.
- Consider making sub components and making this smaller.

## Creating New Notes
- Token returned with a successful login is saved to app's state.
    - The `user`'s field `token`.
```javascript
const handleLogin = async (event) => {
    event.preventDefault();
    try {
        const user = await loginService.login({
            username, password
        });

        setUser(user);
        setUsername('');
        setPasword('');
    } catch (exception) {
        // ...
    }
};
```
- Fix creating new notes so it works with backend.
- Add token of logged-in user to Authorization header of HTTP request.
- Change the `noteService` module like so:
```javascript
import axios from 'axios';
const baseUrl = '/api/notes';

let token = null;

const setToken = newToken => {
    token = `bearer ${newToken}`;
};

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
};

const create = async newObject => {
    const config = {
        headers: { Authorization: token }
    };

    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
};

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject);
    return request.then(response => response.data);
};

export default { getAll, create, update, setToken };
```
- There is a private variable that is called `token`.
- The value is changed by the `setToken` function.
- The `create` function now sets the token to the `Authorization` header with async/await syntax.
- Header is given as third parameter of the post method.
- Event handler is now changed to call the method `noteService.setToken(user.token)` with a successful login.
```javascript
const handleLogin = async (event) => {
    event.preventDefault();
    try {
        const user = await loginService.login({
            username, password
        });

        noteService.setToken(user.token);
        setUser(user);
        setUsername('');
        setPasword('');
    } catch (exception) {
        // ...
    }
};
```
- Adding new notes work now!

## Saving The Token To The Browser's Local Storage
- One major flaw.
- User login info is gone after each rerender.
- Creating new notes causes user to login each time.
- Solved by saving login details to `local storage`.
    - This is a `key-value` database in the browser.
- Value corresponding to key is saved to DB with method `setItem`.
```javascript
window.localStorage.setItem('name', 'juha tauriainen');
```
- Value of a key can be found with `getItem`.
```javascript
window.localStorage.getItem('name');
```
- The `removeItem` method removes a key.
- Values in local storage are persisted even when the page is rerendered.
    - Storage is origin-specific so each web application has its own storage.
- Extend app to save details of a logged-in user to local storage.
- Values saved to storage are `DOMstrings`.
    - Cannot save JS object as is.
    - Object has to be parsed to JSON first with `JSON.stringify`.
    - When a JSON object is read from local storage, parse back to JS with `JSON.parse`.
- Change the `handleLogin` method:
```javascript
const handleLogin = async (event) => {
    event.preventDefault();
    try {
        const user = await loginService.login({
            username, password
        });

        window.localStorage.setItem(
            'loggedNoteappUser', JSON.stringify(user)
        );
        noteService.setToken(user.token);
        setUser(user);
        setUsername('');
        setPasword('');
    } catch (exception) {
        // ...
    }
};
```
- Details of logged in user saved to local storage.
- View on console with `window.localStorage` command.
- Inspect local storage with dev tools:
    - Go to `Application` tab and select `Local Storage`.
- Modify app so that when we enter page, check if user details are in local storage.
- If so, details saved to state of app and to `noteService`.
- Use an `effect hook`.
    - Can have multiple effect hooks.
    - Create a second one:
```javascript
const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = userState(null);

    useEffect(() => {
        noteService
            .getAll().then(initialNotes => {
                setNotes(initialNotes);
            });
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            noteService.setToken(user.token);
        }
    }, []);

    // ...
};
```
- Effect is executed only when the component is rendered for the first time.
- User stays logged in forever.
- Can add a logout functionality which removes login details from the local storage.
- Logout a user from console with:
```javascript
window.localStorage.removeItem('loggedNoteappUser');
```
- Or:
```javascript
window.localStorage.clear();
```
