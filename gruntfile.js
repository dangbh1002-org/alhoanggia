'use strict';

module.exports = function (grunt) {
    // Project Configuration
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            build: {
                options: {
                    mangle: false
                },
                files: {
                    'public/dist/application.min.js': 'public/dist/application.js'
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'public/dist/application.min.css': 'public/dist/application.css'
                }
            }
        },

        concat: {
            js: {
                src: [
                    'public/modules/app.js',
                    'public/modules/*/*.js',
                    'public/modules/**/*.js'
                ],
                dest: 'public/dist/application.js'
            },
            css: {
                src: ['public/assets/**/*.css'],
                dest: 'public/dist/application.css'
            }
        },

        watch: {
            clientViews: {
                files: [
                    'public/**/*.html'
                ],
                options: {
                    livereload: true
                }
            },
            clientJS: {
                files: [
                    'public/modules/**/*.js'
                ],
                tasks: ['build'],
                options: {
                    livereload: true
                }
            },
            clientCSS: {
                files: 'public/assets/**/*.css',
                tasks: ['build'],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.task.registerTask('server', 'Starting the server', function () {

        // Get the callback
        var done = this.async();

        var path = require('path');
        var app = require(path.resolve('./server'));
    });

    // Lint CSS and JavaScript files.
    grunt.registerTask('build', ['concat', 'cssmin', 'uglify']);

    grunt.registerTask('default', ['build', 'watch']);

};
