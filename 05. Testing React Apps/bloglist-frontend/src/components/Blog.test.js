import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Blog from './Blog';

const blog = {
    title: 'Blog title',
    author: 'Tony Stark',
    url: 'www.google.com',
    likes: 320,
    user: {
        username: 'ironman123',
        name: 'Tony',
        id: '6206d6f239e4c035239dfafb'
    },
    id: '620969325b0c796aab281bd1'
};

const user = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imlyb25tYW4xMjMiLCJpZCI6IjYyMDZkNmYyMzllNGMwMzUyMzlkZmFmYiIsImlhdCI6MTY0NTY0ODc2MH0.Rw1L5Cu-jE_saG0NpkHEcYqCKvKlQu5KqtI6bz0lP04',
    username: 'ironman123',
    name: 'Tony'
};

test('renders content', () => {
    const { container } = render(<Blog blog={blog} user={user} />);

    const div = container.querySelector('.contents');
    expect(div).toHaveTextContent(`${blog.title} ${blog.author}`);
});