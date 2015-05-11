'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var coffeeify = require('coffeeify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var nodemon = require('gulp-nodemon')

//
// config
var APP_HTML = ['./app/index.html']
var APP_ASSETS = ['./app/assets/**']
var APP_COFFEE = ['./app/**.coffee', './app/**/**.coffee']
var APP_SERVER = 'server.coffee'

// add custom browserify options here
var browserifyOpts = {
  entries: './app/entry.coffee',
  debug: true
};
var opts = assign({}, watchify.args, browserifyOpts);
var b = watchify(browserify(opts)); 

// add browserify transformations here
b.transform(coffeeify);


// register tasks
gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal
gulp.task('copy-assets', copyAssets);
gulp.task('copy-html', copyHTML); 
gulp.task('develop', develop);


// watch for changes 
gulp.task('watch', function() {
  gulp.watch(APP_COFFEE, ['js'])
  gulp.watch(APP_HTML, ['copy-html'])
  gulp.watch(APP_ASSETS, ['copy-assets'])
  gulp.watch(APP_SERVER, ['develop'])
})

gulp.task('default', function() {
  bundle();
  copyHTML();
  copyAssets();
});


//
// bundle js
//
function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'));
}

//
// copy html over
//
function copyHTML() {
  gulp.src(APP_HTML)
   .pipe(gulp.dest('./dist'));
}

//
// copy app assets
//
function copyAssets() {
  gulp.src(APP_ASSETS)
   .pipe(gulp.dest('./dist/assets'));
}

//
// restart server with nodemon
//
function develop () {
  nodemon({ script: APP_SERVER
          , ext: 'coffee'
<<<<<<< HEAD
          , ignore: ['app/**.coffee'] })
=======
          , ignore: ['app/**.coffee']
          , tasks: [] })
>>>>>>> 2c7756e... added nodemon to gulpfile
    .on('restart', function () {
      console.log('restarted server!')
    })
}