/*global EpicCntl:false HomeCntl:false DefaultCntl:false EpicEditor:false $:false angular:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:6 maxcomplexity:10 maxlen:190 devel:true*/

angular.module('ngView', [], function($routeProvider, $locationProvider) {
    
    var baseDir = '/built/';
    var mapping =
        [
            inserthere
            // ['home', '/built/view-home.html', HomeCntl],
            // ['aboutus', '/build/markdown/aboutus.md'],
            // ['pd', '/built/view-pd.html'],
            // ['resources', '/build/markdown/resources.md'],
            // ['courses', '/built/view-courses.html'],
            // ['quiz', '/build/markdown/quiz.md'],
            // ['blog', '/build/markdown/blog.md'],
            // ['epic', '/built/view-epic.html', EpicCntl]

        ];
    if (!mapping || mapping.length === 0) {
        console.log("ngView module is loaded, but no routes defined!!!");
        return;
    }
    
    mapping.forEach(function(m) {
        $routeProvider.when('/' + m[0], { 
            templateUrl: '//' + document.location.host + m[1], controller: m[2] ? m[2] : 'DefaultCntl' });
    });
    
    $routeProvider.otherwise( { 
        templateUrl: '//' + document.location.host + mapping[0][1], controller: mapping[0][2] ? mapping[0][2] : 'DefaultCntl' });
    // templateUrl: '//' + document.location.host +
    //     '/built/view-gallery.html', controller: 'GalleryCntl' 
    // });
    
    $locationProvider.html5Mode(false);
    // console.log($locationProvider.hashPrefix());
    $locationProvider.hashPrefix( '!');
    // console.log($locationProvider.hashPrefix());
});
 

