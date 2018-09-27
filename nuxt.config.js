const config = require('./server/config')

module.exports = {
  dev: (process.env.NODE_ENV !== 'production'),
  loading: '~/components/loadingComp.vue',
  head: {
    title: 'MJ SUPREME',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'stylesheet', href: '/fontawesome/css/all.min.css' }
    ],
    script: [
      { src: '/js/jquery-3.3.1.min.js' },
    ]
  },
  plugins: [
    '~/plugins/s-vue-validator.js',
    '~/plugins/vue-map.js',
    { src: '~/plugins/route-chg.js', ssr: false },
    { src: '~/plugins/axios.js', ssr: false }
  ],
  modules: [
    '@nuxtjs/axios',
    ['nuxt-buefy', {
      defaultIconPack: 'fas',
      materialDesignIcons: false
    }]
  ],
  axios: {
    baseURL: (config.dev) ? 'http://127.0.0.1:3000' : 'http://144.208.75.78:3000'
  },
  router: {
    scrollBehavior: function (to, from, savedPosition) {
      return { x: 0, y: 0 }
    }
  },
  build: {
    vendors: ['babel-polyfill'],
    extend(config, { isClient }) {
      if (!isClient) {
        config.externals.splice(0, 0, function (context, request, callback) {
          if (/^vue2-google-maps($|\/)/.test(request)) {
            callback(null, false)
          } else {
            callback()
          }
        })
      }
    }
  },
  //mode: "spa"
}
