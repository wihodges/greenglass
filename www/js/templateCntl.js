/*global angular:false $:false jQuery:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

function templateCntl($scope) {
    console.log('in template');
    var items = [];
    var anItem = {
        type: 'text'  //or table, or calendar
        ,isSection: false
        ,title: 'my first item'
        ,content: 'and this is the content'
    };
    $scope.items = items;
}
