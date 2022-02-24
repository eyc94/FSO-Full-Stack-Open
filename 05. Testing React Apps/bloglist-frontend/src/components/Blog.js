import { useState } from 'react';

const Blog = ({ blog }) => {
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

    return (
        <div>
            <div style={hideWhenShown}>
                <div style={blogStyle}>
                    {blog.title} {blog.author} <button onClick={viewHandler}>view</button>
                </div>
            </div>
            <div style={showWhenShown}>
                <div style={blogStyle}>
                    <div>{blog.title} <button onClick={viewHandler}>hide</button></div>
                    <div>{blog.url}</div>
                    <div>likes {blog.likes} <button>like</button></div>
                    <div>{blog.author}</div>
                </div>
            </div>
        </div>
    );
};

export default Blog;