var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require("gulp-autoprefixer"),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify');
	imagemin = require('gulp-imagemin');
	cleanCSS = require('gulp-clean-css');
gulp.task('styles',function(){
	gulp.src('./scss/*.scss')		
	.pipe(sass())		
	.pipe(autoprefixer('last 2 version'))
	.pipe(concat('app.css'))
	.pipe(gulp.dest('./virtual'))
	.pipe(gulp.dest('./css'))
	.pipe(rename({suffix: '.min'}))
	.pipe(cleanCSS({compatibility: 'ie8'}))
	.pipe(gulp.dest('./css'))
	.pipe(notify('Css  style task complete'))
})

gulp.task('watch',function(){
    gulp.watch('./scss/*.scss',['styles']); //监听一个目录文件，使用任务。
})