module.exports = {
  dev: (process.env.NODE_ENV !== 'production'),
  head: {
    title: 'MJ SUPREME',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'Nuxt.js project'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.png'},
      {rel: 'stylesheet', href: '/fontawesome/css/fontawesome-all.min.css'}
    ],
    script: [
      /* Here is add static url please remove it '/~mjsupreme/' */
      {src: '/js/jquery-3.3.1.min.js'}
    ]
  },
  plugins: ['~/plugins/s-vue-validator.js', '~/plugins/vue-map.js'],
  modules: [
    ['nuxt-buefy', {
      defaultIconPack: 'fas',
      materialDesignIcons: false
    }]
  ],
  build: {
    vendors: ['babel-polyfill'],
    extend (config, { isClient }) {
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
  mode: "spa"
}
