var gulp = require('gulp');
var embedTemplates = require('gulp-angular-embed-templates');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


gulp.task('default', ['js']);

gulp.task('js', function () {
    return gulp.src([
        'src/**/*.module.js',
        'src/**/*.js'])
        .pipe(embedTemplates())
        .pipe(concat('ng-server-validation.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('./dist'));
});