'use strict';

const gulp = require('gulp');
const source = require('vinyl-source-stream');
const sequence = require('gulp-sequence');
const eslint = require('gulp-eslint');
const clean = require('gulp-clean');
const browserify = require('browserify');
const sass = require('gulp-sass');

const input = './public/';
const output = './.build/';

// Task for checking code lint.
gulp.task('lint', () => 
  gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

// Task for cleaning up the output folder.
gulp.task('clean', () => 
  gulp.src([output + '**/*', output + '*'], {
    read: false
  }).pipe(clean())
);

// Task to build views.
gulp.task('views', () => {
  gulp.src(input + 'index.html')
    .pipe(gulp.dest(output));
  gulp.src(input + 'views/*')
    .pipe(gulp.dest(output + 'views/'));
});

// Task to build scripts.
gulp.task('browserify', () => 
  browserify(input + 'app/app.js')
    .bundle()
    .pipe(source('js/main.js'))
    .pipe(gulp.dest(output))
);

// Task to build styles.
gulp.task('sass', () => gulp.src(input + 'styles/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest(output + '/css'))
);

// Watch task for files that should be built on updates.
// Also starts the livereload server.
gulp.task('watch', () => {
  gulp.watch([input + 'app/*.js', input + 'app/**/*.js'], ['browserify']);
  gulp.watch([input + 'index.html', input + 'views/*.html', input +
      'views/**/*.html'], ['views']);
  gulp.watch(input + 'styles/*', ['sass']);
});

gulp.task('build', sequence('clean', ['browserify', 'views', 'sass']));

gulp.task('dev', ['watch']);

gulp.task('default', sequence('lint', 'build'));