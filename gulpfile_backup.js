
var gulp = require('gulp');
//var gulpFilter = require('gulp-filter')
var watch = require('gulp-watch');
var less = require('gulp-less');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var minifyCss = require('gulp-minify-css');
var fs = require('fs.extra');


var mainStarter = 'bootstrap.less';
var bootstrapLessDir = 'src/libs/bootstrap/less/';
var bootswatchDir = 'src/libs/bootswatch/';
var bootswatchThemeDir = 'paper/';

var libsDir = 'src/libs/';
var appDir = 'src/app/';

var VERSION = '0.0.1';

var deleteFolderRecursive = function(path) {
    if ( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
                console.log('Successfull delete FILE:   ' + curPath);
            }
        });
    fs.rmdirSync(path);
    console.log('Successfull delete FOLDER: ' + path);
    }
};

var src = {
    less: ['src/less/' + mainStarter],
    allLess: ['src/less/*.less', 'src/less/*/*.less'],
    allJs: [appDir + 'js/*.js'],
    bootstrapLessDir: ['src/libs/bootstrap/less/'],
    bootstrapTempLessDir: ['public/temp/bootstrap/less/'],
    bootstrapTempLessStarter: 'public/temp/bootstrap/less/' + mainStarter,
    bootswatchAddon: bootswatchDir + bootswatchThemeDir + 'bootswatch.less',
    vendorJs: [
        libsDir + 'jquery/dist/jquery.js',
        libsDir + 'modernizr/modernizr.js',
        libsDir + 'bootstrap/dist/js/bootstrap.js',
        libsDir + 'angular/angular.js'
    ],
    vendorJsMin: [
        libsDir + 'jquery/dist/jquery.min.js',
        libsDir + 'modernizr/modernizr.js',
        libsDir + 'bootstrap/dist/js/bootstrap.min.js',
        libsDir + 'angular/angular.min.js'
    ],
    appJs : [
    appDir + 'js/app.js'
    ]
}

var publishdir = 'public/';
var tempDir = publishdir + 'temp/'

var dist = {
    css: publishdir + 'static/',
    bootstrapTempLessDir: tempDir + 'bootstrap/less',
    js: publishdir + 'static/'
}

gulp.task('prepareTheme', ['createTempBootstrapDir'], function () {

    gulp.src(
        [
            bootswatchDir + bootswatchThemeDir + 'variables.less',
            bootswatchDir + bootswatchThemeDir + 'bootswatch.less'
        ]
    )
    .pipe(gulp.dest(dist.bootstrapTempLessDir));

});

gulp.task('createTempBootstrapDir', ['dirWorks'], function () {

    gulp.src(
        [
            bootstrapLessDir + '**/**',
            '!' + bootstrapLessDir + 'variables.less'
        ]
    )
    .pipe(gulp.dest(dist.bootstrapTempLessDir))

});

gulp.task('dirWorks', function () {
    fs.rmrfSync('public/temp');

    if ( !fs.existsSync('public/temp') ) {
        fs.mkdirSync('public/temp');
    }
    
    if ( !fs.existsSync('public/temp/bootstrap') ) {
        fs.mkdirSync('public/temp/bootstrap');
    }

    fs.copyRecursive('src/libs/bootstrap/less', 'public/temp/bootstrap/less', function (err) {
        if (err) {
            // i.e. file already exists or can't write to directory 
            throw err;
        }
 
        console.log('Create TEMP dir for bootstrap');
    });
})

gulp.task('buildCSS', ['prepareTheme', 'createTempBootstrapDir'], function () {

    gulp.src(
        [
            src.bootstrapTempLessStarter,
            src.bootswatchAddon,
            'src/libs/fontawesome/css/font-awesome.min.css'
        ]
    )
    .pipe(concat('vendor.less'))
    .pipe(less())
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(dist.css))

});

gulp.task('buildVendorJS', function (){
    gulp.src(src.vendorJs)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(dist.js))
})

gulp.task('buildAppJS', function (){
    gulp.src(src.appJs)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(dist.js))
})


gulp.task('watch', function () {

    gulp.watch(src.allLess, ['buildCSS']);
    gulp.watch(src.allJs, ['buildAppJS']);

})

gulp.task('deployBuild', ['prepareTheme', 'createTempBootstrapDir'], function () {
    var glob = require("glob");

    glob("public/static/*.*", function (er, files) {

        for (var i = 0; i < files.length; i++) {
            fs.unlinkSync(files[i],
                function (err) {
                    if (err) throw err;
                    
                }
            );
            console.log('successfully deleted file: ' + files[i]);
        }

        if (gulp.src(src.vendorJs)
                .pipe(concat('vendor.js' + '?v=' + VERSION))
                .pipe(gulp.dest(dist.js))
            ) {
            console.log('Build new vendor.js?v=' + VERSION);
        }

        if (gulp.src(
                [
                    src.bootstrapTempLessStarter,
                    src.bootswatchAddon,
                    'src/libs/fontawesome/css/font-awesome.min.css'
                ]
            )
            .pipe(concat('vendor.less'))
            .pipe(less())
            .pipe(minifyCss())
            .pipe(concat('vendor.css?v=' + VERSION))
            .pipe(gulp.dest(dist.css))
        ) {
            console.log('Build new vendor.css?v=' + VERSION);
        }

    });
    
});

gulp.task('tempDelete', function () {

    deleteFolderRecursive('public/temp');

})



