# Altering Data In Server
- When creating notes, we store in a backend server.
- `json-server` claims to be a REST or RESTful API.
    - However, does not exactly match textbook definition of a REST API.
- We look at REST in the next part.
    - Familiarize with the conventions used by json-server and REST APIs in general.
    - We will look at conventional use of `routes` (URLs and HTTP request) in REST.

## REST
- Individual data objects (notes) are `resources`.
    - Every resource has a unique address associated with it (URL).
- General convention by json-server is to locate an individual note at the URL:
    - `notes/3` where 3 is the id of the resource.
    - `notes` would point to the collection of all resources.
- Resources fetched with HTTP GET requests.
    - GET request to `notes/3` retrieves the note with id of 3.
    - GET request to `notes` retrieves all notes.
- Creating new notes and storing them is done by HTTP POST requests.
    - Sent to `notes` URL according to REST convention.
    - Data for new note is sent in the `body` of the request.
- `json-server` requires all data be sent in JSON format.
    - Data must be correctly formatted string.
    - Request must contain `Content-Type` header as `application/json`.

## Sending Data To The Server
- Make changes to event handler responsible for creating new note:
```javascript
const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
        content: newNote,
        date: new Date(),
        important: Math.random() < 0.5
    };

    axios
        .post('http://localhost:3001/notes', noteObject)
        .then(response => {
            console.log(response);
        });
};
```
- Create new object for note.
    - Omit id and let server generate ids.
- Object sent to server using axios `post` method.
    - Event handler logs the response that is sent back from the server to console.
    - The new note is in the value of the `data` property of the `response` object.
- Can use `Network` tab to inspect HTTP requests.
    - Data sent in POST request was a JS object.
    - Axios automatically knew to set `application/json` to `Content-Type` header.
- New note does not show up yet.
- Update the component to update state.
```javascript
const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
        content: newNote,
        date: new Date(),
        important: Math.random() < 0.5
    };

    axios
        .post('http://localhost:3001/notes', noteObject)
        .then(response => {
            setNotes(notes.concat(response.data));
            setNewNote('');
        });
};
```
- We use `setNotes` to update state.
- We reset the form.
- Remember that the `concat` method creates a new array as opposed to updating the existing array.
- Next part deals with coding logic for backend.
    - We also use `Postman`.
- Wiser to let backend generate note timestamp.

## Changing The Importance Of Notes
- Add a button to every note that toggles its importance.
- Make changes to `Note` component:
```javascript
const Note = ({ note, toggleImportance }) => {
    const label = note.important ? 'make not important' : 'make important';

    return (
        <div>
            {note.content}
            <button onClick={toggleImportance}>{label}</button>
        </div>
    )
};
```
- Add a button and assign its event handler as `toggleImportance` function passed in as props.
    - The `App` component defines this function and passes it to the `Note` component.
```javascript
const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [showAll, setShowAll] = useState(true);

    // ...

    const toggleImportanceOf = (id) => {
        console.log('importance of ' + id + ' needs to be toggled');
    };

    // ...

    return (
        <div>
            <h1>Notes</h1>
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
        </div>
    )
};
```
- Every note receives its own unique event handler because of the id passed to it.
- A note stored in json-server backend can be modified in two ways by making HTTP requests to the note's unique URL.
    - Replace the entire note with HTTP PUT request.
    - Change some of the note's properties with HTTP PATCH request.
- Final form of event handler function:
```javascript
const toggleImportanceOf = id => {
    const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };

    axios.put(url, changedNote).then(response => {
        setNotes(notes.map(note => note.id !== id ? note : response.data));
    });
};
```
- First line defines the unique url for each note resource based on id.
- Find note we want to modify with `find` method.
    - Assign this note to the `note` variable.
- Create a new object called `changedNote` that is an exact copy of the old note.
    - The `important` property is changed, however.
    - Uses the `object spread` syntax.
    - The value of `important` gets the negation of the current value of it.
- `changedNote` is a shallow copy of the original.
    - If the old object values were objects then the new object values would reference the old object values directly.
- New note sent with PUT request to backend to replace old object.
- The callback function updates the `notes` state.
    - This is the new array that contains all items from previous array.
    - The old note is replaced by the updated version (note.id === id).
- `map` method creates new array by mapping every item from old array into new array.
    - New array created on the condition that `note.id !== id`.
    - If true, copy the old item to new array.
    - If false, the note object returned by server is added to new array.

## Extracting Communication With The Backend Into A Separate Module
- `App` component now bloated.
    - Has code that communicates to backend server.
- Extract this communication to its own module.
- Create `src/services` directory and add file called `notes.js`.
```javascript
import axios from 'axios';
const baseUrl = 'http://localhost:3001/notes';

const getAll = () => {
    return axios.get(baseUrl);
};

const create = newObject => {
    return axios.post(baseUrl, newObject);
};

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject);
};

export default {
    getAll: getAll,
    create: create,
    update: update
};
```
- Module returns object with three functions as its properties.
    - These functions deal with the notes.
    - Functions return promises returned by axios methods.
