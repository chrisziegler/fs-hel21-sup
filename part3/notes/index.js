const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

// const app = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' })
//   res.end('Hello from server')
// })

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false,
  },
  {
    id: 3,
    content:
      'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true,
  },
]
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// })

// The Root Route
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// The Index Route
app.get('/api/notes', (request, response) => {
  response.json(notes)
})

// The Show Route
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  //note variable set to 'undefined if no matching note found
  if (note) {
    response.json(note)
  } else {
    //override the default http error code "reason-phrase"
    response.statusMessage = 'Requested note resource does not exist'
    response
      .status(404)
      .json({ error: 'Requested note resource does not exist' })
  }
})
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
  return maxId + 1
}

// The Post Route
app.post('/api/notes', (request, response) => {
  const { body } = request

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const note = {
    id: generateId(),
    content: body.content,
    date: new Date().toISOString(),
    important: body.important || false,
  }

  notes = notes.concat(note)
  response.json(note)
})

// The Destroy Route
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
const unkownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unkownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
