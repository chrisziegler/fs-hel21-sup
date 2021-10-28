const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  // passwordCorrect could indicate either username not being found, or
  // password being incorrect, or true for that username, in which case we
  // can issue them a token, bcrypt never run if no user found
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

  // for security reasons we never indicate which is invalid
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }
  // jwt uses an enviornment variable secret along with the username and id to create a token with digital signature

  // token expires in 60*60 seconds * 72, that is, in one day
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60 * 24,
  })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
