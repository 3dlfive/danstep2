"use strict";
const autoPref = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const del = require("del");
const gulp = require("gulp");
const minify = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const fileinclude = require("gulp-file-include");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const ttf2woff2 = require("gulp-ttf2woff2");
const uglify = require("gulp-uglify");

function html() {
  return gulp
    .src(["./src/html/base.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(
      rename({
        basename: "index",
        extname: ".html",
      })
    )
    .pipe(gulp.dest("./"))
    .pipe(browserSync.stream());
}
function styles() {
  return gulp
    .src("./src/scss/style.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoPref({ cascade: false }))
    .pipe(minify({ compatibility: "ie8" }))
    .pipe(concat("all.min.css"))
    .pipe(gulp.dest("./dist/styles/"))
    .pipe(browserSync.stream());
}
function scripts() {
  return gulp
    .src("./src/js/*.js")
    .pipe(concat("all.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./dist/scripts/"))
    .pipe(browserSync.stream());
}
function fonts() {
  return gulp
    .src("./src/fonts/**/*.ttf")
    .pipe(ttf2woff2())
    .pipe(gulp.dest("./dist/fonts/"));
}
function cleanDist() {
  return del(["./dist"]);
}
function imgs() {
  return gulp
    .src("./src/img/**/**")
    .pipe(imagemin())
    .pipe(gulp.dest("./dist/images"));
}
function serve() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
}
function watcher() {
  gulp.watch("./src/html/blocks/*.html", html);
  gulp.watch("./src/scss/*.scss", styles);
  gulp.watch("./src/scss/blocks/*.scss", styles);
  gulp.watch("./src/scss/*/*.scss", styles);
  gulp.watch("./src/scripts/blocks/*.js", scripts);
  gulp.watch("./*.html", gulp.series(browserSync.reload, imgs));
}

gulp.task(
  "dev",
  gulp.parallel(serve, watcher, gulp.series(html, fonts, imgs, styles, scripts))
);

gulp.task("build", gulp.series(cleanDist, html, fonts, imgs, styles, scripts));
