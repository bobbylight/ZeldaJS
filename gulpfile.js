(function() {
   'use strict';

   var gulp = require('gulp');
   var debug = require('gulp-debug');
   var del = require('del');
   var runSequence = require('run-sequence');
   var usemin = require('gulp-usemin');
   var uglify = require('gulp-uglify');
   var concatCss = require('gulp-concat-css');
   var cssmin = require('gulp-cssmin');
   var rev = require('gulp-rev');
   var tsc = require('gulp-typescript');
   var tsconfig = tsc.createProject('tsconfig.json');
   var sourcemaps = require('gulp-sourcemaps');
   var tslint = require('gulp-tslint');
   var replace = require('gulp-replace');
   var dateFormat = require('dateformat');

   gulp.task('clean', function() {
      return del([
         './dist'
      ]);
   });

   gulp.task('usemin', function() {
      return gulp.src([ 'src/index.html' ])
         .pipe(debug({ title: 'File going through usemin: ' }))
         .pipe(usemin({
            css: [ rev ],
            js: [ uglify, rev ],
            inlinejs: [ uglify ]
            //, html: [ minifyHtml({ empty: true }) ]
         }))
         .pipe(replace('<%=build.date%>',
            dateFormat(new Date(), 'dddd, mmmm dS, yyyy, h:MM:ss TT')))
         .pipe(gulp.dest('dist/'));
   });

   gulp.task('cssmin', function() {
      gulp.src('src/css/all.css')
         .pipe(concatCss('all.css'))
         .pipe(cssmin())
         .pipe(gulp.dest('dist/css/'));
   });

   gulp.task('compile-ts', function() {
        var tsResult = gulp.src([ 'src/app/**/*.ts', 'bower_components/gtp/dist-all/gtp-all.d.ts' ])
            .pipe(sourcemaps.init())
            .pipe(tsc(tsconfig));
        tsResult.dts.pipe(gulp.dest('src/js/'));
        return tsResult.js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('src/js/'));
   });
   gulp.task('tslint', function() {
    return gulp.src([ 'src/app/**/*.ts' ])
        .pipe(tslint())
        .pipe(tslint.report('prose'));
   });

   gulp.task('copy-non-minified-files', function() {
      return gulp.src([ 'src/**', 'src/.htaccess', '!src/css/**', '!src/js/**', '!src/{app,app/**}', '!src/index.html' ])
         .pipe(gulp.dest('dist/'));
   });

   gulp.task('default', function() {
      runSequence('tslint', 'clean', 'compile-ts', 'usemin', 'cssmin', 'copy-non-minified-files');
   });

   gulp.task('watch', function() {
      gulp.watch('src/app/**/*.ts', [ 'tslint', 'compile-ts' ]);
   });

})();
