
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // uglify: {
    //   options: {
    //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    //   },
    //   build: {
    //     src: 'src/<%= pkg.name %>.js',
    //     dest: 'build/<%= pkg.name %>.min.js'
    //   }
    // }

    // livereload  : {
    //   options   : {
    //     base    : 'public',
    //   },
    //   files     : ['public/**/*']
    // }

    //TODO: NOT WORKING YET? WHY?
    less:{
      options: {
        paths: ['less'] //dir to scan for @import directives
      },
      src:{
        expand: true,
        cwd:    "less",
        dest:    "public/layouts",
        src:    "*.less",
        ext:    ".css"
      }
    },
    watch: {
      options: {
        livereload: true
      },
      scripts: {
        files: ['public/**/*.js']
        //tasks: ['jshint']
      },
      less: {
        files: ['less/**/*.less'],
        tasks: ['less']
      }
    }

  });

  // Load the plugin that provides the "uglify" task.
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-livereload');

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['less','watch']);

};