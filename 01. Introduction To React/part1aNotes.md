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
- `App.js` now defines a `React component` with the name `App`.
- Final line of `index.js`:
```javascript
ReactDOM.render(<App />, document.getElementById('root'));
```
- This code above renders its contents into the div-element.
- This div-element is defined in the `public/index.html` file having the `id` value 'root'.
- The `public/index.html` file does not have any HTML visible in the browser.
- When using React, all content that needs to be rendered is defined as React components.
- Look at the code:
```javascript
const App = () => (
    <div>
        <p>Hello world</p>
    </div>
);
```
- Component above rendered as div-tag wrapping a p-tag with text.
- Component is the JS function. Function above does not have parameters.
- Function is then assigned to constant variable `App`.
- We use arrow functions to define functions in JS.
- The code above uses the shorthand notation because we have just a single expression.
    - The function returns value of expression in return statement.
- Function defining component can have any JS code.
- Can also render dynamic content inside of component.
- Modify component:
```javascript
const App = () => {
    const now = new Date();
    const a = 10;
    const b = 20;

    return (
        <div>
            <p>Hello world, it is {now.toString()}</p>
            <p>
                {a} plus {b} is {a + b}
            </p>
        </div>
    )
};
```
- JS code in curly braces is evaluated and result is embedded into defined place in HTML produced by component.

## JSX
- Looks like React components are returning HTML.
- They are not.
- Layout of React components is written in JSX.
- JSX looks like HTML, but we are dealing with a way to write JS.
- JSX returned by React components is compiled into JS.
- After compiling, our app looks like:
```javascript
const App = () => {
    const now = new Date();
    const a = 10;
    const b = 20;
    return React.createElement(
        'div',
        null,
        React.createElement(
            'p', null, 'Hello world, it is ', now.toString()
        ),
        React.createElement(
            'p', null, a, ' plus ', b, ' is ', a + b
        )
    )
};
```
- Compiling handled by `Babel`.
- Projects created with `create-react-app` configured to compile automatically.
- Every tag needs to be closed.
    - For example `<br>` needs to be written as `<br />`.
