const { Nuxt, Builder } = require('nuxt')

const secret = require("./config").secret
const app = require('express')()
const server = require('http').Server(app)
const port = process.env.PORT || 3000
var path = require('path');

app.disable('x-powered-by')

const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const io = require('socket.io')(server)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const apis = require('./apis')
app.use('/api', apis)


// We instantiate Nuxt.js with the options
let config = require('../nuxt.config.js')
const nuxt = new Nuxt(config)
app.use(nuxt.render)

if (config.dev) {
  new Builder(nuxt).build()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

// Listen the server
server.listen(port, () => console.log('Start Nuxt Project!'))

let client_connected = {}

io.on('connection', function (socket) {
  client_connected[socket.id] = {}
  client_connected[socket.id].token = signedToken(socket.id)
  client_connected[socket.id].interval = setInterval(() => {
    jwt.verify(client_connected[socket.id].token, secret, function (err, decoded) {
      if (err) {
        if (err.name === "TokenExpiredError") {
          client_connected[socket.id].token = signedToken(socket.id)
          socket.emit("token", { token: client_connected[socket.id].token })
        } else {
          socket.emit("token", { error: err })
        }
      } else {
        socket.emit("token", { token: client_connected[socket.id].token })
      }
    });
  }, 300000) // 5 mins
  socket.emit("token", { token: client_connected[socket.id].token })

  socket.on('disconnect', function () {
    clearInterval(client_connected[socket.id].interval)
    delete client_connected[socket.id]
  });
})

function signedToken (data) {
  let token = jwt.sign({
    data: data
  }, secret, {
      expiresIn: "5 minutes"
    })
  return token
}
