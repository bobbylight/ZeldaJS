(function() {
    'use strict';

    var gulp = require('gulp');
    var debug = require('gulp-debug');
    var livereload = require('gulp-livereload');
    var del = require('del');
    var merge2 = require('merge2');
    var runSequence = require('run-sequence');
    var usemin = require('gulp-usemin');
    var uglify = require('gulp-uglify');
    var concatCss = require('gulp-concat-css');
    var cssnano = require('gulp-cssnano');
    var rev = require('gulp-rev');
    var tsc = require('gulp-typescript');
    var tsconfig = tsc.createProject('tsconfig.json');
    var sourcemaps = require('gulp-sourcemaps');
    var tslint = require('gulp-tslint');
    var replace = require('gulp-replace');
    var dateFormat = require('dateformat');
    var typedoc = require('gulp-typedoc');

    gulp.task('clean', function() {
        return del([
            './dist'
        ]);
    });

    gulp.task('doc', function() {
        return gulp.src([ 'src/app/**/*.ts', 'bower_components/gtp/dist-all/gtp-all.d.ts' ])
            .pipe(typedoc({
                mode: 'file',
                target: 'es5',
                out: 'doc/',
                name: 'Zelda'
            }));
    });

    gulp.task('usemin', function() {
        return gulp.src([ 'src/index.html', 'src/editor.html' ])
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
        return merge2(
            gulp.src('src/css/all.css')
                .pipe(concatCss('all.css'))
                .pipe(cssnano())
                .pipe(gulp.dest('dist/css/')),
            gulp.src('src/css/editor.css')
                .pipe(concatCss('editor.css'))
                .pipe(cssnano())
                .pipe(gulp.dest('dist/css/'))
        );
    });

    gulp.task('compile-ts', function() {
        gulp.src([ 'src/app/**/*.html' ])
            .pipe(gulp.dest('src/js/'));
        var tsResult = gulp.src([ 'src/app/**/*.ts', 'bower_components/gtp/dist-all/gtp-all.d.ts' ])
            .pipe(sourcemaps.init())
            .pipe(tsc(tsconfig));
        tsResult.dts.pipe(gulp.dest('src/js/'));
        return tsResult.js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('src/js/'))
            .pipe(livereload({ quiet: true }));
    });
    gulp.task('tslint', function() {
        return gulp.src([ 'src/app/**/*.ts', '!src/app/typings/**' ])
            .pipe(tslint())
            .pipe(tslint.report('prose'));
    });

    gulp.task('copy-non-minified-files', function() {
        // It was tricky here to get the relative paths preserved...
        return gulp.src([ 'src/.htaccess', 'src/img/**', 'src/js/zelda/editor/templates/**', 'src/res/**' ])
            .pipe(gulp.dest(function(file) {
                return file.base.replace(/([\\/])src([\\/])/, '$1dist$2');
            }));
    });

    gulp.task('default', function() {
        runSequence('tslint', 'clean', 'compile-ts', 'usemin', 'cssmin', 'copy-non-minified-files');
    });

    gulp.task('watch', [ 'tslint', 'compile-ts' ], function() {
        livereload.listen();
        gulp.watch([ 'src/app/**/*.ts', 'src/app/**/*.html'], [ 'tslint', 'compile-ts' ]);
    });

})();
