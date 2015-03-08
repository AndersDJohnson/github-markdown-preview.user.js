/*jshint node:true */
/*global module: true, require: true */
module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: true
      },
      dev: {
        files: [
          {
            src: ['src/js/**/*.js']
          }
        ]
      }
    }

  });

};
