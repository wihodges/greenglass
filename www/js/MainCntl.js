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

myApp.controller("MainCntl", function (IsoFilter, $location, $scope) {
    $scope.isCollapsed=true;
    
    $scope.blogMode=$location.$$path==='/blog';
    console.log('-------------', $location);
    
    $scope.enterLinkbar = function() {
        console.log('enter linkbar');
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
    
    
}); 