import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationSuccess, setnotificationSuccess] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");

      setNotificationMessage("Login successful");
      setnotificationSuccess(true);
    } catch (exception) {
      setNotificationMessage("Wrong credentials");
      setnotificationSuccess(false);
    } finally {
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }
  };

  const logout = async (event) => {
    setNotificationMessage("Logout successful");
    setnotificationSuccess(true);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
    window.localStorage.removeItem("loggedUser");
  };

  const blogList = () => {
    return (
      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    );
  };

  const logoutButton = () => {
    return (
      <form onSubmit={logout}>
        <button type="submit">Logout</button>
      </form>
    );
  };

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        setNotificationMessage("Blog created");
        setnotificationSuccess(true);
      })
      .catch((exception) => {
        setNotificationMessage(exception.response.data.error);
        setnotificationSuccess(false);
      })
      .finally(() => {
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      });
  };

  return (
    <>
      <Notification
        message={notificationMessage}
        success={notificationSuccess}
      />

      {user === null ? (
        <>
          <Togglable buttonLabel="Login">
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          </Togglable>
        </>
      ) : (
        <div>
          <h1>Blogs</h1>

          <div>
            <p>
              <b>Logged user</b>: {user.name}
            </p>
            {logoutButton()}
          </div>

          <br />
          <Togglable buttonLabel="Create new Blog">
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <br />
          {blogList()}
        </div>
      )}
    </>
  );
};
export default App;
