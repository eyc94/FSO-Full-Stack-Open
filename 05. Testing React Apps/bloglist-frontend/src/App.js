import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [message, setMessage] = useState(null);
    const [messageState, setMessageState] = useState('error');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        blogService.getAll().then(blogs => {
            setBlogs(blogs);
        });
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    const addBlog = (blogObject) => {
        blogService
            .create(blogObject)
            .then(returnedBlog => {
                setBlogs(blogs.concat(returnedBlog));
                setMessage(`a new blog: ${returnedBlog.title} by added ${returnedBlog.author}`);
                setTimeout(() => {
                    setMessage(null);
                }, 5000);
                setMessageState('success');
            });
    };

    const blogForm = () => (
        <Togglable buttonLabel="create new blog">
            <BlogForm createBlog={addBlog} />
        </Togglable>
    );

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const user = await loginService.login({
                username, password
            });

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            );
            blogService.setToken(user.token);
            setUser(user);
        } catch (exception) {
            setMessage(`Wrong username or password`);
            setTimeout(() => {
                setMessage(null);
            }, 5000);
            setMessageState('error');
        }
        setUsername('');
        setPassword('');
    };

    const loginForm = () => (
        <div>
            <h2>Log In To The Application</h2>
            <Notification message={message} result={messageState} />
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );

    const userLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser');
        setUser(null);
    };

    const handleLike = async (blog) => {
        const likedBlog = await blogService.like(blog);
        setBlogs(
            blogs.map(blog =>
                blog.id === likedBlog.id
                    ? { ...blog, likes: likedBlog.likes }
                    : blog
            )
        );
    };

    const removeBlog = async (blogToDelete) => {
        try {
            if (window.confirm(`Remove blog: ${blogToDelete.title} by ${blogToDelete.author}?`)) {
                blogService
                    .remove(blogToDelete.id)
                setMessage(`Blog: ${blogToDelete.title} was removed`);
                setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id));
                setMessageState('success');
                setTimeout(() => {
                    setMessage(null);
                }, 5000);
            }

        } catch (Exception) {
            setMessageState(`Cannot delete blog: ${blogToDelete.title}`);
            setMessageState('error');
            setTimeout(() => {
                setMessage(null);
            }, 5000);
        }
    };

    return (
        <div>
            {user === null ?
                loginForm() :
                <div>
                    <h2>Blogs</h2>
                    <Notification message={message} result={messageState} />
                    <p>{user.name} logged in
                        <button onClick={userLogout}>Logout</button>
                    </p>
                    {blogForm()}
                    {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
                        <Blog key={blog.id} blog={blog} handleLike={() => handleLike(blog)} handleRemove={() => removeBlog(blog)} />
                    )}
                </div>
            }
        </div>
    );
};

export default App;