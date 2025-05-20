import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationSuccess, setnotificationSuccess] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setNotificationMessage('Login successful')
      setnotificationSuccess(true)
    } catch (exception) {
      setNotificationMessage('Wrong credentials')
      setnotificationSuccess(false)
    } finally {
        setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const logout = async (event) => {
    setNotificationMessage('Logout successful')
    setnotificationSuccess(true)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
    window.localStorage.removeItem('loggedUser')
  }

  const loginForm = () => {
    return (
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
        <button type="submit">login</button>
      </form>
    )
  }

  const blogList = () => {
    return <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  }

  const logoutButton = () => {
    return (
      <form onSubmit={logout}>
        <button type="submit">Logout</button>
      </form>
    )
  }

  const createNewBlog = async (event) => {
    event.preventDefault()

    try {
      const resp = await blogService.create({
        'title': newBlogTitle,
        'author': newBlogAuthor,
        'url': newBlogUrl
      })

      setBlogs(blogs => [...blogs, resp]);
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')

      setNotificationMessage('Blog created')
      setnotificationSuccess(true)
    } catch (exception) {
      console.log(exception)
      setNotificationMessage(exception.response.data.error)
      setnotificationSuccess(false)
    } finally {
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const createNewBlogForm = () => {
    return (
      <form onSubmit={createNewBlog}>
        <label>Title: </label>
        <input type="text" value={newBlogTitle} onChange={({ target }) => setNewBlogTitle(target.value)}></input><br />
        <label>Author: </label>
        <input type="text" value={newBlogAuthor} onChange={({ target }) => setNewBlogAuthor(target.value)}></input><br />
        <label>URL: </label>
        <input type="text" value={newBlogUrl} onChange={({ target }) => setNewBlogUrl(target.value)}></input><br />
        <button type="submit">Create</button>
      </form>
    )
  }

  return (
    <>
      <Notification message={notificationMessage} success={notificationSuccess} />

      {user === null ?
        <>
          <h1>Login</h1>
          {loginForm()}
        </> :
        <div>
          <h1>Blogs</h1>
          <div>
            <p>{user.name} logged-in</p>
            {logoutButton()}
          </div>
          <br />
          <div>
            {createNewBlogForm()}
          </div>
          <br />
          {blogList()}
        </div>
      }
    </>
  )
}
export default App