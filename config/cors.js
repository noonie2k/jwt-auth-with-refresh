module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  res.header('Access-Control-Expose-Headers', 'X-Access-Token,X-Refresh-Token')

  next()
}
