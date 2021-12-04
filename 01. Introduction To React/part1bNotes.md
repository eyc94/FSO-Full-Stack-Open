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

## Objects
- Different ways of defining JS objects.
- One way is using `object literals`.
    - List properties within braces.
```javascript
const object1 = {
    name: 'Arto Hellas',
    age: 35,
    education: 'PhD'
};

const object2 = {
    name: 'Full Stack web application development',
    level: 'intermediate studies',
    size: 5
};

const object3 = {
    name: {
        first: 'Dan',
        last: 'Abramov'
    },
    grades: [2, 3, 5, 3],
    department: 'Stanford University'
};
```
- Values of properties can be any type.
- Properties of objects are referenced using dot notation or brackets:
```javascript
console.log(object1.name);          // Arto Hellas is printed.
const fieldName = 'age';
console.log(object1[fieldName]);    // 35 is printed.
```
- Add properties to objects using dot notation or brackets.
```javascript
object1.address = 'Helsinki';
object['secret number'] = 12341;
```
- Latter property uses brackets because there is a space in the property.
- Objects can also have methods.
- In this course, we won't define objects with methods.
- Objects can be defined using constructor functions.

## Functions
- Complete way to define arrow functions:
```javascript
const sum = (p1, p2) => {
    console.log(p1);
    console.log(p2);
    return p1 + p2;
};

const result = sum(1, 5);
console.log(result);
```
- If there is just one parameter, remove parentheses:
```javascript
const square = p => {
    console.log(p);
    return p * p;
};
```
- If there is just one expression, remove braces.
```javascript
const square = p => p * p;
```
- Handy when manipulating arrays using `map` method.
```javascript
const t = [1, 2, 3];
const tSquared = t.map(p => p * p);
// tSquared is now [1, 4, 9].
```
- Prior to ES6, only way to define functions was with `function` keyword.
- Two ways to reference functions:
    - First is giving a name in a `function declaration`.
    - Second is using a `function expression`.
```javascript
// Function declaration.
function product(a, b) {
    return a * b;
}

const result = product(2, 6);
// result is now 12.

// Function expression.
const average = function(a, b) {
    return (a + b) / 2;
};

const result = average(2, 5);
```

## Object Methods and "this"
- No need to define objects with methods because we are using React Hooks.
- Arrow functions and functions defined using `function` behave differently when used with `this`.
- `this` refers to the object itself.
- Assign methods to objects:
```javascript
const arto = {
    name: 'Arto Hellas',
    age: 35,
    education: 'PhD',
    greet: function() {
        console.log('hello, my name is ' + this.name);
    }
};

arto.greet();   // "hello, my name is Arto Hellas" gets printed.
```
- Methods can be assigned to objects after creation of that object.
```javascript
const arto = {
    name: 'Arto Hellas',
    age: 35,
    education: 'PhD',
    greet: function() {
        console.log('hello, my name is ' + this.name);
    }
};

arto.growOlder = function() {
    this.age += 1;
};

console.log(arto.age);      // 35 is printed.
arto.growOlder();
console.log(arto.age);      // 36 is printed.
```
- Modify object slightly:
```javascript
const arto = {
    name: 'Arto Hellas',
    age: 35,
    education: 'PhD',
    greet: function() {
        console.log('hello, my name is ' + this.name);
    },
    doAddition: function(a, b) {
        console.log(a + b);
    }
};

arto.doAddition(1, 4);          // 5 is printed.

const referenceToAddition = arto.doAddition;
referenceToAddition(10, 15);    // 25 is printed.
```
- Can store a method reference in a variable and call the method that way.
- However, if we try to do the same with the greet function, there is an issue:
```javascript
arto.greet();           // "hello, my name is Arto Hellas" gets printed.

const referenceToGreet = arto.greet;
referenceToGreet();     // prints "hello, my name is undefined".
```
- When calling method through reference, method loses knowledge of original `this`.
- `this` is defined on *how* the method is called.
- When calling through reference, `this` becomes global object.
- We avoid this issue using `this-less` JS.
- Another situation where `this` disappears is below:
```javascript
const arto = {
    name: 'Arto Hellas',
    greet: function() {
        console.log('hello, my name is ' + this.name);
    }
};
```
- The method is called by the JS engine which makes `this` the global object.
- Can preserve the original `this` by using method called `bind`.
```javascript
setTimeout(arto.greet.bind(arto), 1000);
```

## Classes
- No class mechanism like OOP languages.
- Features to simulate classes is here.
- `class` syntax introduced with ES6.
- Define a `class` called Person:
```javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    };

    greet() {
        console.log('hello, my name is ' + this.name);
    }
};

const adam = new Person('Adam Ondra', 35);
adam.greet();

const janja = new Person('Janja Garnbret', 22);
janja.greet();
```
- Type of both objects is `Object`.
- JS defines only the types `Boolean`, `Null`, `Undefined`, `Number`, `String`, `Symbol`, `BigInt`, and `Object`.
- ES6 class syntax is used in old React and in Node.js.