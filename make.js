var b = require('substance-bundler');

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

// starts a server when CLI argument '-s' is set
b.setServerPort(5001)
b.serve({
  static: true, route: '/', folder: 'dist'
});