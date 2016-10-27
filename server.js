const express    = require('express')
const bodyParser = require('body-parser')
const jwt        = require('jsonwebtoken')
const expressJWT = require('express-jwt')
const moment     = require('moment')

let app = express()
app.use(bodyParser.json())

const corsAllowAll = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  res.header('Access-Control-Expose-Headers', 'X-Access-Token,X-Refresh-Token')

  next()
}
app.use(corsAllowAll)

const JWT_SECRET = 'F2AA449CDD544FA2AD185882441AC'
app.use(expressJWT({ secret: JWT_SECRET }).unless({ path: ['/api/v1/auth', '/api/v1/unrestricted'] }))
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.sendStatus(401)
  }
})

app.post('/api/v1/auth', (req, res) => {
  if (req.body.username === 'noonie2k' && req.body.password === 'abc123') {
    let accessToken = jwt.sign(
      { username: req.body.username },
      JWT_SECRET,
      { expiresIn: moment().add(10, 'minutes').unix() }
    )

    let refreshToken = jwt.sign(
      { username: req.body.username },
      JWT_SECRET,
      { expiresIn: moment().add(14, 'days').unix() }
    )

    res.set('X-Access-Token', accessToken)
    res.set('X-Refresh-Token', refreshToken)
    res.sendStatus(204)
  } else {
    res.sendStatus(401)
  }
})

app.post('/api/v1/refresh', (req, res) => {
  let accessToken = jwt.sign(
    { username: req.body.username },
    JWT_SECRET,
    { expiresIn: moment().add(10, 'minutes').unix() }
  )

  let refreshToken = jwt.sign(
    { username: req.body.username },
    JWT_SECRET,
    { expiresIn: moment().add(14, 'days').unix() }
  )

  res.set('X-Access-Token', accessToken)
  res.set('X-Refresh-Token', refreshToken)
  res.sendStatus(204)
})

app.get('/api/v1/unrestricted', (req, res) => {
  res.json({ data: 'unrestricted' })
})

app.get('/api/v1/restricted', (req, res) => {
  res.json({ data: 'restricted' })
})

app.listen(8081, () => {
  console.log('Listening on 8081')
})
