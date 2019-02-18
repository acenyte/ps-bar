var gulp = require('gulp');
var replace = require('gulp-replace');

gulp.task('rebase-assets', function() {
  return gulp.src('dist/index.html')
    .pipe(replace(new RegExp(/(assets|\/assets|\.\.\/assets|\.\.\/\.\.\/assets)/g), '/psbar/themes/custom/psgrid/dist/assets'))
    .pipe(gulp.dest('dist/'))

    &&

    gulp.src('dist/main.js')
    .pipe(replace(new RegExp(/(assets|\/assets|\.\.\/assets|\.\.\/\.\.\/assets)/g), '/psbar/themes/custom/psgrid/dist/assets'))
    .pipe(gulp.dest('dist/'))

    &&

    gulp.src('dist/styles.css')
    .pipe(replace(new RegExp(/(assets|\/assets|\.\.\/assets|\.\.\/\.\.\/assets)/g), '/psbar/themes/custom/psgrid/dist/assets'))
    .pipe(gulp.dest('dist/'));
});


gulp.task('rebase-adrian', function() {
    return gulp.src('dist/index.html')
        .pipe(replace(new RegExp(/(assets|\/assets|\.\.\/assets|\.\.\/\.\.\/assets)/g), '/ps/ps-website-rollout-2018//themes/custom/psgrid/dist/assets/'))
        .pipe(gulp.dest('dist/'))

        &&

        gulp.src('dist/main.js')
        .pipe(replace(new RegExp(/(assets|\/assets|\.\.\/assets|\.\.\/\.\.\/assets)/g), '/ps/ps-website-rollout-2018//themes/custom/psgrid/dist/assets/'))
        .pipe(gulp.dest('dist/'))

        &&

        gulp.src('dist/styles.css')
        .pipe(replace(new RegExp(/(assets|\/assets|\.\.\/assets|\.\.\/\.\.\/assets)/g), '/ps/ps-website-rollout-2018//themes/custom/psgrid/dist/assets/'))
        .pipe(gulp.dest('dist/'));
  });

  gulp.task('rebase-brett', function() {
    return gulp.src('dist/index.html')
      .pipe(replace(new RegExp(/(assets|\/assets|\.\.\/assets|\.\.\/\.\.\/assets)/g), '/ps-app/ps-website-rollout-2018/themes/custom/psgrid/dist/assets'))
      .pipe(gulp.dest('dist/'))

      &&

      gulp.src('dist/main.js')
      .pipe(replace(new RegExp(/(assets|\/assets|\.\.\/assets|\.\.\/\.\.\/assets)/g), '/ps-app/ps-website-rollout-2018/themes/custom/psgrid/dist/assets'))
      .pipe(gulp.dest('dist/'))

      &&

      gulp.src('dist/styles.css')
      .pipe(replace(new RegExp(/(assets|\/assets|\.\.\/assets|\.\.\/\.\.\/assets)/g), '/ps-app/ps-website-rollout-2018/themes/custom/psgrid/dist/assets'))
      .pipe(gulp.dest('dist/'));
  });
