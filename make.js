var b = require('substance-bundler')
var TEST ='.test/'

b.task('clean', function() {
  b.rm('./dist')
})

// copy assets
b.task('assets', function() {
  b.copy('packages/**/*.css', './dist/')
  b.copy('node_modules/font-awesome', './dist/font-awesome')
})

// this optional task makes it easier to work on Substance core
b.task('substance', function() {
  b.make('substance', 'clean', 'browser', 'server')
  b.copy('node_modules/substance/dist', './dist/substance')
})

function buildApp(app) {
  return function() {
    b.copy('client/index.html', './dist/')
    //b.copy('client/assets', './dist/assets/')
    b.copy('client/*.css', './dist/', { root: 'client' })
    b.js('client/app.js', {
      // need buble if we want to minify later
      // buble: true,
      external: ['substance'],
      commonjs: { include: ['node_modules/lodash/**', 'node_modules/moment/moment.js'] },
      dest: './dist/app.js',
      format: 'umd',
      moduleName: app
    })
  }
}

b.task('publisher', ['clean', 'substance', 'assets'], buildApp('publisher'))

b.task('client', ['publisher'])

// build all
b.task('default', ['client'])

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