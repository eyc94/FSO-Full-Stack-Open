import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteForm from './NoteForm';

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

test('renders no shit', () => {
    const note = {
        content: 'This is a reminder',
        important: true
    };

    render(<Note note={note} />);

    const element = screen.queryByText('do not want this shit to be rendered');
    expect(element).toBeNull();
});