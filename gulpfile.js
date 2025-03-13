const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const nunjucksRender = require('gulp-nunjucks-render');
const browserSync = require('browser-sync').create();

// Compile SASS with error handling
gulp.task('sass', function () {
  return gulp.src('src/scss/**/*.scss') // Watch all SCSS files
    .pipe(sass().on('error', function(err) {
      console.error('SASS Error:', err.message);
      this.emit('end');
    }))
    .pipe(cleanCSS())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.stream());
});

// Minify & Concat JS with error handling
gulp.task('js', function () {
  return gulp.src('src/js/**/*.js') // Watch all JS files
    .pipe(concat('main.js'))
    .pipe(uglify().on('error', function(err) {
      console.error('JS Error:', err.message);
      this.emit('end');
    }))
    .pipe(gulp.dest('assets/js'))
    .pipe(browserSync.stream());
});

// Render Nunjucks Templates
gulp.task('nunjucks', function () {
  return gulp.src('src/templates/pages/**/*.njk') // Watch all .njk files
    .pipe(nunjucksRender({ path: ['src/templates'] }))
    .on('error', function(err) {
      console.error('Nunjucks Error:', err.message);
      this.emit('end');
    })
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());
});

// Start BrowserSync Server
gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: './',
      index: 'index.html'
    },
    port: 3000
  });

  console.log('✅ BrowserSync is running at http://localhost:3000');
});

// Watch Task
gulp.task('watch', function () {
  gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('src/js/**/*.js', gulp.series('js'));
  gulp.watch('src/templates/**/*.njk', gulp.series('nunjucks'));
  gulp.watch('index.html').on('change', browserSync.reload);
});

// Default Task (Runs everything)
gulp.task('default', gulp.series('sass', 'js', 'nunjucks', gulp.parallel('serve', 'watch')));
