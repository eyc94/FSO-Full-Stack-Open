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

## Arrays
- Examples:
```javascript
const t = [1, -1, 3];

t.push(5);

console.log(t.length);  // 4 is printed.
console.log(t[1]);      // -1 is printed.

t.forEach(value => {
    console.log(value); // Numbers 1, -1, 3, 5 are printed, each to its own line.
})
```
- Contents can be modified although array is defined as `const`.
- Variable points to the same object array.
- Contents of array changes.
- Iterate through items of array using `forEach`.
- `forEach` receives a function defined using the array syntax as a parameter.
- `forEach` calls the function for each item in the array.
    - Passes the item as an argument to the function.
- The `push` method adds new items to array.
- In React, techniques from functional programming is used.
    - Use immutable data structures.
    - In React, it is preferable to use the method `concat` which creates a new array with the old array and new item included.
```javascript
const t = [1, -1, 3];

const t2 = t.concat(5);

console.log(t);     // [1, -1, 3] is printed.
console.log(t2);    // [1, -1, 3, 5] is printed.
```
- Using `concat` above creates a new array with the old array values and the new item to be added.
- There is also a method called `map`.
```javascript
const t = [1, 2, 3];

const m1 = t.map(value => value * 2);
console.log(m1);    // [2, 4, 6] is printed.
```
- `map` creates a new array by using the function that is passed to it.
- This function creates the new values of the new array by passing in it each value of the old array.
- In the case above, the new array has the old array values multiplied by 2.
- Another example of what `map` can do:
```javascript
const m2 = t.map(value => '<li>' + value + '</li>');
console.log(m2);
// [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ] is printed.
```
- New array is old array transformed to contain HTML strings with old strings.
- Items of an array can be assigned to variables with the `destructuring assignment`.
```javascript
const t = [1, 2, 3, 4, 5];
const [first, second, ...rest] = t;

console.log(first, second); // 1, 2 is printed.
console.log(rest);          // [3, 4, 5] is printed.
```
- `first` and `second` gets first two integers.
- `rest` gets the rest of the numbers collected as an array.