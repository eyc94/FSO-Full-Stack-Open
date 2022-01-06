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

## Application To The Internet
- The whole stack is ready!
- Move app to the internet now.
    - Use `Heroku` for this.
    - Instructions on Heroku: `https://devcenter.heroku.com/articles/getting-started-with-nodejs`
- Add a file called `Procfile` to the backend project's root.
    - Tells Heroku how to start application.
```
web: npm start
```
- Change definition of the port app uses in `index.js`:
```javascript
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```
- Either use port defined in `environment variable` called `PORT` or port 3001 if `PORT` is undefined.
- Create Git repo in project directory.
    - Add `.gitignore` with the following:
```
node_modules
```
- Create Heroku app with `heroku create` command.
- Commit code to repo.
- Move it to Heroku with `git push heroku main`.
- App should now work and display all notes if went well.
- If not, check Heroku logs to see why by typing `heroku logs`.
    - Best to do `heroku logs -t`.
- Frontend should also work.
    - Change the `baseUrl` on the frontend to be the address of the Heroku app.
- So, how do we deploy frontend to the internet now?
    - Multiple options.
- Before we move on, the next subsection is some notes on Heroku.

### Heroku
- Create a free account.
- Have `Node.js` and `npm` installed locally.
- Heroku CLI requires `Git`, so you need to install Git as well.
- Download and run installer on your platform:
- For Mac:
    - You can install via `Homebrew`:
    - Run the command below:
```
$ brew install heroku/brew/heroku
```
- Now you can use the `heroku` command from terminal.
- Use `heroku login` to log into Heroku CLI.

