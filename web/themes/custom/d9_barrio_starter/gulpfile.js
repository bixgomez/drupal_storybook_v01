let gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    $ = require('gulp-load-plugins')(),
    cleanCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    postcss = require('gulp-postcss'),
    sasslint = require('gulp-sass-lint'),
    autoprefixer = require('autoprefixer'),
    notify = require('gulp-notify'),
    postcssInlineSvg = require('postcss-inline-svg'),
    browserSync = require('browser-sync').create(),
    // livereload  = require('gulp-livereload'),
    sassGlob = require('gulp-sass-glob'),
    pxtorem = require('postcss-pxtorem'),
    postcssProcessors = [
        postcssInlineSvg({
            removeFill: true,
            paths: ['./node_modules/bootstrap-icons/icons']
        }),
        pxtorem({
            propList: ['font', 'font-size', 'line-height', 'letter-spacing', '*margin*', '*padding*'],
            mediaQuery: true
        })
    ];

const paths = {
    scss: {
        src: './src/scss/style.scss',
        dest: './css',
        watch: './src/**/*.scss',
        bootstrap: './node_modules/bootstrap/scss/bootstrap.scss',
        components: './src/components/**/*.scss',
    },
    js: {
        bootstrap: './node_modules/bootstrap/dist/js/bootstrap.min.js',
        popper: './node_modules/@popperjs/core/dist/umd/popper.min.js',
        barrio: '../../contrib/bootstrap_barrio/js/barrio.js',
        dest: './js'
    }
}

// Compile sass into CSS & auto-inject into browsers
function styles() {
    return gulp.src([paths.scss.bootstrap, paths.scss.src])
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass({
            includePaths: [
                './node_modules/breakpoint-sass/stylesheets/',
                './node_modules/bootstrap/scss',
                '../../contrib/bootstrap_barrio/scss'
            ]
        }).on('error', sass.logError))
        .pipe($.postcss(postcssProcessors))
        .pipe(postcss([autoprefixer({
            browsers: [
                'Chrome >= 35',
                'Firefox >= 38',
                'Edge >= 12',
                'Explorer >= 10',
                'iOS >= 8',
                'Safari >= 8',
                'Android 2.3',
                'Android >= 4',
                'Opera >= 12']
        })]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.scss.dest))
        .pipe(cleanCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.scss.dest))
        // .pipe(stylesSassLint())
        // .pipe(livereload())
        .pipe(browserSync.stream())
}

// Move the javascript files into our js folder
function js() {
    return gulp.src([paths.js.bootstrap, paths.js.popper, paths.js.barrio])
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.stream())
}

// Init Sass linter.
function stylesSassLint() {
    return gulp.src('./src/**/*.s+(a|c)ss')
        .pipe(sasslint({
            options: {
                formatter: 'stylish',
                'merge-default-rules': true
            },
            files: {
                ignore: []
            },
            configFile: '.sass-lint.yml'
        }))
        .pipe(sasslint.format())
        .pipe(sasslint.failOnError())
        .on('error', notify.onError({
                message: 'SASS Lint Errors',
                onLast: true
            })
        );
}

// Static Server + watching scss/html files
function serve() {
    browserSync.init({
        proxy: 'http://d9-starter-theme.lndo.site',
        open: false
    })
    // livereload.listen()
    gulp.watch([paths.scss.watch, paths.scss.bootstrap], styles).on('change', browserSync.reload)
}

const build = gulp.series(styles, gulp.parallel(js, serve))

exports.styles = styles
exports.js = js
exports.serve = serve

exports.default = build
