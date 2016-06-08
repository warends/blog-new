// Gulpfile.js

'use strict';


var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint');

gulp.task('lint', function () {
  gulp.src(['public/app/**/*.js', 'app/**/*.js'])
    .pipe(jshint());
});

gulp.task('sass', function () {
  return gulp.src('public/css/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css/min'));
});

gulp.task('watch', function() {
  gulp.watch(['public/app/**/*.js', 'app/**/*.js'], ['lint']);
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
