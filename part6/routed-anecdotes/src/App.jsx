import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import About from "./components/About";
import Anecdote from "./components/Anecdote";
import AnecdoteList from "./components/AnecdoteList";
import CreateNew from "./components/CreateNew";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Notification from "./components/Notification";


const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: "If it hurts, do it more often",
      author: "Jez Humble",
      info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
      votes: 0,
      id: 1,
    },
    {
      content: "Premature optimization is the root of all evil",
      author: "Donald Knuth",
      info: "http://wiki.c2.com/?PrematureOptimization",
      votes: 0,
      id: 2,
    },
  ]);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationSuccess, setNotificationSuccess] = useState(false);
  const navigate = useNavigate();

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000);
    setAnecdotes(anecdotes.concat(anecdote));
    navigate("/");

    setNotificationMessage("Anecdote added");
    setNotificationSuccess(true);
    setTimeout(() => {
      setNotificationMessage("");
    }, 5000);
  };

  /*
  const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

  const vote = (id) => {
    const anecdote = anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
  };
  */

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />

      <Routes>
        <Route
          path="/anecdotes/:id"
          element={<Anecdote anecdotes={anecdotes} />}
        />
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path="/create" element={<CreateNew addNew={addNew} />} />
        <Route path="/about" element={<About />} />
      </Routes>

      {notificationMessage ? (
        <Notification
          message={notificationMessage}
          success={notificationSuccess}
        />
      ) : null}
      <Footer />
    </div>
  );
};

export default App;
