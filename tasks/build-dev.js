/* global require, console */
"use strict";
var fs = require("fs-extra");
var path = require("path");
var concat = require("concatenate-files");

var files, file, dest, i;

var currentFromDir = [];

/* HELPERS */
function fromDir(startPath, filter, recurring) {
    var files = fs.readdirSync(startPath);
    var output;
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter, true); //recurse
        } else if (filename.indexOf(filter) >= 0) {
            currentFromDir.push(filename);
            console.log("- ", filename);
        }
    }
    console.log(recurring ? "RECURRING" : "NOT RECURRING");
    console.log(currentFromDir);
    if (!recurring) {
        output = currentFromDir;
        currentFromDir = [];
        return output;
    };
}

/* End of helpers */

console.log("================================\n>> Starting development build <<\n================================\n\n\n");

// Clean build directory
console.log("Cleaning build folder");
fs.emptyDirSync("build/");

// Copy manifest
console.log("Copying manifest.json");
fs.copySync("src/manifest.json", "build/manifest.json");

// Concatenate background.js modules
console.log("Concatenating:");
files = fromDir("src/background/", ".js");
console.log("into background.js");
files.unshift("tasks/before-concatenation-js");
files.push("tasks/after-concatenation-js");
concat(files, "build/scripts/background.js");

// Concatenate timer.js modules and remove unnecessary "use scripts"
console.log("Concatenating:");
files = fromDir("src/timer/", ".js");
files.unshift("tasks/before-concatenation-js");
files.push("tasks/after-concatenation-js");
console.log("!!!!!!!!!!!!!!!!!!!!!!!!!");
console.log(files);
console.log("into timer.js");
concat(files, "build/scripts/timer.js", null, function(err, output) {});

// Concatenate timer styles
console.log("Concatenating:");
files = fromDir("src/timer/", ".css");
files.unshift("tasks/before-concatenation-css");
files.push("tasks/after-concatenation-css");
console.log("into timer.html");
concat(files, "build/styles/timer.html");

// Copy resources folder
console.log("Copying resources");
fs.copySync("src/resources/", "build/resources/");
