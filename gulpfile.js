// ---------------------------------------------------------------------
// | Define dependencies to use.                                       |
// ---------------------------------------------------------------------
const gulp         = require('gulp');
const plumber      = require('gulp-plumber');
const concat       = require('gulp-concat');
const rename       = require('gulp-rename');
const uglifycss    = require('gulp-uglifycss');
const tinypng      = require('gulp-tinypng-compress');
const uglify       = require('gulp-uglify');
const babel        = require('gulp-babel');
const htmlmin      = require('gulp-htmlmin');
const favicons     = require("gulp-favicons/es5");
const sequence     = require('gulp-sequence');
const stylus       = require('gulp-stylus');
const typescript   = require('gulp-typescript');
const autoprefixer = require('gulp-autoprefixer');
const livereload   = require('gulp-livereload');


const srcPath = {
    html  : 'source/',
    css   : 'source/design/css/',
    vendor: 'source/design/css/vendor/',
    fonts : 'source/design/fonts/',
    imgs  : 'source/design/imgs/',
    js    : 'source/design/js/',
    styl  : 'source/design/styl/',
    ts    : 'source/design/ts/',
    root  : 'source/'
};

const destPath = {
    html  : 'html/prueba',
    css   : 'html/design/css/',
    vendor: 'html/design/css/vendor/',
    fonts : 'html/design/fonts/',
    imgs  : 'html/design/imgs/',
    js    : 'html/design/js/',
    root  : 'html/'
};


// ---------------------------------------------------------------------
// | Maintains updated src changes in the browser.                     |
// ---------------------------------------------------------------------

/**
 * Reload on change.
 */
gulp.task('reload', ['stylus', 'js'], () => {
    gulp.src(srcPath.root)
        .pipe(livereload());
});

/**
 * Monitors changes in projects files and apply changes instantly.
 * Use with livereload chrome extension.
 * Reference: https://github.com/vohof/gulp-livereload
 */
gulp.task('watch', () => {
    'use strict';

    // Files to be watched.
    let files = [
        `${destPath.root}**/*.php`,

        `${srcPath.root}*.html`,
        `${srcPath.styl}**/*.styl`,
        `${srcPath.js}**/*.js`
    ];

    livereload.listen();

    gulp.watch(files, ['reload']);
});


// ---------------------------------------------------------------------
// | Build production project.                                         |
// ---------------------------------------------------------------------

/**
 * Concatenate and minify css files using gulp-minify-css.
 * Reference: https://github.com/murphydanger/gulp-minify-css
 */

gulp.task('css', () => {
    'use strict';

    // Source files.
    let srcFiles = [
        `${srcPath.css}layout.css`,
        `${srcPath.css}styles.css`,
        `${srcPath.css}pl-modal.css`,
        `${srcPath.css}bootstrap.css`
    ];

    // Output files.
    let outputFile = 'styles.min.css';

    return gulp.src(srcFiles)
        .pipe(concat(outputFile))
        .pipe(uglifycss())
        .pipe(gulp.dest(destPath.css));
});


gulp.task('html', function() {
    // Source files.
    var srcFiles = srcPath.root + '[!_]*.html';

    // Opts
    var opts = {
        collapseWhitespace: true,
        removeComments: true
    };

    return gulp.src(srcFiles)
        .pipe(htmlmin(opts))
        // .pipe(rename({ extname: '.txt' }))
        .pipe(gulp.dest(destPath.root));
});



/**
 * Minify and copy css vendor files.
 */
gulp.task('vendor', () => {
    'use strict';

    // Source files.
    let srcFiles = [
        `${srcPath.vendor}bootstrap.css`,
    ];

    // Output files.
    let outputFile = 'bootstrap.min.css';

    return gulp.src(srcFiles)
        .pipe(concat(outputFile))
        .pipe(uglifycss())
        .pipe(gulp.dest(destPath.vendor));
});


/**
 * Generate generate favicons.
 * Reference: https://github.com/haydenbleasel/favicons
 */
gulp.task('favicon', () => {
    'use strict';

    let opts = {
        appName: "My App",
        appDescription: "This is my application",
        developerName: "Goplek",
        developerURL: "http://goplek.com/",
        background: "transparent",
        path: "html/favicons",
        url: "http://goplek-versant180.com/",
        display: "standalone",
        orientation: "portrait",
        version: 1.0,
        logging: false,
        online: false,
        icons: {
            android: false,
            appleIcon: true,
            appleStartup: false,
            coast: false,
            favicons: true,
            firefox: false,
            opengraph: false,
            twitter: false,
            windows: false,
            yandex: false
        }
    };

    return gulp.src(`${srcPath.root}favicon.png`)
        .pipe(favicons(opts))
        .pipe(gulp.dest(`${destPath.root}favicons`));
});


/**
 * Copy specific files from fonts folder.
 */
