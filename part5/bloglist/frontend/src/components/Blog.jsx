import Togglable from './Togglable'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      {blog.title}
      <Togglable buttonLabel="view">
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}{' '}
            <button onClick={() => handleLike(blog.id)}>like</button>
          </p>
          <p>{blog.author}</p>

          {blog.user.username === user.username ? (
            <button onClick={() => handleDelete(blog.id)}>remove</button>
          ) : (
            <></>
          )}
        </div>
      </Togglable>
    </div>
  )
}

export default Blog
