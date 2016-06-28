/**
 * Created by bian on 2016/4/25.
 */
var gulp = require("gulp");
var sass = require("gulp-sass");

gulp.task("scss",function(){
    return gulp.src("./scss/index.scss")
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest("./dist/css/"));
});

gulp.task("watch",function(){
    gulp.watch("./scss/**/*.scss",["scss"]);
});

gulp.task("default",["watch"],function(){

});