gulp.task('fonts', () => {
    'use strict';

    // Source files.
    let srcFiles = `${srcPath.fonts}*.{eot,woff,woff2,ttf,svg,otf}`;

    return gulp.src(srcFiles)
        .pipe(gulp.dest(destPath.fonts));
});


/**
 * Minify and create txt files from html.
 * References: https://github.com/jonschlinkert/gulp-htmlmin
 *             https://github.com/kangax/html-minifier
 */
gulp.task('html', function() {
    // Source files.
    var srcFiles = srcPath.root + '[!_]*.html';

    // Opts
    var opts = {
        collapseWhitespace: true,
        removeComments: true
    };

    return gulp.src(srcFiles)
        .pipe(htmlmin(opts))
        // .pipe(rename({ extname: '.txt' }))
        .pipe(gulp.dest(destPath.root));
});


/**
 * Clone html files adding an underscore in name files.
 */
gulp.task('html-dev', () => {
    'use strict';

    return;
    // Source files.
    let srcFiles = `${srcPath.root}[!_]*.html`;

    return gulp.src(srcFiles)
        .pipe(rename({ prefix: '_' }))
        .pipe(gulp.dest(srcPath.root));
});


/**
 * Optimize images using gulp-tinypng-compress.
 * Reference: https://github.com/stnvh/gulp-tinypng-compress
 */
gulp.task('imgs', () => {
    'use strict';

    // let tinyFiles  = `${srcPath.imgs}**/*.{png,jpg,jpeg}`,
    let tinyFiles  = `${srcPath.imgs}**/*.png`,
        otherFiles = `${srcPath.imgs}**/*.*`;

    // Copy non png, jpg and jpeg files.
    gulp.src([otherFiles, `!${tinyFiles}`])
        .pipe(gulp.dest(destPath.imgs));


    // tinypng options
    let opts = {
        key: 'pFFAVLRIqtR-exFUo5XuSLrNAuP53k4d',
        sigFile: `${srcPath.imgs}.tinypng-sigs`,
        log: true
    };

    // Optimize tinyFiles.
    return gulp.src(tinyFiles)
        .pipe(tinypng(opts))
        .pipe(gulp.dest(destPath.imgs));
});


/**
 * Concatenate and minify js files.
 * References: https://github.com/terinjokes/gulp-uglify
 *             https://github.com/babel/gulp-babel
 */
gulp.task('js', () => {
    'use strict';

    // Source files (avoid vendor)
    let srcFiles = [
        `!${srcPath.js}vendor/**/`,
        `${srcPath.js}**/*.js`
    ];

    // Output files.
    let outputFile = 'scripts.min.js';

    // Babel settings.
    let babelSettings = { presets: ['es2015'] };

    return gulp.src(srcFiles)
        .pipe(plumber())
        .pipe(babel(babelSettings))
        .pipe(concat(outputFile))
        .pipe(uglify())
        .pipe(gulp.dest(destPath.js));
});


/**
 * Copy and minify js vendor files.
 */
gulp.task('js-vendor', () => {
    'use strict';

    // Source vendor files
    let srcFiles = [ `${srcPath.js}vendor/**/*.js` ];

    return gulp.src(srcFiles)
        .pipe(uglify())
        .pipe(gulp.dest(`${destPath.js}vendor`));
});


/**
 * Transpile stylus files.
 * Reference: https://github.com/stevelacy/gulp-stylus
 */
gulp.task('stylus', () => {
    'use strict';

    // Source files.
    let srcFiles = [
        `${srcPath.styl}**/*.styl`
    ];

    // Autoprefixer configuration.
    let autoprefixerConf = {
        browsers: ['last 2 versions'],
        cascade: false
    };

    // Output files.
    // let outputFile = 'styles.css';
    let outputFile = 'styles.min.css';

    return gulp.src(srcFiles)
        .pipe(plumber())
        .pipe(stylus())
        .pipe(concat(outputFile))
        .pipe(autoprefixer(autoprefixerConf))
        .pipe(uglifycss())
        // .pipe(gulp.dest(srcPath.css));
        .pipe(gulp.dest(destPath.css));
});


/**
 * Concatenate and compile typescript files.
 * Reference: https://www.npmjs.com/package/gulp-typescript/
 */
gulp.task('ts', () => {
    'use strict';

    let opts = {
        target        : 'ES5',
        removeComments: false,
        noImplicitAny : false
    };

    // Source files.
    let srcFiles = [
        `${srcPath.ts}*.ts`
    ];

    // Output files.
    let outputFile = 'pl.ts';

    return gulp.src(srcFiles)
        .pipe(plumber())
        .pipe(concat(outputFile))
        .pipe(typescript(opts))
        // .pipe(uglify())
        .pipe(gulp.dest(srcPath.js));
});


/**
 * Build project and lave ready to deploy.
 * @param done
 */
gulp.task('build', (done) => {
    sequence('css', 'css-vendor', 'fonts', 'imgs', 'js', 'js-vendor', 'html', 'favicon', done);
});


/**
 * Run default task.
 */
gulp.task('default', ['build']);