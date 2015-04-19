var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var react = require('gulp-react');

gulp.task('browserify', function() {
    gulp.src('assets/src/js/main.js')
      .pipe(browserify({transform: 'reactify'}))
      .pipe(concat('main.js'))
      .pipe(gulp.dest('assets/dist/js'));
});

gulp.task('react', function () {    
  gulp.src('assets/src/js/components/*.js')
    .pipe(react({harmony: true}))
    .pipe(gulp.dest('assets/dist/js/components/'));
});

gulp.task('copy', function() {
    gulp.src('assets/src/app.html')
      .pipe(gulp.dest('assets/dist'));
    gulp.src('assets/src/js/actions/*.js')
      .pipe(gulp.dest('assets/dist/js/actions/'));
    gulp.src('assets/src/js/constants/*.js')
      .pipe(gulp.dest('assets/dist/js/constants/'));
    gulp.src('assets/src/js/stores/*.js')
      .pipe(gulp.dest('assets/dist/js/stores/'));
    gulp.src('assets/src/js/dispatchers/*.js')
      .pipe(gulp.dest('assets/dist/js/dispatchers/'));
    gulp.src('assets/src/styles/*.css')
      .pipe(gulp.dest('assets/dist/styles'));
});

gulp.task('watch', function() {
    gulp.watch('assets/src/**/*.*', ['default']);
});

gulp.task('default',['browserify', 'copy', 'watch', 'react']);