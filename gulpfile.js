var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var env = require('gulp-env');
var sass = require('gulp-sass');
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var ngmin = require('gulp-ngmin');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');

var browserify = require('browserify'),
source = require('vinyl-source-stream'),
buffer = require('vinyl-buffer'),
strictify = require('strictify'),
browserifyCSS = require('browserify-css');


gulp.task('minjs', function () {
    return gulp.src('frontend/dist/*.js')
        .pipe(ngmin({dynamic: false}))
        .pipe(gulp.dest('frontend/dist'));
});
gulp.task('default', function () {});
gulp.task('build', ['browserify']);
gulp.task('cmp', ['minify-css', 'compress']);
gulp.task('minify-css', minifyCss);
gulp.task('compress', compressJS);
gulp.task('browserify', compileWithBrowserify);
gulp.task('watch', watch);


function minifyCss() {
    return gulp.src('frontend/dist/*.css')
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest('frontend/dist'));
}

function compressJS() {
    gulp.src('frontend/dist/*.js')
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('frontend/dist'))
}

function setTestEnv() {
    setEnv('test');
}

function setDockerEnv() {
    setEnv('docker');
}

function setDeployEuropeEnv() {
    setEnv('deployEu');
}

function setDeployUEWEnv() {
    setEnv('deployUEW');
}

function setDockerEnv() {
    setEnv('docker');
}

function setEnv(enviroment) {
    env({
        vars: {
            NODE_ENV: enviroment
        }
    });
}

function compileWithBrowserify() {
    var dist_folder = "frontend/dist/";

    try {
        fs.unlinkSync(dist_folder + 'app.css');
        fs.unlinkSync(dist_folder + 'app.js');
    } catch(err) {}

    var bundleStream = browserify()
    .add('frontend/js/app.js')
    .transform( browserifyCSS, {
        rootDir: "frontend/dist/",
        global: true,
        processRelativeUrl: function(relativeUrl) {
            var rootDir = path.resolve("frontend/dist/");
            var relativePath = stripQueryStringAndHashFromPath(relativeUrl);
            var queryStringAndHash = relativeUrl.substring(relativePath.length);
            var prefix = '../../node_modules/';

            if ( startsWith(relativePath, prefix) ) {
                var vendorPath = 'vendor/' + relativePath.substring(prefix.length);
                var source = path.join(rootDir, relativePath);
                var target = path.join(rootDir, vendorPath);

                gutil.log('Copying file from ' + gutil.colors.magenta(JSON.stringify(source)) +
                    ' to ' + gutil.colors.magenta(JSON.stringify(target)) + "\n");
                fse.copySync(source, target);

                // Returns a new path string with original query string and hash fragments
                return vendorPath + queryStringAndHash;
            }

            return relativeUrl;
        },
        onFlush: function(options, done) {
            var css_file_path = path.join(dist_folder, 'app.css');

            fs.appendFileSync( css_file_path, options.data);
            gutil.log("Generated " + gutil.colors.magenta(css_file_path));

            // Do not embed CSS into a JavaScript bundle
            done(null);
        }
    })
    .bundle();

    var js_file = 'app.js';

    bundleStream
    .pipe(source(js_file))
    .pipe(buffer())
    .pipe(gulp.dest(dist_folder));

    bundleStream.on('end', function () {
        gutil.log("Generated " + gutil.colors.magenta(dist_folder + js_file));
    });

    function stripQueryStringAndHashFromPath(url) {
        return url.split('?')[0].split('#')[0];
    }

    function startsWith(string, prefix) {
        return string.lastIndexOf(prefix, 0) === 0;
    }
}


function watch(){
    gulp.watch('frontend/js/*.js', ['browserify']);
    gulp.watch('frontend/css/*.css', ['browserify']);
}
