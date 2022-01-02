# Node.js and Express
- Shift focus to backend.
    - Implement functionality on server side of stack.
- Build backend on top of `NodeJS`.
    - `NodeJS` is a JS runtime based on Google's `Chrome V8` JS engine.
- Browsers don't 100% support new JS features, so code running in browser must be *transpiled* with `babel`.
    - Different with JS running in backend.
    - Newest version of Node supports a lot of the new features of JS.
- Goal is to implement backend that works with notes application from Part 2.
- Start by creating a "hello world" application.
- We do NOT use `create-react-app` to initialize this project.
- The npm was mentioned in Part 2.
    - Tool for managing JS packages.
- Go to a directory of your choice.
    - Create new template for app with `npm init`.
    - Answer questions.
    - Result generates a `package.json` file at the root of project.
    - This contains information about the project.
```json
{
    "name": "backend",
    "version": "0.0.1",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "EC",
    "license": "MIT"
}
```
- The entry point is `index.js`.
- Make a change to the `scripts` object:
```json
{
    // ...
    "scripts": {
        "start": "node index.js",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    // ...
}
```
- Create first version of app by adding `index.js` file to the root.
```javascript
console.log('hello world');
```
- Run program directly with Node:
```
node index.js
```
- Or run as `npm script`:
```
npm start
```
- The `start` script works because of what we defined in `package.json`
- More customary to run tasks using npm scripts.
- We see the default `npm test` script.
    - Project does not have testing library, so `npm test` just executes the command listed as the value of "test".

