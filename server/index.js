const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const _ = require('lodash')
/**
 * Route
 */
const config = require('../nuxt.config.js')
const router = require('./router')

// Import and Set Nuxt.js options
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }
  app.use(express.static('static'))
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  // Give nuxt middleware to express
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(function(req, res, next) {
    if (req.cookies.access_token) {
      req.headers.authorization = `Bearer ${req.cookies.access_token}`
    }
    next()
  })
  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
  app.use('/', router)
  app.use(function(err, req, res, next) {
    if (_.includes([404, 403, 401, 500], err.status)) {
      res.status(err.status)
      res.render('' + err.status, { error: err })
      return ''
    } else {
      res.status(404)
      res.render('404', { error: err })
    }
  })
  app.use(function(err, req, res, next) {
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.status(err.status || 500)
    res.render('500', { error: err })
  })
  app.use(nuxt.render)
}

start()
