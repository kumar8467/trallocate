var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');

gulp.task('browserify', function() {
    gulp.src('assets/src/js/main.js')
      .pipe(browserify({transform: 'reactify'}))
      .pipe(concat('main.js'))
      .pipe(gulp.dest('assets/dist/js'));
});

gulp.task('copy', function() {
    gulp.src('assets/src/index.html')
      .pipe(gulp.dest('assets/dist'));
    gulp.src('assets/src/styles/*.css')
      .pipe(gulp.dest('assets/dist/styles'));
});

gulp.task('watch', function() {
    gulp.watch('assets/src/**/*.*', ['default']);
});

gulp.task('default',['browserify', 'copy', 'watch']);