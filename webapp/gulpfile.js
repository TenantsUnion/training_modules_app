const del = require('del');
const gulp = require('gulp');
const tap = require('gulp-tap');
const util = require('gulp-util');
const gulpif = require('gulp-if');
const gulp_rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const vinyl_source = require('vinyl-source-stream');
const vinyl_buffer = require('vinyl-buffer');
const rollup_stream = require('rollup-stream');
const rollup_ts = require('rollup-plugin-typescript2');
const rollup_replace = require('rollup-plugin-replace');
const browserSync = require('browser-sync');

const ts = require('gulp-typescript');

const isProductionBuild = 'production' === process.env.NODE_ENV;

gulp.task('watch', ['lib:js', 'build'], function () {
    browserSync.init({
        proxy: 'localhost:3000',
        open: 'external',
        port: 8000
    });
    gulp.watch('views/index.hbs', browserSync.reload);
    gulp.watch('src/app/**/*.ts', ['build']);
    gulp.watch('dist/app.min.js').on('change', function (event) {
        if (event.type !== 'deleted') {
            browserSync.reload();
        }
    });
});

gulp.task('clean', [], function () {
    return del([
        'build/app',
        'dist/app.min.js'
    ]);
});

var cache;
gulp.task('build', ['clean'], function () {
    return rollup_stream({
        entry: 'src/app/app.ts',
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
                include: 'src/app/**/*.ts',
                check: true,
                cacheRoot: ".rollupts2_cache",
                clean: false
            })
        ]
    }).on('bundle', function (bundle) {
        cache = bundle;
    })
        .pipe(vinyl_source('app.js'))
        .pipe(gulp.dest('build/app'))
        // buffer the output. most gulp plugins, including gulp-sourcemaps, don't support streams.
        .pipe(vinyl_buffer())
        .pipe(gulpif(!isProductionBuild, sourcemaps.init({loadMaps: true})))
        .pipe(uglify())
        .pipe(gulp_rename('app.min.js'))
        .pipe(gulpif(!isProductionBuild, sourcemaps.write()))
        .pipe(gulp.dest('dist'));
});

gulp.task('lib:clean', [], function () {
    return del([
        'build/lib/js',
        'dist/lib.min.js'
    ]);
});

gulp.task('lib:js', ['lib:clean'], function () {
    return gulp.src([
        '../node_modules/underscore/underscore.js',
        '../node_modules/vue/dist/vue.js',
        '../node_modules/vue-router/dist/vue-router.js',
        '../node_modules/axios/dist/axios.js'
    ])
        .pipe(gulp.dest('lib/js', {cwd: 'build'}))
        .pipe(gulpif(!isProductionBuild, sourcemaps.init()))
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('lib/js', {cwd: 'build'}))
        .pipe(uglify())
        .pipe(gulp_rename('lib.min.js'))
        .pipe(gulpif(!isProductionBuild, sourcemaps.write()))
        .pipe(gulp.dest('.', {cwd: 'dist'}));
});
