const gulp = require('gulp')
const debug = require('gulp-debug')
const size = require('gulp-size')
const tslint = require('gulp-tslint')
const ts = require('gulp-typescript')

const del = require('del')
const merge = require('merge2')
const yargs = require('yargs')

const tsProject = ts.createProject('tsconfig.json')

gulp.task('lint', () => {
  const emitError = yargs.argv['strict-lint'] || false
  const fix = yargs.argv['fix-lint'] || false
  return gulp.src(['src/**/*.ts', 'test/**/*.ts'])
        .pipe(tslint({ formatter: 'stylish', fix: fix }))
        .pipe(tslint.report({
          emitError: emitError,
          summarizeFailureOutput: true
        }))
})

gulp.task('compile', ['lint'], (done) => {
  del(['dist/**']).then(() => {
    let tsResult = gulp.src('src/app/**/*.ts')
          .pipe(tsProject())
          .on('error', (err) => { throw err })

    return merge([
      tsResult.dts.pipe(debug({ title: 'ts' }))
              .pipe(gulp.dest('dist'))
              .pipe(size({ title: 'compile' })),

      tsResult.js.pipe(debug({ title: 'ts' }))
              .pipe(gulp.dest('dist'))
              .pipe(size({ title: 'compile' }))
    ])
    .resume()
    .on('end', done)
  })
})

gulp.task('watch', ['compile'], () => {
  gulp.watch(['src/app/**/*.ts'], ['compile'])
})
