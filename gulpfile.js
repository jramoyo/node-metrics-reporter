const gulp = require('gulp')
const del = require('del')

require('./gulp-tasks/clean')
require('./gulp-tasks/compile')
require('./gulp-tasks/test')

gulp.task('default', ['compile' ])
