'use strict';

var config       = require('../config');
var gulp         = require('gulp');
var uglify       = require('gulp-uglify');
var concatFiles  = require('gulp-concat');
var stripDebug   = require('gulp-strip-debug');

gulp.task('vendor', function () {
  gulp.src([
    'app/vendor/zoomcharts/zoomcharts.js' ])
    .pipe(stripDebug())
    .pipe(concatFiles('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js/'));
});