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


## Tests For The Togglable Component
- Write few tests for `Togglable` component.
- Add `togglableContent` CSS classname to div that returns the child components:
```javascript
const Togglable = forwardRef((props, ref) => {
    // ...

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>
                    {props.buttonLabel}
                </button>
            </div>
            <div style={showWhenVisible} className="togglableContent">
                {props.children}
                <button onClick={toggleVisibility}>cancel</button>
            </div>
        </div>
    );
});
```
- The tests are shown below:
```javascript
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Togglable from './Togglable';

describe('<Togglable />', () => {
    let container;

    beforeEach(() => {
        container = render(
            <Togglable buttonLabel="show...">
                <div className="testDiv">
                    togglable content
                </div>
            </Togglable>
        ).container;
    });

    test('renders its children', () => {
        screen.findAllByText('togglable content');
    });

    test('at start the children are not displayed', () => {
        const div = container.querySelector('.togglableContent');
        expect(div).toHaveStyle('display: none');
    });

    test('after clicking button, children are displayed', () => {
        const button = screen.getByText('show...');
        userEvent.click(button);

        const div = container.querySelector('.togglableContent');
        expect(div).not.toHaveStyle('display: none');
    });
});
```
- The `beforeEach` function gets called before each test.
    - Renders the `Togglable` component.
    - Saves the field `container` of the return value.
- The first test verifies `Togglable` component renders its child component.
- Remaining tests use `toHaveStyle` method to see if child component is visible or not.
    - This is done by checking the style of div is `{ display: 'none' }`.
    - Other test checks when button is pressed the component is visible.
- Add a test to check if visible content can be hidden by clicking the second button of component:
```javascript
describe('<Togglable />', () => {
    
    // ...

    test('toggled content can be closed', () => {
        const button = screen.getByText('show...');
        userEvent.click(button);

        const closeButton = screen.getByText('cancel');
        userEvent.click(closeButton);

        const div = container.querySelector('.togglableContent');
        expect(div).toHaveStyle('display: none');
    });
});
```


## Testing The Forms
- We have used the `click` method of `user-event` to click buttons.
```javascript
const button = screen.getByText('show...');
userEvent.click(button);
```
- Simulate text input with `userEvent`.
- Make test for `NoteForm` component.
    - Code for component is as follows:
```javascript
import { useState } from 'react';

const NoteForm = ({ createNote }) => {
    const [newNote, setNewNote] = useState('');

    const handleChange = (event) => {
        setNewNote(event.target.value);
    };

    const addNote = (event) => {
        event.preventDefault();
        createNote({
            content: newNote,
            important: Math.random() > 0.5
        });

        setNewNote('');
    };

    return (
        <div className="formDiv">
            <h2>Create a new note</h2>

            <form onSubmit={addNote}>
                <input
                    value={newNote}
                    onChange={handleChange}
                />
                <button type="submit">save</button>
            </form>
        </div>
    );
};

export default NoteForm;
```
- Form works by calling `createNote` function received as prop.
- Test is as follows:
```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NoteForm from './NoteForm';
import userEvent from '@testing-library/user-event';

test('<NoteForm /> updates parent state and calls onSubmit', () => {
    const createNote = jest.fn();

    render(<NoteForm createNote={createNote} />);

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByText('save');

    userEvent.type(input, 'testing a form...');
    userEvent.click(sendButton);

    expect(createNote.mock.calls).toHaveLength(1);
    expect(createNote.mock.calls[0][0].content).toBe('testing a form...');
});
```
- Tests gets access to input field by using `getByRole`.
- The method `type` of `userEvent` is used to write text to input field.
- First test ensures that submitting form calls `createNote`.
- The second expectation checks to see if event handler is called with correct parameters.
    - Note with correct content is created when form is filled.


