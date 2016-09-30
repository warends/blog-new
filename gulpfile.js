// Gulpfile.js

'use strict';


var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');


gulp.task('js', function () {
  gulp.src(['public/app.js', 'public/app/**/*.js'])
    .pipe(jshint())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/dist'))
});

gulp.task('sass', function () {
  return gulp.src('public/css/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css/min'));
});

gulp.task('watch', function() {
  gulp.watch(['public/app/**/*.js', 'app/**/*.js'], ['js']);
  gulp.watch('public/css/scss/**/*.scss', ['sass']);
});

gulp.task('serve', ['watch'], function () {
  nodemon({
    script: 'server.js',
    ext: 'html js scss',
    tasks: ['sass'] })
  .on('restart', function () {
      console.log('restarted!');
    });
});
