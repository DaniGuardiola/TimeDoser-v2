"use strict";
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        // Task configuration.
        clean: {
            build: {
                src: ["bin/"]
            },
            js: {
                src: ["src/js/script.js"]
            }
        },
        concat: {
            script: {
                src: [
                    "src/js/app.js",
                    "src/js/module/*.js"
                ],
                dest: "src/js/script.js"
            }
        },
        uglify: {
            background: {
                src: "src/js/background.js",
                dest: "bin/js/background.js"
            },
            script: {
                src: "src/js/script.js",
                dest: "src/js/script.js"
            },
            timer: {
                src: "bin/view/timer.js",
                dest: "bin/view/timer.js"
            }
        },
        cssmin: {
            style: {
                files: [{
                    expand: true,
                    cwd: "src/css",
                    src: ["**/*.css"],
                    dest: "bin/css",
                    ext: ".css"
                }]
            }
        },
        copy: {
            manifest: {
                src: "src/manifest.json",
                dest: "bin/manifest.json"
            },
            meta: {
                expand: true,
                cwd: "resources/meta",
                src: "**",
                dest: "bin/meta/"
            },
            audio: {
                expand: true,
                cwd: "resources/audio",
                src: "**",
                dest: "bin/audio/"
            },
            locales: {
                expand: true,
                cwd: "_locales",
                src: "**",
                dest: "bin/_locales"
            },
            view: {
                expand: true,
                cwd: "src/view",
                src: "**",
                dest: "bin/view/"
            }
        },
        exec: {
            vulcanize: {
                command: "vulcanize -p \"src/\" /view/timer.html --inline-script --inline-css | crisper --html bin/view/timer.html --js bin/view/timer.js"
            }
        },
        "json-minify": {
            manifest: {
                files: "bin/manifest.json"
            }
        },
        minifyHtml: {
            options: {
                empty: true
            },
            timer: {
                files: {
                    "bin/view/timer.html": "bin/view/timer.html"
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-json-minify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks("grunt-minify-html");

    // Default task.
    grunt.registerTask("default", ["build"]);

    grunt.registerTask("build", [
        "clean:build",
        "concat:script",
        "uglify:script",
        "uglify:background",
        "copy:manifest",
        "copy:audio",
        "copy:meta",
        "copy:locales",
        "copy:view",
        "exec:vulcanize",
        "clean:js",
        "minifyHtml:timer",
        "uglify:timer",
        "json-minify:manifest"
    ]);
};
