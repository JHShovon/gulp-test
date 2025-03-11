const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const nunjucksRender = require('gulp-nunjucks-render');
const browserSync = require('browser-sync').create();

// Compile SASS
gulp.task('sass', function () {
  return gulp.src('src/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.stream());
});

// Minify JS
gulp.task('js', function () {
  return gulp.src('src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'))
    .pipe(browserSync.stream());
});

// Render Nunjucks templates
gulp.task('nunjucks', function () {
  return gulp.src('src/templates/pages/*.njk')
    .pipe(nunjucksRender({
      path: ['src/templates']
    }))
    .pipe(gulp.dest('.'))
    .pipe(browserSync.stream());
});

// Start a local server with BrowserSync
gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: './',
      index: 'index.html'
    },
    port: 3000
  });

  gulp.watch('src/scss/*.scss', gulp.series('sass'));
  // gulp.watch('src/js/*.js', gulp.series('js'));
  gulp.watch('src/templates/**/*.njk', gulp.series('nunjucks'));
  gulp.watch('index.html').on('change', browserSync.reload);
});

// Default task
gulp.task('default', gulp.series('sass', 'nunjucks', 'serve'));
