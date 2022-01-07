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
- There are some more steps but it's explained above. Move on for now.

## Frontend Production Build
- We have been running React code in `development mode`.
    - App is configured to give error messages.
    - Immediately renders changes to browser, etc.
- When app is deployed, we need to create a `production build`.
    - Version of app optimized for production.
- Apps created with `create-react-app` can use `npm run build` to create a production build of an app.
- Run `npm run build` from the frontend project root.
    - This creates folder called `build`.
    - Inside contains only HTML file called `index.html`.
    - It also contains folder called `static`.
    - `Minified` version of our app's JS code is generated and stored in `static` folder.
        - JS code minified into one file.
        - Minified code is not very readable.

## Serving Static Files From The Backend
- One way to deploy frontend.
    - Copy production build (the `build` folder) to root of backend repo.
    - Configure backend to show frontend's main page (the `build/index.html`).
- Copy the production build of frontend to root of backend.
```
cp -r <path_to_build> <path_to_backend_root>
```
- Can just copy and paste too.
- The backend directory should have the build folder now.
- To make express show `static content` (`index.html` and the JS, etc), need built-in middleware from express called `static`.
- Add the following:
```javascript
app.use(express.static('build'));
```
- Basically, whenever express gets an HTTP GET request, it first checks if the `build` folder has the file corresponding to request's address.
    - If correct file is found, express will return it.
- HTTP GET requests to `www.serveraddress.com/index.html` or `www.serveraddress.com` will show the React frontend.
    - GET requests to `www.serveraddress.com/api/notes` will be handled by the backend's code.
- Both frontend and backend are at same address.
    - Declare `baseUrl` as a `relative` URL.
    - So, leave out part declaring the server.
```javascript
import axios from 'axios';
const baseUrl = '/api/notes';

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
};

// ...
```
- After this change, create a new production build.
- Copy build to root of backend repo.
- App can now also be used from the backend address `http://localhost:3001`.
- App now works like part 0's `single-page app`.
- When we use browser to go to `http://localhost:3001`, server returns `index.html` from `build` folder.
- Summarized below:
```html
<html>
<head>
    <meta charset="utf-8"/>
    <title>React App</title>
    <link href="/static/css/main.f9a47af2.chunk.css" rel="stylesheet">
</head>
<body>
    <div id="root"></div>
    <script src="/static/js/1.578f4ea1.chunk.js"></script>
    <script src="/static/js/main.104ca08d.chunk.js"></script>
</body>
</html>
```
- We see 1 CSS stylesheet and 2 JS script tags.
- React code fetches notes from `http://localhost:3001/api/notes` and renders them.
- A summary of the setup is:
    - Everything is now in the same node/express-backend that runs in localhost:3001.
    - When browser goes to the page, `index.html` is rendered.
    - Causes browser to fetch product version of the React app.
    - Once it runs, it fetches json-data from the address localhost:3001/api/notes.

## The Whole App To Internet
- After production version of app works locally, commit production build of frontend to backend repo.
- Push code to Heroku again.
- App now works but the changing importance does NOT.
- App saves notes to a variable. If app crashes or restarts, it's all gone.
- App needs a database.
- Before introducing database, review summary of setup:
    - The node/express-backend now resides in Heroku server.
    - When root address `https://<app_name>.herokuapp.com/` is accessed, browser loads and executes React app.
    - React app fetches json-data from Heroku server.

## Streamlining Deploying Of The Frontend
- To make manual work of creating a new production build and copying it over, we need to make some `npm-scripts` to `package.json`.
```json
{
    "scripts": {
        // ...
        "build:ui": "rm -rf build && cd <path_to_frontend> && npm run build && cp -r build <path_to_backend>",
        "deploy": "git push heroku main",
        "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
        "logs:prod": "heroku logs --tail"
    }
}
```
- `npm run build:ui` script runs from the backend.
    - It removes the `build` folder.
    - Goes to the frontend repo.
    - Runs `npm run build`.
    - Copies the `build` folder from the frontend to the backend repo.
- `npm run deploy` releases current backend to Heroku.
- `npm run deploy:full` combines the two above.
    - Contains the git commands to update the backend repo.
- `npm run logs:prod` shows the Heroku logs.

## Proxy
- Changes on frontend made it not work in dev mode (started with `npm start`).
    - Connection to backend does not work because we changed `baseUrl` to a relative one.
```javascript
const baseUrl = '/api/notes';
```
- In dev mode, frontend is at the address `localhost:3000`.
- Requests made to backend go to the wrong address then: `http://localhost:3000/api/notes`.
    - The backend is actually at port 3001.
- If frontend was created with `create-react-app`, it's easy to solve.
    - Make the following declaration in `package.json` of the frontend repo:
```json
{
    "dependencies": {
        // ...
    },
    "scripts": {
        // ...
    },
    "proxy": "http://localhost:3001"
}
```
- After restarting, the React dev environment will work as a `proxy`.
- If React code does an HTTP request to a server address at `http://localhost:3000` not managed by the React app itself (when requests are not about fetching CSS or JS of app), the request will be redirected to server at `http://localhost:3001`.
- Now frontend is fine.
    - Working in dev mode and production mode.
- So, you see how annoying it is to keep making a new production build and copying it over every time you make a change in the frontend.
    - This makes creating an automated `deployment pipeline` very difficult.
- We can place both the frontend and backend into the same repo.
    - We won't go into this now.
- Can also deploy frontend code as its own app.
    - Apps created with `create-react-app` is straightforward.