## About Finding The Elements
- Assume form would have two input fields:
```javascript
const NoteForm = ({ createNote }) => {
    // ...

    return (
        <div className="formDiv">
            <h2>Create a new note</h2>

            <form onSubmit={addNote}>
                <input
                    value={newNote}
                    onChange={handleChange}
                />
                <input
                    value={...}
                    onChange={...}
                />
                <button type="submit">save</button>
            </form>
        </div>
    );
};
```
- The regular approach to find input field causes an error.
```javascript
const input = screen.getByRole('textbox');
```
- Error message says there are multiple 'textbox's.
- Suggests to use `getAllByRole`.
```javascript
const input = screen.getAllByRole('textbox');

userEvent.type(input[0], 'testing a form...');
```
- `getAllByRole` returns an array.
- First input field is first element of array.
- Input fields usually have `placeholder` text to hint what kind of input.
- Add placeholder to form:
```javascript
const NoteForm = ({ createNote }) => {
    // ...

    return (
        <div className="formDiv">
            <h2>Create a new note</h2>

            <form onSubmit={addNote}>
                <input
                    value={newNote}
                    onChange={handleChange}
                    placeholder='write here note content'
                />
                <input
                    value={...}
                    onChange={...}
                />
                <button type="submit">save</button>
            </form>
        </div>
    );
};
```
- Finding the right input field is easy with `getByPlaceholderText`.
```javascript
test('<NoteForm /> updates parent state and calls onSubmit', () => {
    const createNote = jest.fn();

    render(<NoteForm createNote={createNote} />);

    const input = screen.getByPlaceholderText('write here note content');
    const sendButton = screen.getByText('save');

    userEvent.type(input, 'testing a form...');
    userEvent.click(sendButton);

    expect(createNote.mock.calls).toHaveLength(1);
    expect(createNote.mock.calls[0][0].content).toBe('testing a form...');
});
```
- Flexible way to find elements in tests is `querySelector` of `content` object.
    - `content` object returned by `render`.
    - Any CSS selector can be used to search elements in tests.
- Consider that we add a unique `id` to input field:
```javascript
const NoteForm = ({ createNote }) => {
    // ...

    return (
        <div className="formDiv">
            <h2>Create a new note</h2>

            <form onSubmit={addNote}>
                <input
                    value={newNote}
                    onChange={handleChange}
                    id='note-input'
                />
                <input
                    value={...}
                    onChange={...}
                />
                <button type="submit">save</button>
            </form>
        </div>
    );
};
```
- Input element can be found:
```javascript
const { content } = render(<NoteForm createNote={createNote} />);
const input = content.querySelector('#note-input');
```
- We will just stick with `getByPlaceholderText`.
- Look at some details.
    - Assume a component render test to an HTML element like so:
```javascript
const Note = ({ note, toggleImportance }) => {
    const label = note.important
        ? 'make not important' : 'make important';

    return (
        <li className='note'>
            Your awesome note: {note.content}
            <button onClick={toggleImportance}>{label}</button>
        </li>
    );
};

export default Note;
```
- `getByText` command that the test uses does not find the element.
```javascript
test('renders content', () => {
    const note = {
        content: 'Does not work anymore :(',
        important: true
    };

    render(<Note note={note} />);

    const element = screen.getByText('Does not work anymore :(');

    expect(element).toBeDefined();
});
```
- `getByText` looks for element that has exactly the text that is the parameter.
- If we want to look for element that `contains` text, use extra option:
```javascript
const element = screen.getByText(
    'Does not work anymore :(', { exact: false }
);
```
- Or use `findByText`:
```javascript
const element = await screen.findByText('Does not work anymore :(');
```
- The `findByText` returns a promise!
- Situations where `queryByText` is useful.
- Command returns element but does not cause exception if no element is found.
- Can use command to ensure that something is *not rendered* to component:
```javascript
test('renders no shit', () => {
    const note = {
        content: 'This is a reminder',
        important: true
    };

    render(<Note note={note} />);

    const element = screen.queryByText('do not want this shit to be rendered');
    expect(element).toBeNull();
});
```


## Test Coverage
- Find out `coverage` of tests by running command:
```
CI=true npm test -- --coverage
```
- Primitive HTML report shows to the `coverage/lcov-report` folder.
- Report tells us lines of untested code in each component.


