'use strict';

var config       = require('../config');
var gulp         = require('gulp');
var uglify       = require('gulp-uglify');
var concatFiles  = require('gulp-concat');
var stripDebug   = require('gulp-strip-debug');

gulp.task('vendor', function () {
  gulp.src([
    'app/vendor/zoomcharts/assets/base.css',
    'app/vendor/zoomcharts/assets/netchart.css'
  ]).pipe(gulp.dest('build/'));

  gulp.src([
    'app/vendor/zoomcharts/assets/netchart-sprite.png',
    'app/vendor/zoomcharts/assets/sprite.png',
    'app/vendor/zoomcharts/assets/vertical-resizer.png',
    'app/vendor/zoomcharts/assets/ajax_loader_blue_48.gif'
  ]).pipe(gulp.dest('build/'));

  gulp.src([
    'app/vendor/zoomcharts/zoomcharts.js' ])
    .pipe(stripDebug())
    .pipe(concatFiles('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js/'));
});