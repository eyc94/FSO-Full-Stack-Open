# Introduction to React

- Start by creating simple React application and knowing core concepts of React.
- Easiest way is to use tool called `create-react-app`.
- Possible to install `create-react-app` on machine if `npm` tool is at least version 5.3.
- Create an application called `part1` and navigate to directory.
```
$ npx create-react-app part1
$ cd part1
```
- Start application with:
```
$ npm start
```
- The application runs in localhost port 3000 by default.
- Browser launches automatically.
- Open console and editor to see side-by-side.
- Code of the app resides in the `src` folder.
- Simplify default code in `index.js`:
```javascript
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
```
- The file `App.js` looks like:
```javascript
import React from 'react';

const App = () => (
    <div>
        <p>Hello world</p>
    </div>
);

export default App;
```
- Files `App.css`, `App.test.js`, `index.css`, `logo.svg`, `setupTests.js` and `reportWebVitals.js` may be deleted.

## Component