- `App` component imports these modules.
```javascript
import noteService from './services/notes';

const App = () => {
```
- Functions of the module can now be used directly with variable.
```javascript
const App = () => {
    // ...

    useEffect(() => {
        noteService
            .getAll()
            .then(response => {
                setNotes(response.data);
            });
    }, []);

    const toggleImportanceOf = id => {
        const note = notes.find(n => n.id === id);
        const changedNote = { ...note, important: !note.important };

        noteService
            .update(id, changedNote)
            .then(response => {
                setNotes(notes.map(note => note.id !== id ? note : response.data));
            });
    };

    const addNote = (event) => {
        event.preventDefault();
        const noteObject = {
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() > 0.5
        };

        noteService
            .create(noteObject)
            .then(response => {
                setNotes(notes.concat(response.data));
                setNewNote('');
            });
    };

    // ...
};

export default App;
```
- We know that when `App` uses the functions, it receives an object that contains the response for the HTTP request.
    - We only use `response.data` property of the response object.
    - Would be nicer if we just get what we needed instead of everything.
```javascript
noteService
    .getAll()
    .then(initialNotes => {
        setNotes(initialNotes);
    });
```
- Change the code in the module like so:
```javascript
import axios from 'axios';
const baseUrl = 'http://localhost:3001/notes';

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
};

const create = newObject => {
    const request = axios.post(baseUrl, newObject);
    return request.then(response => response.data);
};

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject);
    return request.then(response => response.data);
};

export default {
    getAll: getAll,
    create: create,
    update: update
};
```
- We used to return the promise object but now we assign this promise to a variable called `request`.
- We then call the `then` method of the request.
- The new modified functions still return a promise because the `then` method of a promise also returns a promise.
- We define the parameter of `then` to return `response.data` directly.
    - When HTTP request is successful, the promise returns data sent back in response from the backend.
- So, update `App` by fixing callback function of `then` method.
```javascript
const App = () => {
    // ...

    useEffect(() => {
        noteService
            .getAll()
            .then(initialNotes => {
                setNotes(initialNotes);
            });
    }, []);

    const toggleImportanceOf = id => {
        const note = notes.find(n => n.id === id);
        const changedNote = { ...note, important: !note.important };

        noteService
            .update(id, changedNote)
            .then(returnedNote => {
                setNotes(notes.map(note => note.id !== id ? note : returnedNote));
            });
    };

    const addNote = (event) => {
        event.preventDefault();
        const noteObject = {
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() > 0.5
        };

        noteService
            .create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote));
                setNewNote('');
            });
    };

    // ...
};
```

## Cleaner Syntax For Defining Object Literals
- Currently the note related services exports an object with properties assigned to functions for handling notes.
```javascript
import axios from 'axios';
const baseUrl = 'http://localhost:3001/notes';

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
};

const create = newObject => {
    const request = axios.post(baseUrl, newObject);
    return request.then(response => response.data);
};

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject);
    return request.then(response => response.data);
};

export default {
    getAll: getAll,
    create: create,
    update: update
};
```
- Looking at object that is exported, we see that the keys are the same names as the values.
    - We can write object definition in a compact way:
```javascript
{
    getAll,
    create,
    update
}
```
- Module definition can be simplified further:
```javascript
import axios from 'axios';
const baseUrl = 'http://localhost:3001/notes';

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
};

const create = newObject => {
    const request = axios.post(baseUrl, newObject);
    return request.then(response => response.data);
};

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject);
    return request.then(response => response.data);
};

export default { getAll, create, update };
```
- This is an ES6 way of defining objects using variables in a more compact way.
- For example:
```javascript
const name = 'Leevi';
const age = 0;

const person = {
    name: name,
    age: age
};

const person = { name, age };
```
- The old way is the first object definition.
- New way is the second.

## Promises and Errors
- If app allowed deletion of notes.
    - Changing the importance of a note that is already deleted can happen.
- Simulate above by making `getAll` function return hardcoded note that does not exist in backend server.
```javascript
const getAll = () => {
    const request = axios.get(baseUrl);
    const nonExisting = {
        id: 10000,
        content: 'This note is not saved to server',
        date: '2019-05-30T17:30:31.098Z',
        important: true
    };
    return request.then(response => response.data.concat(nonExisting));
};
```
- Change importance of the hardcoded note.
    - Get error in console.
    - Backend server responded to HTTP PUT request with status 404 not found.
- Should handle these errors quietly.
- Current code does not handle rejected promises.
    - Common way of adding handler for rejected promises is `catch` method.
```javascript
axios
    .get('http://example.com/probably_will_fail')
    .then(response => {
        console.log('success!');
    })
    .catch(error => {
        console.log('fail');
    });
```
- If request fails, the `catch` method's event handler is called.
- `catch` method is placed deep in promise chain.
    - Can be placed at the end when all promises in chain throws error.
```javascript
axios
    .put(`${baseUrl}/${id}`, newObject)
    .then(response => response.data)
    .then(changedNote => {
        // ...
    })
    .catch(error => {
        console.log('fail');
    });
```
- Use this idea to register event handler in `App`:
```javascript
const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
        .update(id, changedNote).then(returnedNote => {
            setNotes(notes.map(note => note.id !== id ? note : returnedNote));
        })
        .catch(error => {
            alert(
                `The note '${note.content}' was already deleted from server.`
            );
            setNotes(notes.filter(n => n.id !== id));
        });
};
```
- Error gives alert.
- Deleted note gets filtered out of state.
    - Removing already deleted note done with `filter` method.
    - Returns new array with only items from list for which function that was passed as parameter returns true for.
- Using the `alert()` function is not a good idea.