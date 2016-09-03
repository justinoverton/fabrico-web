module.exports = function (grunt) {
   
   grunt.initConfig({
      browserify: {
         dist: {
            options: {
               ignore: [
                  './node_modules/**/seedrandom/lib/*.js',
                  'crypto'
               ],
               browserifyOptions: {
                  standalone: 'app',
                  debug: true
               }
            },
            files: {
               "./web/js/app.js": ["./src/app.js"]
            }
         }
      },
      watch: {
         scripts: {
            files: ["./src/**/*.js"],
            tasks: ["browserify"]
         }
      }
   });

   grunt.loadNpmTasks("grunt-browserify");
   grunt.loadNpmTasks("grunt-contrib-watch");

   grunt.registerTask("default", ["watch"]);
   grunt.registerTask("build", ["browserify"]);
};