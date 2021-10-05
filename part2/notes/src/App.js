import { useState, useEffect } from 'react';
import Note from './components/Note';
import noteService from './services/notes';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);

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
    const changedNote = { ...note, important: !note.important };

    let returnedNote = await noteService.update(id, changedNote);
    setNotes(
      notes.map(note => (note.id !== id ? note : returnedNote)),
    );
  };

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important);

  return (
    <div>
      <h1>Notes</h1>
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
    </div>
  );
};

export default App;
