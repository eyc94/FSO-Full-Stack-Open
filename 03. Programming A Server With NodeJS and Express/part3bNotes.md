# Deploying App To Internet
- Connect frontend in Part 2 with backend from Part 3A.
- In Part 2 and before, we used `json-server` to act as our server.
    - Got notes from server via: `http://localhost:3001/notes`.
    - Now, we get it from `http://localhost:3001/api/notes`.
- Change `baseUrl` in the frontend in `src/services/notes.js` like:
```javascript
import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/notes';

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
};

// ...

export default { getAll, create, update };
```
- Also change URL in the `useEffect` callback function in `App.js`:
```javascript
useEffect(() => {
    axios
        .get('http://localhost:3001/api/notes')
        .then(res => {
            setNotes(res.data);
        });
}, []);
```
- However, the frontend request to `http://localhost:3001/api/notes` does not work.
    - We can access this backend from the browser and Postman without a problem.
    - The error in the console seems to be a CORS related issue.

