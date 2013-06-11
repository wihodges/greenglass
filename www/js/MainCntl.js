/*global myApp:false mode:false angular:false $:false  console:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

myApp.factory('IsoFilter', function() {
    function orKeys(filter, keys) {
        var b = false;
        keys.forEach(function(k) {
            b |= filter[k]; 
        });
        if (!b) {
            keys.forEach(function(k) {
                filter[k] = true;
            });
        }
        // console.log('checking ', keys, b);
        // return b; 
    }
    
    var defaultFilter = {
        now:false, order:false, sold:false,
        small:false, medium:false, large:false,
        under50:false, between50and100:false, over100:false,
        square:false, round:false, rectangle:false,
        standing:false, hanging:false,
        yes:true, no:false, archived:false
        ,grouped:false
    };
    
    
    var makeFilterString = function(filter) {
        var filterString = '.item';
            // console.log(filter);
        Object.keys(filter).forEach(function(f) {
            // console.log(f + ':' + $scope.filter[f]);
            if (!filter[f]) filterString += ':not(.' + f + ')';
        });
        return filterString + ':not(.undefined)';
    };
    
    var executeFilter = function (aFilter) {
        console.log('in executefilter!!!!! aFilter:', aFilter);
        var filter = {};
        Object.keys(aFilter).forEach(function(k) {
            filter[k]=aFilter[k];
        });
        console.log('copy:', filter);
        
        orKeys(filter, ['now', 'order', 'sold']);  
        orKeys(filter, ['small', 'medium', 'large']); 
        orKeys(filter, ['under50', 'between50and100', 'over100']); 
        orKeys(filter, ['square', 'round', 'rectangle']); 
        orKeys(filter, ['yes', 'no', 'archived' ]); 
        orKeys(filter, ['hanging', 'standing']);
        // orKeys(filter, ['deleted']);
        //      )) {
        //     $scope.filter[v] = true;
        //     console.log(v);
        //     return;
        // }
        
        var filterString = makeFilterString(filter);
        console.log(filterString);
        $('#imageDiv').isotope({ filter: filterString});
        
    };
    // var msgs = [];
    // return function(msg) {
    //   msgs.push(msg);
    //   if (msgs.length == 3) {
    //     win.alert(msgs.join("\n"));
    //     msgs = [];
    //   }
    // };
  // factory function body that constructs shinyNewServiceInstance
  return {
      defaultFilter: defaultFilter,
      executeFilter: executeFilter
  };
});

myApp.controller("MainCntl", function ($rootScope, IsoFilter, $location, $scope, $http) {
    
    console.log('In MainCntl');
    
    console.log('-------------',$location,  $location.$$url,
                $location.$$path, $location.$$hash, $location.$$search);
    initPersona($scope, $http);
    
    //whether we're on index.html (view) or edit.html (edit)
    //it changes the site somewhat, ultimate authority lies with the
    //server though.
    $scope.mode = mode;
    
    // $scope.info = "editable/care.html";
    
    $rootScope.$on('$locationChangeSuccess', function(event){
        console.log('location change');
        var path = $scope.path = $location.$$path;
        console.log('Path:', path, ' Hash:', $location.$$hash, ' Search:', $location.$$search);
        //edit or view mode;
        // var query = $location.$$search;
        // $scope.auth=query.auth;
        // $scope.blogMode= path ==='/blog';
        switch (path) {
          case '/gallery':
            setTimeout(function() {
                $("#imageDiv").isotope("reLayout");
                $("#selectContainer").isotope("reLayout");
            },1);
            break;
          case '/blog' :
            break;
          case '/info' :
            
            $scope.info = 'editable/' + $location.$$hash + '.html';
            $http({method: 'GET', url: $scope.info}).
                success(function(data, status, headers, config) {
                    console.log('received data, setting content');
                    $scope.content = data;
                    // $scope.$apply();
                    CKEDITOR.instances.editor2.setData( data, function() {
                        this.checkDirty(); // true
                    });
                    // $scope.$apply();
                    // this callback will be called asynchronously
                    // when the response is available
                }).
                error(function(data, status, headers, config) {
                    
                    $scope.content = 'Failed to get the text!!!';
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            break;
        default:  
        }
        // var url = $location.url(),
        //     params =$location.search();
    });
    
    if (!$location.$$path) $location.$$path = '/gallery';
    
    $scope.isCollapsed=true;
    
    $scope.enterLinkbar = function() {
        // console.log('enter linkbar');
        $scope.mouseoverControls='';
        $(".item").removeClass("mouseover");
        // descHover();
    };
    
    $scope.selectClicked = function($event) {
        $event.preventDefault();
        console.log('in selectclicked');
        $scope.isCollapsed = !$scope.isCollapsed;
        setTimeout(function() {
            if (!$scope.isCollapsed)   {
                $("#selectContainer").isotope("reLayout");
                // executeFilter($scope.filter);
                // $('#imageDiv').isotope('reloadItems');
            }
            else {
                console.log('closing select', IsoFilter.defaultFilter);
                $scope.allClicked();
                // executeFilter(defaultFilter);
                // $('#imageDiv').isotope('reloadItems');
                
            }
        },1);
        
    };
    
    $scope.allClicked = function($event) {
        $event.preventDefault();
        console.log('allClicked');
        $scope.isCollapsed = !$scope.isCollapsed;
        $scope.filter = (function() {
            var filter = {};
            Object.keys(IsoFilter.defaultFilter).forEach(function(k) {
                filter[k] = IsoFilter.defaultFilter[k];
            }); 
            return filter;
        })();
        $scope.filtered = 1; //one watch will be executed
        IsoFilter.executeFilter($scope.filter);
        $('#imageDiv').isotope('reloadItems');
        
    };
    
    
    $scope.signout = function($event) {
        $event.preventDefault();
        console.log('Logging out');
        navigator.id.logout();
        
    };
    
    $scope.signin = function($event) {
        $event.preventDefault();
        console.log('Logging in');
        navigator.id.request();
    };
    
    
    // $scope.click = function(link) {
    //     console.log(link);
    // };
}); 