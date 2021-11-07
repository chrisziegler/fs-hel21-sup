import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const handleChange = event => {
    setNewNote(event.target.value)
  }

  const addNote = event => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: false,
    })

    setNewNote('')
  }

  return (
    <div className="formDiv">
      <h3>Create a new note</h3>

      <form onSubmit={addNote}>
        <input id="newnote" value={newNote} onChange={handleChange} />
        <button id="note-submit" type="submit">
          save
        </button>
      </form>
    </div>
  )
}

export default NoteForm
