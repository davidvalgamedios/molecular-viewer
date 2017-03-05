const gulp = require('gulp');
const sass = require('gulp-sass');

const concat = require('gulp-concat');
const del = require('del');

const tsc = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
var tsProject = tsc.createProject('./tsconfig.json');

const ngc = require('gulp-ngc');
const ngcConfig = './tsconfig-aot.json';

var run = require('gulp-run');

var gulpSequence = require('run-sequence');

var uglify = require('gulp-uglify');

const paths = {
    fullBuildJs: [
        "dist/vendor/zone.min.js",
        "dist/vendor/Reflect.js",
        "dist/js/site-all.js"
    ],
    sass:[
        './sass/*.scss'
    ],
    devJs:[
        './site/main.ts',
        './site/app.module.ts',
        './site/**/*.ts'
    ]
};


//OLD BUILD
/*
gulp.task('browserify', function () {
    var bundleStream = browserify('./build/main.js').bundle();

    return bundleStream
        .pipe(source('./build/main.js'))
        .pipe(streamify(rename('full-build.js')))
        .pipe(gulp.dest('./build'));
});

gulp.task('minify', function() {
    return gulp.src('./build/full-build.js')
        .pipe(uglify())
        .pipe(rename('site-all.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('mergeVendor', function(){
   return gulp.src(paths.vendorJs)
       .pipe(concat('site-all.js'))
       .pipe(gulp.dest('dist/js'));
});*/

gulp.task('tsc', function () {
    return tsProject.src()
        .pipe(tsc(tscConfig.compilerOptions))
        .pipe(gulp.dest('./build'));
});

gulp.task('cleanJs', function () {
    return del('aot/*');
});

gulp.task('ngc', function () {
    return ngc(ngcConfig);
});

gulp.task('rollup', function () {
    return run('node_modules/.bin/rollup -c rollup-config.js').exec();
});


gulp.task('sass', function () {
    return gulp
        .src(paths.sass)
        .pipe(concat('site.css'))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('sassDev', function () {
    return gulp
        .src(paths.sass)
        .pipe(concat('site-dev.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('makeConcat', function(){
   return gulp
       .src(paths.fullBuildJs)
       .pipe(concat('site-bundle.js'))
       .pipe(uglify())
       .pipe(gulp.dest('./dist/js'))
});




gulp.task('buildJs', function() {
    gulpSequence('cleanJs', 'ngc', 'rollup', 'makeConcat');
});


gulp.task('watch', function(){
    gulp.watch(paths.sass, ['sassDev']);
    gulp.watch(paths.devJs, ['tsc'])
});


gulp.task('buildAll', ['buildJs', 'sass']);