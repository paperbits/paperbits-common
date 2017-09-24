const gulp = require("gulp");
const typescript = require("typescript");
const typescriptCompiler = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const merge = require("merge2");
const mocha = require("gulp-mocha");

function handleError(error) {
    console.error("ERROR");
    console.error(error.toString());
    this.emit("end");
}

gulp.task("typescript", function () {
    const typescriptProject = typescriptCompiler.createProject("tsconfig.json", {
        typescript: typescript,
        declaration: true
    });

    const tsResult = typescriptProject
        .src()
        .pipe(typescriptProject())

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done. 
        tsResult.dts.pipe(gulp.dest("./dist")),
        tsResult.js.pipe(gulp.dest("./dist"))
    ]);
});

gulp.task("watch", function () {
    gulp.watch(["src/**/*.ts"], ["typescript"]).on("error", handleError);
});

gulp.task("default", ["typescript", "watch"]);

gulp.task("test", ["typescript"], function () {
    const typescriptProject = typescriptCompiler.createProject("tsconfig.json", {
        typescript: typescript,
        declaration: true
    });

    return gulp.src("./dist/specs/*.js")
        .pipe(mocha({
            reporter: 'progress'
        }));
});