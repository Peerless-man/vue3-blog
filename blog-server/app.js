#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require("./src/main.js")


/**
 * Get port from environment and store in Express.
 */
const { APP_PORT } = require("./src/config/config.default.js")
var port = normalizePort(APP_PORT || "3000")


/**
 * Create HTTP server.
 */


/**
 * Listen on provided port, on all network interfaces.
 */

app.listen(port, () => {
  console.log(`server is running on http://localhost:${APP_PORT || "3000"}`)
})
app.on("error", onError)
app.on("listening", onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error, ctx) {
  try {
    if (error.syscall !== "listen") {
      throw error
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges")
        process.exit(1)
        break
      case "EADDRINUSE":
        console.error(bind + " is already in use")
        process.exit(1)
        break
      default:
        throw error
    }
  } catch (error) {
    console.error(error)
  }


}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address()
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port
  debug("Listening on " + bind)
}
