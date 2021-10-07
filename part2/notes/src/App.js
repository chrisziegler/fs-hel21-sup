import { useState, useEffect } from 'react';
import Note from './components/Note';
import noteService from './services/notes';

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16,
  };
  return (
    <div style={footerStyle}>
      <br />
      <em>
        Note app, Department of Computer Science, University of
        Helsinki 2021
      </em>
    </div>
  );
};

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    // console.log('effect');
    noteService.getAll().then(initialNotes => {
      // console.log('response fulfilled');
      setNotes(initialNotes);
    });
  }, []);

  const addNote = async event => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    };
    let returnedNote = await noteService.create(noteObject);
    setNotes(notes.concat(returnedNote));
    setNewNote('');
  };

  const handleChange = ({ target }) => setNewNote(target.value);

  const toggleImportanceOf = async id => {
    const note = notes.find(n => n.id === id);
    const changedNote = {
      ...note,
      important: !note.important,
    };
    try {
      let returnedNote = await noteService.update(
        id,
        changedNote,
      );
      setNotes(
        notes.map(note =>
          note.id !== id ? note : returnedNote,
        ),
      );
    } catch (err) {
      setErrorMessage(
        `Note '${note.content}' was already removed from server`,
      );
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <ul>
        {notesToShow.map(note => (
          <Note
            key={note.id}
            note={note}
            toggleImportanceOf={toggleImportanceOf}
          />
        ))}
      </ul>
      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all'}
      </button>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
