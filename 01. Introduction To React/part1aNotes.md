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

## Multiple Components
- Modify `App.js`:
```javascript
const Hello = () => {
    return (
        <div>
            <p>Hello world</p>
        </div>
    )
};

const App = () => {
    return (
        <div>
            <h1> Greetings</h1>
            <Hello />
        </div>
    )
};
```
- Defined new component called `Hello`.
- We used it inside another component called `App`.
- We can use it as many times as we want.
```javascript
const App = () => {
    return (
        <div>
            <h1>Greetings</h1>
            <Hello />
            <Hello />
            <Hello />
        </div>
    )
};
```
- Composing apps from resuable components.
- Another strong convention is having `root component` called `App` at the top of the component tree of the app.

## Props: Passing Data to Components
- Pass data to components using `props`.
- Modify component `Hello` as follows:
```javascript
const Hello = (props) => {
    return (
        <div>
            <p>Hello {props.name}</p>
        </div>
    )
};
```
- Function defining component has parameter `props`.
- Parameter receives an object.
- Object has fields corresponding to all the "props" the user of component defines.
- Props are defined like so:
```javascript
const App = () => {
    return (
        <div>
            <h1>Greetings</h1>
            <Hello name="George" />
            <Hello name="Daisy" />
        </div>
    )
};
```
- Can be arbitrary number of props.
- Values can be "hard coded" strings or JS expression results.
- JS expressions must be wrapped in curly braces.
- Modify the `Hello` component so it uses two props:
```javascript
const Hello = (props) => {
    return (
        <div>
            <p>
                Hello {props.name}, you are {props.age} years old
            </p>
        </div>
    )
};

const App = () => {
    const name = 'Peter';
    const age = 10;

    return (
        <div>
            <h1>Greetings</h1>
            <Hello name="Maya" age={26 + 10} />
            <Hello name={name} age={age} />
        </div>
    )
};
```
- Props are sent by `App` component to the `Hello` component.
- These are literals, variables, and results of expressions.

## Some Notes
- React generates clear error messages.
- Console should always be open.
- If an error is encountered, fix it before proceeding.
- It's good to write `console.log()` commands.
- React component names must be capitalized.
- React component needs one root element.
    - We get an error if we define a component without an outermost, root element.
- Using a root element is not the only way.
    - An array of components is also valid (ugly).
    - Use `fragments` by wrapping returned elements by empty elements.
```javascript
const App = () => {
    const name = "Peter";
    const age = 10;

    return (
        <>
            <h1>Greetings</h1>
            <Hello name="Maya" age={26 + 10} />
            <Hello name={name} age={age} />
            <Footer />
        </>
    )
}
```