const { dest, parallel, series, src, watch } = require('gulp')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const concat = require('gulp-concat')
const del = require('del')
const minify = require('gulp-minify')
const postcss = require('gulp-postcss')
const sass = require('gulp-sass')(require('sass'))
const replace = require('gulp-replace')
const rename = require('gulp-rename')

// Start configuration.
var config = {}

// Define config variables for all of our StoryBook main categories.
config.utilities = {
	scss: 'src/utilities/**/_*.scss',
	js: 'src/utilities/**/*.behaviors.js',
	twig: ['src/utilities/**/*.twig', '!src/utilities/**/*.local.twig'],
}
config.atoms = {
	scss: 'src/atoms/**/_*.scss',
	js: 'src/atoms/**/*.behaviors.js',
	twig: ['src/atoms/**/*.twig', '!src/atoms/**/*.local.twig'],
}
config.molecules = {
	scss: 'src/molecules/**/_*.scss',
	js: 'src/molecules/**/*.behaviors.js',
	twig: ['src/molecules/**/*.twig', '!src/molecules/**/*.local.twig'],
}
config.organisms = {
	scss: 'src/organisms/**/_*.scss',
	js: 'src/organisms/**/*.behaviors.js',
	twig: ['src/organisms/**/*.twig', '!src/organisms/**/*.local.twig'],
}
config.templates = {
	scss: 'src/templates/**/_*.scss',
	js: 'src/templates/**/*.behaviors.js',
	twig: ['src/templates/**/*.twig', '!src/templates/**/*.local.twig'],
}
config.pages = {
	scss: 'src/pages/**/_*.scss',
	js: 'src/pages/**/*.behaviors.js',
	twig: ['src/pages/**/*.twig', '!src/pages/**/*.local.twig'],
}

config.stylesMain = 'src/sb-main.scss'
config.public = {
	css: 'public/css',
	img: 'public/img/*',
}
config.dist = {
	all: 'dist/*/',
	css: 'dist/css',
	js: 'dist/js',
	twig: 'dist/twig',
	img: 'dist/img',
}

// Start tasks.

// Clean out dist directory.
const cleanDist = (done) => {
	del.sync(config.dist.all)
	done()
}

// Compile all scss to css and minify.
const compileStyles = (done) => {
	src(config.stylesMain)
		.pipe(sass())
		.pipe(dest(config.public.css))
		.pipe(dest(config.dist.css))
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(
			rename({
				extname: '.min.css',
			})
		)
		.pipe(dest(config.dist.css))
	done()
}

// Watch for scss changes + recompile.
const watchStyles = () => {
	watch(
		[
			config.stylesMain,
			config.utilities.scss,
			config.atoms.scss,
			config.molecules.scss,
			config.organisms.scss,
			config.templates.scss,
			config.pages.scss,
		],
		compileStyles
	)
}

// Compile js to a single file and minify.
const compileJs = (done) => {
	src([config.utilities.js,
		config.atoms.js,
		config.molecules.js,
		config.organisms.js,
		config.templates.js,
		config.pages.js])
		.pipe(concat('sb-main.js'))
		.pipe(dest(config.dist.js))
		.pipe(
			minify({
				ext: {
					min: '.min.js',
				},
			})
		)
		.pipe(dest(config.dist.js))
	done()
}

// Watch for js changes + recompile.
const watchJs = () => {
	watch(
		[config.utilities.js,
			config.atoms.js,
			config.molecules.js,
			config.organisms.js,
			config.templates.js,
			config.pages.js],
		compileJs
	)
}

// Collect Twig files for dist.
const collectTwig = (done) => {
	src(config.utilities.js,
			config.atoms.twig,
			config.molecules.twig,
			config.organisms.twig,
			config.templates.twig,
			config.pages.twig)
		.pipe(replace('"../../', '"@sb/'))
		.pipe(replace('"../', '"@sb/'))
		.pipe(dest(config.dist.twig))
	done()
}

// Watch for Twig changes + re-collect.
const watchTwig = () => {
	watch(config.utilities.twig, collectTwig)
	watch(config.atoms.twig, collectTwig)
	watch(config.molecules.twig, collectTwig)
	watch(config.organisms.twig, collectTwig)
	watch(config.templates.twig, collectTwig)
	watch(config.pages.twig, collectTwig)
}

exports.default = series(
	cleanDist,
	compileStyles,
	compileJs,
	collectTwig,
	parallel(watchStyles, watchJs, watchTwig)
)
