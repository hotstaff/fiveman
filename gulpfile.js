/* ========================================================================
 * Realtime-Kakeibo Fiveman: gulpfiles.js
 * ========================================================================
 * The gulp script for fetch required module and build 
 */
"use strict";

var gulp = require('gulp');
var download = require("gulp-download-stream");
var del = require('del');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");

// js
var public_js_dir = "./public/js";
var required_remote_modules = [
    "https://cdnjs.cloudflare.com/ajax/libs/canvasjs/1.7.0/canvasjs.js"
];
var required_modules = [
    "./node_modules/jquery/dist/jquery.js",
    "./node_modules/socket.io-client/dist/socket.io.js",
    "./node_modules/Umi/dist/js/bootstrap.js",
    "./node_modules/flatpickr/dist/flatpickr.js",
    "./node_modules/flatpickr/dist/l10n/ja.js",
    "./node_modules/js-cookie/src/js.cookie.js",
    "./node_modules/pnotify/dist/pnotify.js",
    "./node_modules/pnotify/dist/pnotify.confirm.js",
    "./node_modules/pnotify/dist/pnotify.buttons.js",
    "./node_modules/jsondiffpatch/public/build/jsondiffpatch.js",
    "./node_modules/xxhashjs/build/xxhash.js",
    "./node_modules/sifter/sifter.min.js",
    "./node_modules/jquery.fft/jquery.fft.js",
    "./node_modules/devbridge-autocomplete/dist/jquery.autocomplete.js",
    "./node_modules/smartwizard/dist/js/jquery.smartWizard.js"
];

// css
var public_css_dir = "./public/css";
var required_css = [
    "./node_modules/flatpickr/dist/flatpickr.css",
    "./node_modules/Umi/dist/css/bootstrap.css",
    "./node_modules/pnotify/dist/pnotify.css",
    "./node_modules/pnotify/dist/pnotify.buttons.css",
    "./node_modules/pnotify/dist/pnotify.brighttheme.css",
    "./node_modules/smartwizard/dist/css/smart_wizard.css",
    "./node_modules/smartwizard/dist/css/smart_wizard_theme_arrows.css"];

// fonts
var public_fonts_dir = "./public/fonts";
var required_fonts = ["./node_modules/Umi/dist/fonts/*"];

gulp.task("clean:js", function () {
    return del(["./public/js/*.js", "!./public/js/index.js", "!./public/js/leastsquare.js"]);
});

gulp.task("clean:css", function () {
    return del(["./public/css/*.css", "!./public/css/style.css"]);
});

gulp.task("clean:fonts", function () {
    return del(["./public/fonts/*"]);
});

gulp.task('clean', gulp.parallel("clean:js", "clean:css", "clean:fonts"));

gulp.task('copy:js', function () {
    return gulp.src(required_modules)
               .pipe(gulp.dest(public_js_dir));
});

gulp.task('copy:remote_js', function () {
    return download(required_remote_modules)
                .pipe(gulp.dest(public_js_dir));
});

gulp.task('copy:css', function () {
    return gulp.src(required_css)
               .pipe(gulp.dest(public_css_dir));
});

gulp.task('copy:fonts', function () {
    return gulp.src(required_fonts)
               .pipe(gulp.dest(public_fonts_dir));
});

gulp.task('copy', gulp.parallel("copy:js", "copy:remote_js", "copy:css", "copy:fonts"));

gulp.task('minify:js', function () {
    return gulp.src(["./public/js/*.js", "!./public/js/*.min.js"])
               .pipe(uglify())
               .pipe(rename({ extname: '.min.js' }))
               .pipe(gulp.dest('./public/js'));
});


gulp.task('minify:css', function () {
    return gulp.src(["./public/css/*.css", "!./public/css/*.min.css"])
               .pipe(cleanCSS())
               .pipe(rename({ extname: ".min.css"}))
               .pipe(gulp.dest('./public/css'));
});

gulp.task('minify', gulp.parallel("minify:css", "minify:js"));

gulp.task('default', gulp.series('copy', 'minify'));
