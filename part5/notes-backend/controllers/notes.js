const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

notesRouter.get('/', async (request, response) => {
  try {
    const notes = await Note.find({}).populate('user', {
      username: 1,
      name: 1,
    })

    response.json(notes)
  } catch (exception) {
    console.log(exception)
  }
})

notesRouter.get('/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // instead of userId from request.body, we're providing our schema
  // with the users id found on the token, so refs still work
  const user = await User.findById(decodedToken.id)

  // Unique validator incorrecttly flags reference object id in another collection as not unique
  // https://github.com/blakehaswell/mongoose-unique-validator/issues/131 - m-u-v@3.0.0 issue adding notes
  // until fixed - need to unplug unique from schema for adding notes with refs
  // added 'MongoError' to errorHandler express middleware

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id,
  })

  try {
    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(savedNote)
  } catch (exception) {
    next(exception)
  }
})

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

notesRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body
    const note = {
      content: body.content,
      important: body.important,
    }
    const updatedNote = await Note.findByIdAndUpdate(
      request.params.id,
      note,
      {
        new: true,
      },
    )
    response.json(updatedNote)
  } catch (exception) {
    next(exception)
  }
})

module.exports = notesRouter
