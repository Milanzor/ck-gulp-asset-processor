var gulp = require('gulp'),
    shell = require('gulp-shell'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    cksettings = require('./settings.json');

var vendorJsCombines = cksettings['js-vendor-combine-dirs'] || {};
var scssFileOptions = cksettings['scss-compile-options'] || {};
var vendorCssCombines = cksettings['css-vendor-combine-dirs'] || {};


// JS VENDORS
gulp.task('js-vendor-combine', function() {
    // Loop through all vendor dirs, if its not empty
    if (Object.keys(vendorJsCombines).length > 0) {
        Object.keys(vendorJsCombines).forEach(function(vendorDir) {

            var settings = vendorJsCombines[vendorDir];
            settings.additionalOptions = settings.additionalOptions || '';

            // Start shell
            gulp.src(vendorDir + '*.js').pipe(shell(
                ['./node_modules/.bin/uglifyjs <%=vendorFiles%> -o <%=settings.targetFile%> <%=settings.additionalOptions%>'], {
                    templateData: {
                        settings: settings,
                        vendorFiles: vendorDir + '*.js',
                    }
                }));

            console.log('Started uglifyjs watch for' + vendorDir);
        });
    }
});

gulp.task('js-vendor-combine-watch', function(){
    if (Object.keys(vendorJsCombines).length > 0) {
        Object.keys(vendorJsCombines).forEach(function(vendorDir) {
            console.log('Starting JS Vendor Combine Watch for directory ' + vendorDir);
            gulp.watch('*.js', {cwd: vendorDir}, ['js-vendor-combine']);
        });
    }
});


// CSS VENDORS

gulp.task('css-vendor-combine', function() {
    // Loop through all vendor dirs, if its not empty
    if (Object.keys(vendorCssCombines).length > 0) {
        Object.keys(vendorCssCombines).forEach(function(vendorDir) {

            var settings = vendorCssCombines[vendorDir];
            return gulp.src(vendorDir + '*.css')
                .pipe(cleanCSS())
                .pipe(concat('vendors-combined.css'))
                .pipe(gulp.dest(settings.targetFile));
        });
    }
});

gulp.task('css-vendor-combine-watch', function(){
    if (Object.keys(vendorCssCombines).length > 0) {
        Object.keys(vendorCssCombines).forEach(function(vendorDir) {
            console.log('Starting CSS Vendor Combine Watch for directory ' + vendorDir);
            gulp.watch('*.css', {cwd: vendorDir}, ['css-vendor-combine']);
        });
    }
});

// SCSS COMPILER
gulp.task('scss-compile', function() {
    // Loop through all srcFiles, if its not empty
    if (Object.keys(scssFileOptions).length > 0) {
        Object.keys(scssFileOptions).forEach(function(sourceFile) {
            // Find the targetFile
            var settings = scssFileOptions[sourceFile];
            settings.additionalOptions = settings.additionalOptions || '';
            settings.outputStyle = settings.outputStyle || 'compressed';

            console.log('Starting SCSS Watcher for directory ' + sourceFile);
            // Start gulp
            gulp.src(sourceFile).pipe(shell(
                ['./node_modules/.bin/node-sass -w <%=sourceFile%> <%=settings.targetFile%> --output-style <%=settings.outputStyle%> --include-path * <%=settings.additionalOptions%>'], {
                    templateData: {
                        settings: settings,
                        sourceFile: sourceFile,
                    }
                }));
        });
    }
});
gulp.task('default', ['js-vendor-combine','css-vendor-combine', 'scss-compile', 'js-vendor-combine-watch', 'css-vendor-combine-watch']);


