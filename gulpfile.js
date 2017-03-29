// Gulpfile.js

'use strict';

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    clean = require('gulp-clean'),
    gutil = require('gulp-util'),
    vendor = require('gulp-concat-vendor');


gulp.task('js', function () {
  gulp.src([
      'public/app/app.js',
      '!public/app/**/*.spec.js',
      'public/app/**/*.js'
    ])
    .pipe(sourcemaps.init())
      .pipe(concat('main.min.js'))
      .pipe(jshint())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/dist/js'))
});

gulp.task('prod', function () {
  gulp.src(['public/dist/js/main.min.js'])
      .pipe(uglify())
    .pipe(gulp.dest('public/dist/js'))
});

gulp.task('vendor', function () {
  gulp.src(['public/vendor/*'])
    .pipe(sourcemaps.init())
      .pipe(vendor('vendor.min.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/dist/js'))
    .on('error', gutil.log);
});

gulp.task('clean', function () {
  return gulp.src('public/dist/js', {read: false})
    .pipe(clean());
});

gulp.task('sass', function () {
  return gulp.src('public/css/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('public/dist/styles'));
});

gulp.task('watch', function() {
  gulp.watch(['public/app/**/*.js', 'app/**/*.js'], ['js']);
  gulp.watch('public/css/scss/**/*.scss', ['sass']);
});

gulp.task('serve', ['watch'], function () {
  nodemon({
    script: 'server.js',
    ext: 'html js scss'
  })
  .on('restart', function () {
      console.log('gulp restarted!');
    });
});
