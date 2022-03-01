# Testing React Apps
- Many ways to test React apps.
- Still using `Jest` testing library.
    - Configured by default to apps created with `create-react-app`.
- Need another testing library that helps render components.
    - This is `react-testing-library`.
- Install it:
```
npm install --save-dev @testing-library/react @testing-library/jest-dom
```
- Also installed `jest-dom`.
    - Provides Jest-related helper methods.
- Write tests for the component responsible for rendering a note:
```javascript
const Note = ({ note, toggleImportance }) => {
    const label = note.important
        ? 'make not important'
        : 'make important';

    return (
        <li className='note'>
            {note.content}
            <button onClick={toggleImportance}>{label}</button>
        </li>
    );
};
```
- The `li` element has CSS classname `note`.
    - This is used to access the component in our tests.


## Rendering The Component For Tests
- Write test in `src/components/Note.test.js` file.
    - Same directory as the component itself.
- The first test verifies the component renders the contents of the note.
```javascript
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Note from './Note';

test('renders content', () => {
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
    };

    render(<Note note={note} />);

    const element = screen.getByText('Component testing is done with react-testing-library');
    expect(element).toBeDefined();
});
```
- After initial config, test renders the component with `render` function provided by react-testing-library.
- Normally, React components are rendered to DOM.
    - The `render` method renders components in a test suitable format without render to DOM.
- Use the `screen` object to access rendered component.
    - Use the `screen` object's method `getByText` to search for an element that has the content and makes sure it exists.


## Running Tests
- Using `create-react-app` configures tests to be run in watch mode by default.
    - `npm test` command does not exist once test is finished.
    - It waits for changes to be made to the code.
    - Tests auto execute after changes are made to code.
    - Then the cycle repeats.
- If you want tests to run normally, use this:
```
CI=true npm test
```
- Console may issue warning if Watchman is not installed.
    - Developed by Facebook.
    - Watches for changes made to files.
    - Speeds up execution of tests.


## Test File Location
- Two conventions for test file location.
- Right now, we created test files according to current standard.
    - Place in same location as component being tested.
- Other convention is to store in separate directory.


## Searching For Content In A Component
- The react-testing-library package offers many ways to see content of component being tested.
- Don't really need the `expect` test in our file.
```javascript
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Note from './Note';

test('renders content', () => {
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
    };

    render(<Note note={note} />);

    const element = screen.getByText('Component testing is done with react-testing-library');
    expect(element).toBeDefined();
});
```
- The test fails if `getByText` does not find the element it is looking for.
- Can use `CSS-selectors` to find rendered elements by using method `querySelector` of object `container`.
    - `container` is a field returned by render.
```javascript
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Note from './Note';

test('renders content', () => {
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
    };

    const { container } = render(<Note note ={note} />);

    const div = container.querySelector('.note');
    expect(div).toHaveTextContent(
        'Component testing is done with react-testing-library'
    );
});
```
- There are other methods like `getByTestId`.
    - Looks for elements based on id-attributes inserted for testing.


## Debugging Tests
- We run into problems when writing tests.
- The object `screen` has the method `debug` which is used to print HTML of a component to terminal.
- Changing the test as follows:
```javascript
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Note from './Note';

test('renders content', () => {
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
    };

    render(<Note note={note} />);

    screen.debug();

    // ...
});
```
- The HTML gets printed to console.
```javascript
console.log
    <body>
        <div>
            <li class="note">
                Component testing is done with react-testing-library
                <button>
                    make not important
                </button>
            </li>
        </div>
    </body>
```
- Can use same method to print a wanted element to console:
```javascript
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Note from './Note';

test('renders content', () => {
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
    };

    render(<Note note={note} />);

    const element = screen.getByText('Component testing is done with react-testing-library');

    screen.debug(element);

    expect(element).toBeDefined();
});
```
- Now HTML of wanted element is printed:
```javascript
<li class="note">
    Component testing is done with react-testing-library
    <button>
        make not important
    </button>
</li>
```


## Clicking Buttons In Tests
- The `Note` component also makes sure that when the button is pressed, the `toggleImportance` event handler is called.
- Install the library `user-event`.
    - Simulate user input.
```
npm install --save-dev @testing-library/user-event
```
- There is a mismatch between version of a dependency `jest-watch-typeahead` that `create-react-app` and `user-event` uses.
    - Problem fixed by installing specific version:
```
npm install -D --exact jest-watch-typeahead@0.6.5
```
- Testing functionality is done like so:
```javascript
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Note from './Note';

// ...

test('clicking the button calls event handler once', async () => {
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
    };

    const mockHandler = jest.fn();

    render(
        <Note note={note} toggleImportance={mockHandler} />
    );

    const button = screen.getByText('make not important');
    userEvent.click(button);

    expect(mockHandler.mock.calls).toHaveLength(1);
});
```
- Event handler is a `mock` function defined with Jest.
- Test finds button based on text from rendered component.
    - Then clicks element.
    - Clicking happens with `click` method of `userEvent` library.
- The expectation is that the mock function is called exactly once.
- Mock objects and functions are used for replacing dependencies of components tested.
    - Mocks make it possible to return hardcoded responses.
    - Mock verifies number of times mock functions are called and with what parameters.
- Mock is used to see if called method gets called exactly once.


