var gulp = require("gulp");
var typescript = require("typescript");
var typescriptCompiler = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var merge = require("merge2");

function handleError(error) {
    console.error("ERROR");
    console.error(error.toString());
    this.emit("end");
}

gulp.task("typescript", function () {
    var typescriptProject = typescriptCompiler.createProject("tsconfig.json", {
        typescript: typescript,
        declaration: true
    });

    var tsResult = typescriptProject
        .src()
        .pipe(typescriptProject())

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done. 
        tsResult.dts.pipe(gulp.dest("./dist")),
        tsResult.js.pipe(gulp.dest("./dist"))
    ]);
});

gulp.task("watch", function () {
    gulp.watch(["src/**/*.ts", "src/**/*.tsx"], ["typescript"]).on("error", handleError);
});

gulp.task("default", ["typescript", "watch"]);