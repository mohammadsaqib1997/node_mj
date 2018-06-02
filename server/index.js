const { Nuxt, Builder } = require('nuxt')

const app = require('express')()
const port = process.env.PORT || 3000

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
app.listen(port, () => console.log('Start Nuxt Project!'))
