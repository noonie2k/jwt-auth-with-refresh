const bodyParser = require('body-parser')
const express    = require('express')
const expressJWT = require('express-jwt')
const jwt        = require('jsonwebtoken')
const moment     = require('moment')
const path       = require('path')

let app = express()
app.use(bodyParser.json())

const cors = require(path.join(__dirname, 'config', 'cors.js'))
app.use(cors)

app.set('JWT_SECRET', 'F2AA449CDD544FA2AD185882441AC')
app.use(expressJWT({ secret: app.get('JWT_SECRET') }).unless({
  path: [
    { url: /\/api\/v1\/user\/.+/,       methods: ['POST'] },
    { url: '/api/v1/auth',              methods: ['POST'] },
    { url: '/api/v1/data/unrestricted', methods: ['GET'] }
  ]
}))

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.sendStatus(401)
  }
})

/**
 * Database
 */
const nedb = require('nedb')
const userDb = new nedb({ filename: path.join(__dirname, 'data', 'user.db'), autoload: true })

require(path.join(__dirname, 'routes', 'api.js'))(app, userDb)

app.listen(8081, () => {
  console.log('Listening on 8081')
})
