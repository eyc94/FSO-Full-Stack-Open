# JavaScript

- Need to learn JS.
- Newest version is ECMAScript 2021 or ES12.
- Not all new JS version features are supported.
    - Needs to be transpiled to a lower JS version.
    - Most popular way is `Babel`.
    - Automatic in React apps created using `create-react-app`.
- `Node.js` is a JS runtime environment.
- Latest versions of Node already know latest versions of JS, so no transpilation needed.
- To run JS files with Node:
```
node <name_of_file>.js
```
- Can write JS code in Node console by typing `node`.

## Variables
- Few ways to define variables.
```javascript
const x = 1;
let y = 5;

console.log(x, y);  // 1, 5 are printed.
y += 10;
console.log(x, y);  // 1, 15 are printed.
y = 'sometext';
console.log(x, y);  // 1, sometext are printed.
x = 4;              // Causes an error.
```
- `const` defines a constant that cannot be changed in the program.
- `let` defines a normal variable.
- We can define variables using `var`.
- Use of `var` is ill-advised here and we should stick with `let` and `const`.
- For more information, see below:
    - Medium - Javascript variables; should you use let, var or const?: `https://medium.com/podiihq/javascript-variables-should-you-use-let-var-or-const-394f7645c88f`
    - ES6, var vs let: `https://www.jstips.co/en/javascript/keyword-var-vs-let/`
    - YouTube video: `https://www.youtube.com/watch?v=sjyJBL5fkp8`