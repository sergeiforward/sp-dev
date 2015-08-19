
var gulp = require('gulp');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');

var postcss = require('gulp-postcss');
var postcssAssets = require('postcss-assets');
var postcssImport = require('postcss-import');
var postcssNested = require('postcss-nested');
var postcssMixins = require('postcss-mixins');
var postcssSimplevars = require('postcss-simple-vars');
var autoprefixer = require('gulp-autoprefixer');;

var processors = [
	postcssImport,
	postcssNested,
	postcssAssets(),
	postcssMixins,
	postcssSimplevars 
];

var VERSION = '0-0-1';

var vendorJS = [
	'src/libs/angular/angular.min.js',
	'src/libs/jquery/dist/jquery.min.js'
];

var appJS = [
	'src/app/js/*.js'
];

var vendorCSS = [
	'src/libs/font-awesome/css/font-awesome.css'
];

var appCSS = [
	'src/app/css/aq-starter.css'
];

var dist = {
	css: 'public/static/',
	js: 'public/static/'
};

var allCSS = [
	'src/app/css/*.css',
	'src/app/css/components/*.css'
];

var allJS = [
	'src/app/js/*.js'
];

var vendorJSFileName = 'vendor-' + VERSION + '.js';
var appJSFileName = 'app-' + VERSION + '.js';
var vendorCSSFileName = 'vendor-' + VERSION + '.css';
var appCSSFileName = 'app-' + VERSION + '.css';


/* Билдим обычный CSS */
var buildAppCSS = function () {
	gulp.src(appCSS)
    .pipe(postcss(processors))
    .pipe(concat(appCSSFileName))
    .pipe(autoprefixer())
    .pipe(gulp.dest(dist.css));
};

/* Билдим Вендорный CSS */
var buildVendorCSS = function () {
	gulp.src(vendorCSS)
    .pipe(postcss(processors))
    .pipe(concat(vendorCSSFileName))
    .pipe(autoprefixer())
    .pipe(gulp.dest(dist.css));

};

/* Билдим оптимизированый CSS */
var buildOptimizeCSS = function () {
	gulp.src(appCSS)
    .pipe(postcss(processors))
    .pipe(concat(appCSSFileName))
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(gulp.dest(dist.css));

    gulp.src(vendorCSS)
    .pipe(postcss(processors))
    .pipe(concat(vendorCSSFileName))
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(gulp.dest(dist.css));
};

/* Билдим вендорный JS */
var buildVendorJS = function () {
	gulp.src(vendorJS)
    .pipe(concat(vendorJSFileName))
    .pipe(gulp.dest(dist.js))
};

/* Билдим девелоперский JS */
var buildAppJS = function () {
	gulp.src(appJS)
    .pipe(concat(appJSFileName))
    .pipe(gulp.dest(dist.js))
};

/* Билдим девелоперский ОПТИМИЗИРОВАНЫЙ JS */
var buildOptimizeAppJS = function () {
	gulp.src(appJS)
    .pipe(concat(appJSFileName))
    .pipe(uglify())
    .pipe(gulp.dest(dist.js))
};


// Таски
gulp.task('buildCSS', function(){
	buildAppCSS();	
	buildVendorCSS();
});

gulp.task('buildOptimizeCSS', function(){
	buildOptimizeCSS();	
});

gulp.task('buildJS', function(){
	buildVendorJS();
	buildAppJS();
});

gulp.task('buildOptimizeJS', function(){
	buildVendorJS();
	buildOptimizeAppJS();
});

gulp.task('watch', function() {
	gulp.watch(allCSS, ['buildCSS']);
	gulp.watch(allJS, ['buildJS']);
});

gulp.task('buildDev', ['buildCSS', 'buildJS'], function (){
	console.log('Dev Build successfully complete');
});

gulp.task('buildDeploy', ['buildOptimizeCSS', 'buildJS'], function (){
	console.log('Deploy Build successfully complete');
});




