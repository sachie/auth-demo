'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var eslint = require('gulp-eslint');
var source = require('vinyl-source-stream');
var clean = require('gulp-clean');
var livereload = require('gulp-livereload');

var input = './public/';
var output = './.build/';

// Task for checking code lint.
gulp.task('lint', () => 
  gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

// Task for cleaning up the output folder.
gulp.task('clean', () => 
  gulp.src(output + '*', {
    read: false
  }).pipe(clean())
);

// Task to build views.
gulp.task('views', () => {
  gulp.src(input + 'index.html')
    .pipe(gulp.dest(output));
  gulp.src(input + 'views/*')
    .pipe(gulp.dest(output + 'views/'))
    .pipe(livereload());
});

// Task to build scripts.
gulp.task('browserify', () => 
  browserify(input + 'app/app.js')
    .bundle()
    .pipe(source('js/main.js'))
    .pipe(gulp.dest(output))
    .pipe(livereload())
);

// Watch task for files that should be built on updates.
// Also starts the livereload server.
gulp.task('watch', [], () => {
  livereload.listen();
  gulp.watch([input + 'app/*.js', input + 'app/**/*.js'], ['browserify']);
  gulp.watch([input + 'index.html', input + 'views/*'], ['views']);
});

gulp.task('build', ['browserify', 'views', 'clean']);

gulp.task('dev', ['lint', 'watch']);

gulp.task('default', ['lint', 'build']);