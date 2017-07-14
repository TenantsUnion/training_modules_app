var gulp = require('gulp');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var tap = require('gulp-tap');
var util = require('gulp-util');
var gulpif = require('gulp-if');
var source = require('vinyl-source-stream');
var rollup = require('rollup-stream');
var rollup_ts = require('rollup-plugin-typescript2');
var rollup_replace = require('rollup-plugin-replace');
var vinyl_buffer = require('vinyl-buffer');
var gulp_rename = require('gulp-rename');

const isProductionBuild = 'production' === process.env.NODE_ENV;


/************ Front End Web App ************/

gulp.task('webapp:app:clean', [], function(){
    return del([
        'webapp/build/app',
        'webapp/dist/app.min.js'
    ]);

});

var cache;
gulp.task('webapp:app:bundle-compile', ['webapp:app:clean'], function () {
    process.chdir('webapp');
    return rollup({
        entry: 'app/app.ts',
        sourceMap: !isProductionBuild,
        cache: cache,
        format: 'iife',
        globals: {
            vue: 'Vue',
            'vue-router': 'VueRouter',
            underscore: '_'
        },
        plugins: [
            rollup_replace({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }),
            rollup_ts({//loads tsconfig.json by default
                tsconfig: 'webapp/tsconfig.json',
                check: true,
                cacheRoot: ".rollupts2_cache",
                clean: false
            })
        ]
    }).on('bundle', function (bundle) {
        cache = bundle;
    })
        .pipe(source('app.js'))
        .pipe(gulp.dest('./build/app'))
        // buffer the output. most gulp plugins, including gulp-sourcemaps, don't support streams.
        .pipe(vinyl_buffer())
        .pipe(gulpif(!isProductionBuild, sourcemaps.init({loadMaps: true})))
        .pipe(uglify())
        .pipe(gulp_rename('app.min.js'))
        .pipe(gulpif(!isProductionBuild, sourcemaps.write()))
        .pipe(gulp.dest('./dist'));
});

gulp.task('webapp:clean:lib', [], function(){
   return del([
       'webapp/build/lib/js',
       'webapp/dist/lib.min.js'
   ]);
});

gulp.task('webapp:lib:js', ['webapp:clean:lib'], function () {
    return gulp.src([
        './node_modules/underscore/underscore.js',
        './node_modules/vue/dist/vue.js',
        './node_modules/vue-router/dist/vue-router.js'
    ])
        .pipe(gulp.dest('lib/js', {cwd: 'webapp/build'}))
        .pipe(gulpif(!isProductionBuild, sourcemaps.init()))
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('lib/js', {cwd: 'webapp/build'}))
        .pipe(uglify())
        .pipe(gulp_rename('lib.min.js'))
        .pipe(gulpif(!isProductionBuild, sourcemaps.write()))
        .pipe(gulp.dest('.', {cwd: 'webapp/dist'}));
});

gulp.task('default', ['webapp:lib:js', 'webapp:app:bundle-compile'], function(){});
