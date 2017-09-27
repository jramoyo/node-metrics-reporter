const gulp = require('gulp')
const run = require('gulp-run-command').default
const util = require('gulp-util')

const yargs = require('yargs')
const nyc = (ignoreErrors = false) => {
  const grep = yargs.argv.grep || ''
  return run(`nyc mocha test/app/**/*.ts --grep "${grep}" --colors`, { ignoreErrors: ignoreErrors })()
}

gulp.task('test', ['compile'], () => { nyc() })

gulp.task('tdd', ['test'], () => {
  gulp.watch(['src/**/*.ts', 'test/**/*.ts'], () => { util.log('running tests...'); nyc(true) })
})
