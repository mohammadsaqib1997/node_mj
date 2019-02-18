const {
  Nuxt,
  Builder
} = require('nuxt')

const secret = require("./config").secret
const app = require('express')()
// const server = require('http').Server(app)
const port_http = 3000
// const port_https = 443
const path = require('path');
// const fs = require('fs')
const http = require('http')
// const https = require('https')

// const credentials = {
// 	key: fs.readFileSync(__dirname+'/./ssl/key.key'),
// 	cert: fs.readFileSync(__dirname+'/./ssl/cert.crt'),
// 	ca: fs.readFileSync(__dirname+'/./ssl/bundle.ca-bundle')
// };

// const httpsServer = https.createServer(credentials, app)
const httpServer = http.createServer(app)

// here enable ssl and proxy
// app.enable("trust proxy");
// app.use(function (req, res, next) {
//     if (req.secure) {
//         return next();
//     }
//     res.redirect('https://' + req.headers.host + req.url);
// });

app.disable('x-powered-by')

const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const io = require('socket.io')(httpServer)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

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
// server.listen(port, () => console.log('Start Nuxt Project!'))
httpServer.listen(port_http, () => {
  console.log('HTTP Server running on port ' + port_http);
});

// httpsServer.listen(port_https, () => {
// 	console.log('HTTPS Server running on port 443');
// });

let client_connected = {}

io.on('connection', function (socket) {
  client_connected[socket.id] = {}
  client_connected[socket.id].token = signedToken(socket.id)
  client_connected[socket.id].interval = setInterval(() => {
    jwt.verify(client_connected[socket.id].token, secret, function (err, decoded) {
      if (err) {
        if (err.name === "TokenExpiredError") {
          client_connected[socket.id].token = signedToken(socket.id)
          socket.emit("token", {
            token: client_connected[socket.id].token
          })
        } else {
          socket.emit("token", {
            error: err
          })
        }
      } else {
        socket.emit("token", {
          token: client_connected[socket.id].token
        })
      }
    });
  }, 300000) // 5 mins
  socket.emit("token", {
    token: client_connected[socket.id].token
  })

  socket.on('disconnect', function () {
    clearInterval(client_connected[socket.id].interval)
    delete client_connected[socket.id]
  });
})

function signedToken(data) {
  let token = jwt.sign({
    data: data
  }, secret, {
    expiresIn: "5 minutes"
  })
  return token
}