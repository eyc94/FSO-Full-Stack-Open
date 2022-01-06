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

## Same Origin Policy and CORS
- Issue above lies in `CORS`, or `Cross-Origin Resource Sharing`.
    - **Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts) on a web page to be requested from another domain from which the first resource was served. A web page may freely embed cross-origin images, stylesheets, scripts, iframes, and videos. Certain "cross-domain" requests, notably Ajax requests, are forbidden by default by the same-origin security policy.**
- Basically, what is happening is that the JS code of an app running in the browser can only communicate with a server in the same `origin`.
    - Originally, this is `json-server`.
- Our server is in localhost port 3001.
- Frontend is in localhost port 3000.
- So, they do NOT have the same origin.
- CORS is a universal principle of operations of a web application.
- Can allow requests from other origins using Node's `cors` middleware.
- Install cors in backend repo:
```
npm install cors
```
- Use middleware and allow requests from all origins:
```javascript
const cors = require('cors');

app.use(cors());
```
- Now, the frontend works!
- Changing importance of notes has not been implemented yet to the backend.
- The setup is now summarized as follows:
    - The React app that runs in the browser now fetches the data from the node/express-server that runs in localhost:3001.

