# Getting Data From The Server
- We will work on backend (server-side) functionality in part 3.
- Familiarize ourselves with how code executing in the browser communicates with the backend.
- Use a tool used during development called `JSON Server` to act as our server.
- Create `db.json` in root directory of project:
```json
{
    "notes": [
        {
            "id": 1,
            "content": "HTML is easy",
            "date": "2019-05-30T17:30:31.098Z",
            "important": true
        },
        {
            "id": 2,
            "content": "Browser can execute only JavaScript",
            "date": "2019-05-30T18:39:34.091Z",
            "important": false
        },
        {
            "id": 3,
            "content": "GET and POST are the most important methods of HTTP protocol",
            "date": "2019-05-30T19:20:14.298Z",
            "important": true
        }
    ]
}
```
- Can install JSON server globally on machine but is not necessary:
```
npm install -g json-server
```
- From root directory of app, run `json-server` using `npx`:
```
npx json-server --port 3001 --watch db.json
```
- `json-server` runs on port 3000 by default.
- The apps created with create-react-app uses 3000 by default, so we use 3001 for the `json-server`.
- Navigate to `http://localhost:3001/notes`.
    - Can see `json-server` serves the notes we wrote to the file in JSON format.
    - Might need plugin to view the data in JSON format.
- The workflow:
    - Save notes to the server (json-server).
    - React code fetches notes from the server and renders to screen.
    - When new note is added, React code also sends the note to the server.
    - This makes new note persist in "memory".
- `json-server` stores data in `db.json`.
- Real world uses databases to store data.
- `json-server` is a handy tool that enables server-side functionality in development phase without the need to program any of it.