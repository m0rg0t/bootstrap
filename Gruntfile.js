/* jshint node: true */

module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/**\n' +
              '* Bootstrap v<%= pkg.version %> by @fat and @mdo\n' +
              '* Copyright <%= "2013" %> <%= pkg.author %>\n' +
              '* Licensed under <%= pkg.licenses.map(function (license) { return license.url }).join(", ") %>.\n' +
              '*\n' +
              '* Designed and built with all the love in the world by @mdo and @fat.\n' +
              '*/\n',
    jqueryCheck: 'if (!jQuery) { throw new Error(\"Bootstrap requires jQuery\") }\n\n',

    // Task configuration.
    clean: {
      dist: ['dist']
    },

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc',
        // Preserve the original chained-bracket line breaks (legacy laxbreak style).
        '-W014': true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['js/*.js']
      },
      test: {
        src: ['js/tests/unit/*.js']
      }
    },

    concat: {
      options: {
        banner: '<%= banner %><%= jqueryCheck %>',
        stripBanners: false
      },
      bootstrap: {
        src: [
          'js/transition.js',
          'js/alert.js',
          'js/button.js',
          'js/carousel.js',
          'js/collapse.js',
          'js/dropdown.js',
          'js/modal.js',
          'js/tooltip.js',
          'js/popover.js',
          'js/scrollspy.js',
          'js/tab.js',
          'js/affix.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      bootstrap: {
        src: ['<%= concat.bootstrap.dest %>'],
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },

    copy: {
      fonts: {
        expand: true,
        src: ["fonts/*"],
        dest: 'dist/'
      }
    },

    watch: {
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
      recess: {
        files: 'less/*.less',
        tasks: ['recess']
      }
    }
  });


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Browser tests retain the original QUnit fixtures and assertions.
  grunt.registerTask('qunit', function () {
    var done = this.async();
    require('child_process').execFile(process.execPath, ['scripts/test-browser.cjs'], function (error, stdout, stderr) {
      grunt.log.write(stdout);
      if (stderr) grunt.log.error(stderr);
      done(!error);
    });
  });
  grunt.registerTask('recess', function () {
    var done = this.async();
    require('./scripts/build-css.cjs')().then(function () { done(); }, function (error) {
      grunt.log.error(error);
      done(false);
    });
  });
  grunt.registerTask('test', ['dist-css', 'jshint', 'qunit']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['recess']);

  // Fonts distribution task.
  grunt.registerTask('dist-fonts', ['copy']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-fonts', 'dist-js']);

  // Default task.
  grunt.registerTask('default', ['test', 'dist', 'build-customizer']);

  // task for building customizer
  grunt.registerTask('build-customizer', 'Add scripts/less files to customizer.', function () {
    var fs = require('fs')

    function getFiles(type) {
      var files = {}
      fs.readdirSync(type)
        .filter(function (path) {
          return type == 'fonts' ? true : new RegExp('\\.' + type + '$').test(path)
        })
        .forEach(function (path) {
          return files[path] = fs.readFileSync(type + '/' + path, 'utf8')
        })
      return 'var __' + type + ' = ' + JSON.stringify(files) + '\n'
    }

    var customize = fs.readFileSync('customize.html', 'utf-8')
    var files = getFiles('js') + getFiles('less') + getFiles('fonts')
    fs.writeFileSync('assets/js/raw-files.js', files)
  });
};