import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();

    createBlog({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h2>Create a new Blog</h2>

      <form onSubmit={addBlog}>
        <label>Title: </label>
        <input
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        ></input>
        <br />
        <label>Author: </label>
        <input
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        ></input>
        <br />
        <label>URL: </label>
        <input
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        ></input>
        <br />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default BlogForm;
