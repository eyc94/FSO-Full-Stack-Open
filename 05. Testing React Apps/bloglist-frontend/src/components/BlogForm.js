const BlogForm = ({ onSubmit, title, author, url, handleTitleChange, handleAuthorChange, handleUrlChange }) => {
    return (
        <div>
            <h2>create new</h2>

            <form onSubmit={onSubmit}>
                <div>
                    title:
                    <input
                        type="text"
                        value={title}
                        name="Title"
                        onChange={handleTitleChange}
                    />
                </div>
                <div>
                    author:
                    <input
                        type="text"
                        value={author}
                        name="Author"
                        onChange={handleAuthorChange}
                    />
                </div>
                <div>
                    url:
                    <input
                        type="text"
                        value={url}
                        name="Url"
                        onChange={handleUrlChange}
                    />
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    )
};

export default BlogForm;