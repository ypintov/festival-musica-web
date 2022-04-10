// function tarea(done) {
//   console.log("Desde la primer tarea");

//   done();
// }

// function tarea2(done) {
//   console.log("Desde la segunda tarea");

//   done();
// }

// exports.tarea = tarea;
// exports.tarea2 = tarea2;

const { src, dest, watch, parallel } = require("gulp");

//dependencias de css
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");

//imagenes
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");
const cache = require("gulp-cache");
const avif = require("gulp-avif");

const pathSCSSfile = "src/scss/**/*.scss";
const pathJsfile = "src/js/**/*.js";

//javascript
const terserJS = require("gulp-terser-js");

function css(done) {
  //Identificar el archivo .SCSS a compilar
  src(pathSCSSfile)
    .pipe(sourcemaps.init())
    //agregando plumber
    .pipe(plumber())
    //Compilarlo
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    //Almacenarlo
    .pipe(dest("build/css"));

  done();
}

function imagenes(done) {
  const opciones = {
    optimizationLevel: 3,
  };
  src("src/img/**/*.{png,jpg}")
    //
    .pipe(cache(imagemin(opciones)))
    //
    .pipe(dest("build/img"));

  done();
}

function versionWebp(done) {
  const opciones = {
    quality: 50,
  };
  src("src/img/**/*.{png,jpg}")
    //invocando webp con opciones
    .pipe(webp(opciones))
    //set dest
    .pipe(dest("build/img"));
  done();
}

function versionAvif(done) {
  const opciones = {
    quality: 50,
  };
  src("src/img/**/*.{png,jpg}")
    //invocando avif con opciones
    .pipe(avif(opciones))
    //set dest
    .pipe(dest("build/img"));
  done();
}

function javascript(done) {
  src(pathJsfile)
    //sourcemaps
    .pipe(sourcemaps.init())
    //terser : mejorar codigo js
    .pipe(terserJS())
    //sourcemaps write
    .pipe(sourcemaps.write("."))
    //dest
    .pipe(dest("build/js"));

  done();
}

function dev(done) {
  watch(pathJsfile, javascript);
  watch(pathSCSSfile, css);
  done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(/*imagenes, versionWebp, versionAvif,*/ javascript, dev);
