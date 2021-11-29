import React from 'react'
import { connect } from 'react-redux'
import { createNote } from '../reducers/noteReducer'

const NewNote = props => {
  // note the difference, and that we don't call createNote directly
  // but rather use it in the shorthand version of mapDispatchToProps
  // this component did not need mapStateToProps
  // console.log(createNote)
  // console.log(props.createNote)
  const addNote = async event => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content)
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default connect(null, { createNote })(NewNote)
