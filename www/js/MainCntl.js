/*global myApp:false mode:false angular:false $:false  console:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

myApp.controller("MainCntl", function ($rootScope, IsoFilter, cart, $location, $scope, $http) {
    $scope.cart = cart;
    var wasCollapsed;
    $scope.checkout = function() {
        cart.checkout();
        $('#imageDiv').isotope({ filter: ".incart"});
        wasCollapsed = $scope.isCollapsed;
        $scope.isCollapsed = true;
        // IsoFilter.executeFilter();
        setTimeout( function() {
            $('#imageDiv').isotope('reLayout');;
        },100);
        
    };
    
    $scope.cancel = function() {
        $scope.cart.checkingout = false;
        var applyFilter;
        if (wasCollapsed) {
            applyFilter = (function() {
                    var filter = {};
                Object.keys(IsoFilter.defaultFilter).forEach(function(k) {
                    filter[k] = IsoFilter.defaultFilter[k];
                }); 
                return filter;
            })();
            
        }
        else {
            $scope.isCollapsed = false;
            applyFilter = IsoFilter.filter;
        }
        IsoFilter.executeFilter(applyFilter);
        $('#imageDiv').isotope('reloadItems');
    };
    
    
    
    
    // $scope.test = function($event) {
    //     $event.preventDefault();
    //     console.log('testing');
        
    //     $scope.filter = (function() {
    //         var filter = {};
    //         Object.keys(IsoFilter.defaultFilter).forEach(function(k) {
    //             filter[k] = IsoFilter.defaultFilter[k];
    //         }); 
    //         return filter;
    //     })();
    //     $('#imageDiv').isotope('reloadItems');
    //         $('#imageDiv').isotope({ filter: "*" }, function( $items ) {
    //                 var id = this.attr('id'),
    //             len = $items.length;
    //             console.log( 'Isotope has filtered for ' + len + ' items in #' + id );
    //             // $('img').hover(imageHover);
    //             // $('.item').find('div').hover(descHover);
    //         });
    //     // IsoFilter.executeFilter($scope.filter);
        
    // };
    
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
            // setTimeout(function() {
            //     $("#imageDiv").isotope("reLayout");
                // $("#selectContainer").isotope("reLayout");
            // },1);
            break;
          case '/blog' :
            break;
          case '/info' :
            function saveDirty(cb) {
    
                var isDirty = CKEDITOR.instances.editor2.checkDirty();
                console.log('isDirty', isDirty);
                if (CKEDITOR.instances.editor2.checkDirty() &&
                    confirm('Do you want to save the changes you have made to this text?')) {
                    $scope.saveText(cb);
                }
                else cb();
            }

            saveDirty(function() {
                $scope.info = 'editable/' + $location.$$hash + '.html';
                $http({method: 'GET', url: $scope.info}).
                    success(function(data, status, headers, config) {
                        console.log('received data, setting content');
                        $scope.content = data;
                        // $scope.$apply();
                        CKEDITOR.instances.editor2.setData( data, function() {
                            // this.checkDirty(); // true
                            this.resetDirty();
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
        $scope.cart.checkingout = false;
        console.log('in selectclicked');
        $scope.isCollapsed = !$scope.isCollapsed;
        setTimeout(function() {
            if (!$scope.isCollapsed)   {
                IsoFilter.executeFilter(IsoFilter.filter || IsoFilter.defaultFilter);
                $("#selectContainer").isotope("reLayout");
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
        var filter = (function() {
            var filter = {};
            Object.keys(IsoFilter.defaultFilter).forEach(function(k) {
                filter[k] = IsoFilter.defaultFilter[k];
            }); 
            return filter;
        })();
        $scope.filtered = 1; //one watch will be executed
        IsoFilter.executeFilter(filter);
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
    
    $scope.cancelAdding = function() {
        $scope.addingImages = false;
        IsoFilter.saveItems();
    };
    
    
}); 