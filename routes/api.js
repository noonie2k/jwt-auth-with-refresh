const jwt    = require('jsonwebtoken')
const moment = require('moment')
const forge  = require('node-forge')

module.exports = (app, userDb) => {
  /**
   * User Routes
   */
  app.post('/api/v1/user/:username', (req, res) => {
    let digest = forge.md.sha256.create()

    const salt = forge.util.bytesToHex(forge.random.getBytesSync(32))
    const passwordHash = digest.update(salt + req.body.password).digest().toHex()

    const user = {
      username: req.params.username,
      password: passwordHash,
      salt:     salt
    }

    userDb.insert(user, (err, newDoc) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.sendStatus(201)
      }
    })
  })

  /**
   * Token Routes
   */
  app.post('/api/v1/auth', (req, res) => {
    userDb.findOne({ username: req.body.username }, (err, userDoc) => {
      if (userDoc) {
        let digest = forge.md.sha256.create()

        const attemptedPasswordHash = digest.update(userDoc.salt + req.body.password).digest().toHex()
        if (attemptedPasswordHash === userDoc.password) {
          // Issue a new, short-lived, Access Token
          res.set('X-Access-Token', jwt.sign(
            { username: req.body.username },
            app.get('JWT_SECRET'),
            { expiresIn: moment().add(10, 'minutes').unix() }
          ))

          // Issue a new refresh token
          res.set('X-Refresh-Token', jwt.sign(
            { username: req.body.username },
            app.get('JWT_SECRET'),
            { expiresIn: moment().add(14, 'days').unix() }
          ))

          res.sendStatus(204)
        } else {
          // User credentials could not be verified
          res.sendStatus(401)
        }
      } else {
        // User is not found
        res.sendStatus(401)
      }
    })
  })

  app.post('/api/v1/refresh', (req, res) => {
    // Issue a new, short-lived, Access Token in all cases
    res.set('X-Access-Token', jwt.sign(
      { username: req.body.username },
      app.get('JWT_SECRET'),
      { expiresIn: moment().add(10, 'minutes').unix() }
    ))

    res.sendStatus(204)
  })

  /**
   * Data Routes
   */
  app.get('/api/v1/data/unrestricted', (req, res) => {
    res.json({ data: 'unrestricted' })
  })

  app.get('/api/v1/data/restricted', (req, res) => {
    res.json({ data: 'restricted' })
  })
}
