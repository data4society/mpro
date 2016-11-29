var b = require('substance-bundler')
var fs = require('fs')
var config = require('config')
var TEST ='.test/'

b.task('clean', function() {
  b.rm('./dist')
})

// copy assets
b.task('assets', function() {
  b.copy('node_modules/font-awesome', './dist/font-awesome')
})

// this optional task makes it easier to work on Substance core
b.task('substance', function() {
  b.make('substance', 'clean', 'browser', 'server')
  b.copy('node_modules/substance/dist', './dist/substance')
})

function buildMainApp(app) {
  return function() {
    b.copy('client/' + app + '/index.html', './dist/')
    b.copy('client/' + app + '/assets', './dist/assets/')
    b.css('./client/' + app + '/app.css', 'dist/mpro.css', {variables: true})
    b.css('./node_modules/substance/dist/substance-pagestyle.css', 'dist/mpro-pagestyle.css', {variables: true})
    b.css('./node_modules/substance/dist/substance-reset.css', 'dist/mpro-reset.css', {variables: true})
    b.js('client/' + app + '/app.js', {
      // need buble if we want to minify later
      buble: true,
      external: ['substance'],
      commonjs: { include: ['node_modules/lodash/**', 'node_modules/moment/moment.js'] },
      dest: './dist/app.js',
      format: 'umd',
      moduleName: app
    })
    b.custom('injecting config', {
      src: './dist/app.js',
      dest: './dist/mpro.js',
      execute: function(file) {
        const code = fs.readFileSync(file[0], 'utf8')
        const result = code.replace(/MPROCONFIG/g, JSON.stringify(config.get('app')))
        fs.writeFileSync(this.outputs[0], result, 'utf8')
      }      
    })
    b.copy('./dist/app.js.map', './dist/mpro.js.map')
    b.rm('./dist/app.js')
    b.rm('./dist/app.js.map')
  }
}

function buildApp(app) {
  return function() {
    b.copy('client/' + app + '/index.html', './dist/' + app + '/')
    b.copy('client/' + app + '/assets', './dist/' + app + '/assets/')
    b.css('./client/' + app + '/' + app + '.css', 'dist/' + app + '/' + app + '.css', {variables: true})
    // b.css('./node_modules/substance/dist/substance-pagestyle.css', 'dist/mpro-pagestyle.css', {variables: true})
    // b.css('./node_modules/substance/dist/substance-reset.css', 'dist/mpro-reset.css', {variables: true})
    b.js('client/' + app + '/' + app + '.js', {
      // need buble if we want to minify later
      buble: true,
      external: ['substance'],
      commonjs: { include: ['node_modules/lodash/**', 'node_modules/moment/moment.js'] },
      dest: './dist/' + app + '/' + app + '.js',
      format: 'umd',
      moduleName: app
    })
    b.rm('./dist/' + app + '/app.js')
    b.rm('./dist/' + app + '/app.js.map')
  }
}

b.task('client', ['clean', 'substance', 'assets'], buildMainApp('mpro'))
b.task('embed', buildApp('embed'))

// build all
b.task('default', ['client', 'embed'])

b.task('test:server', function() {
  // Cleanup
  b.rm(TEST)
  b.make('substance')

  // TODO: it would be nice to treat such glob patterns
  // differently, so that we do not need to specify glob root
  b.copy('./node_modules/substance-test/dist/*', TEST, { root: './node_modules/substance-test/dist' })
  b.copy('./test/**/*', TEST, { root: './test' })

  b.js('./test/index.js', {
    // buble necessary here, for nodejs
    buble: true,
    external: ['substance-test', 'substance'],
    commonjs: {
      include: [
        '/**/lodash/**',
        '/**/substance-cheerio/**'
      ]
    },
    targets: [
      { dest: TEST+'tests.cjs.js', format: 'cjs', sourceMapRoot: __dirname, sourceMapPrefix: 'test' }
    ]
  })
})

b.task('test', ['test:server'])

// starts a server when CLI argument '-s' is set
b.setServerPort(5001)
b.serve({
  static: true, route: '/', folder: 'dist'
})