import { useState } from 'react';

const Blog = ({ blog, user, handleLike, handleRemove }) => {
    const [showDetails, setShowDetails] = useState(false);

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    };

    const viewHandler = () => {
        setShowDetails(!showDetails);
    };

    const hideWhenShown = { display: showDetails ? 'none' : '' };
    const showWhenShown = { display: showDetails ? '' : 'none' };
    const showIfAuthor = { display: blog.user.username === user.username ? '' : 'none' };

    return (
        <div>
            <div style={hideWhenShown}>
                <div className='contents' style={blogStyle}>
                    {blog.title} {blog.author} <button onClick={viewHandler}>view</button>
                </div>
            </div>
            <div style={showWhenShown}>
                <div style={blogStyle}>
                    <div>{blog.title} <button onClick={viewHandler}>hide</button></div>
                    <div>{blog.url}</div>
                    <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>
                    <div>{blog.author}</div>
                    <div><button style={showIfAuthor} onClick={handleRemove}>Remove</button></div>
                </div>
            </div>
        </div>
    );
};

export default Blog;