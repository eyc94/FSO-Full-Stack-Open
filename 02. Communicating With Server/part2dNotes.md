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