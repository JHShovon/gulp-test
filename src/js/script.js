const fs = require('fs');

gulp.task('js', function (done) {
  if (!fs.existsSync('src/js/')) {
    console.warn("⚠️ Warning: 'src/js/' directory is missing. Skipping JS task.");
    return done();
  }

  return gulp.src('src/js/**/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify().on('error', function (err) {
      console.error('JS Error:', err.message);
      this.emit('end');
    }))
    .pipe(gulp.dest('assets/js'))
    .pipe(browserSync.stream());
});
