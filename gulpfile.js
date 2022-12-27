const gulp = require('gulp');
const { series, parallel, dest } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const webpackConfig = require('./webpack.config.js');
const webpackStream = require('webpack-stream');
const stylus = require('gulp-stylus');
const autoprefixer = require('autoprefixer-stylus');
const cssnano = require('gulp-cssnano');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const ttf2eot = require('gulp-ttf2eot');
const webp = require('gulp-webp');

const stylusTask = (done) => {
	gulp.src('./src/stylus/**/*.styl')
		.pipe(sourcemaps.init())
		.pipe(stylus({
			pretty: true,
			use: [autoprefixer('last 2 versions')]
		}))
		.pipe(cssnano())
		.pipe(sourcemaps.write('.'))
		.pipe(dest('./css'));
	done();
};

const jsTask = (done) => {
	gulp.src('./src/**/*.js')
		.pipe(webpackStream(webpackConfig))
		.pipe(dest('./js'));
	done();
};

const fontTask = (done) => {
	gulp.src('./src/assets/fonts/**/*.ttf')
		.pipe(gulp.dest('./assets/fonts'));
	gulp.src('./src/assets/fonts/**/*.ttf')
		.pipe(ttf2eot())
		.pipe(gulp.dest('./assets/fonts'));
	gulp.src('./src/assets/fonts/**/*.ttf')
		.pipe(ttf2woff())
		.pipe(gulp.dest('./assets/fonts'));
	gulp.src('./src/assets/fonts/**/*.ttf')
		.pipe(ttf2woff2())
		.pipe(gulp.dest('./assets/fonts'));
	done();
};

const imageTask = (done) => {
	gulp.src('./src/assets/images/*.+(png|jpg|gif)')
		.pipe(webp())
		.pipe(gulp.dest('./assets/images'));
	done();
};

const watchTask = () => {
	browserSync.init({
		server: { baseDir: './' },
		open: false,
		port: 3005,
		ui: { port: 3006 }
	});
	gulp.watch(['./index.html']).on('change', browserSync.reload);
	gulp.watch(['./src/stylus/**/*.styl'], stylusTask).on('change', browserSync.reload);
	gulp.watch(['./src/js/**/*.js'], jsTask).on('change', browserSync.reload);
};


exports.default = series(jsTask, stylusTask, watchTask);
exports.fonts = parallel(fontTask);
exports.images = parallel(imageTask);