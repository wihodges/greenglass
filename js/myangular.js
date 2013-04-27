/*global angular:false $:false jQuery:false console:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

var myApp= angular.module('myApp', ['ui', 'ui.bootstrap'])
    .directive('compile', function($compile) {
        // directive factory creates a link function
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function(value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);
 
                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        };

    });


function makeItem(item, size) {
    var imageName = "'" + item.name + "'";
    var classAttr = "item " + item.size + ' ' + item.buy  + ' ';
    if (item.price <= 50) classAttr += "below50";
    if (item.price > 50 && item.price <= 100) classAttr += "between50and100";
    if (item.price > 100) classAttr += "over100";
    var datas = ''; 
    datas += 'data-price=' + item.price + ' ';
    var clickEvent= 'ng-click="imageClicked($event)"';
    var editClick= 'ng-click="editImage(' + imageName +  ')"';
    var enterImage= 'ng-mouseenter="enterImage($event)"';
    var leaveDescr= 'ng-mouseleave="leaveDescr($event)"';
    var description = "<div class='descr'" + leaveDescr + 
        ">" +
        (true ? "Size: " + '{{getItem("' + item.name + '").size}}' + '<br>': '') +
        (true ? "Buy: " + '{{getItem("' + item.name + '").buy}}'  + '<br>': '') +
        (true ? "Price: $" + '{{getItem("' + item.name + '").price}}' + '<br>': '') +
        (true ? "Shape: " + '{{getItem("' + item.name + '").shape}}' + '<br>': '') +
        (true ? "Type: " + '{{getItem("' + item.name + '").type}}' + '<br>': '') +
        "<button class='btn btn-inverse'>View</button>" +
        "<button class='btn btn-inverse'" + editClick + " >Edit</button>" +
        (item.buy !== 'sold' ? "<button class='btn btn-inverse'>Buy</button>": '') +
        "</div>";
    
    return '<div '+ datas + 'class="' + classAttr +
        '">' +
        '<img  ' +  clickEvent + enterImage + 
        ' alt="" src="images/' + item.name + 
        '" width="' + size + '" height=auto;>' +
        description + 
        '</div>';
    
}

function imageClicked(event) {
    var url = event.target.src;
    var img = url.slice(url.lastIndexOf('/') + 1);
    console.log(img);
}


function getFileList(data) {
    var imageNames = [];
    var startOfList = data.indexOf('<ol>');
    if (startOfList === -1) startOfList = data.indexOf('<ul>');
    if (startOfList !== -1) {
        data = data.slice(startOfList);
        data=$(data);
        var aElements = data.find('a');
        Object.keys(aElements).forEach(function(i) {
            if (aElements[i] && aElements[i].getAttribute) {
                var imageName = aElements[i].getAttribute('href');
                var dot = imageName.lastIndexOf('.');
                if (dot !== -1) {
                    var ext = imageName.slice(dot+1).toLowerCase();
                    if (ext === 'jpg' || ext === 'png' )
                        imageNames.push(imageName) ;
                }
                
            }
            
        });
    }
    else {
        alert('No list found in fetched dir listing!!');
        console.log(data);
    }
    return imageNames;
} 

function descHover(event) {
    $(".item").removeClass("mouseover");
    // console.log("leaving!! desc");
}

function imageHover(event) {
    console.log(event);
    var url = event.target.src;
    var img = url.slice(url.lastIndexOf('/') + 1);
    console.log(img, images[img]);
    var target = event.target;
    var height =$(target).height();
    var width = $(target).width();
    var descr = $($(target).next());
    descr.height(height);
    descr.width(width);
    var item = $(event.target.parentNode);
    $(".item").removeClass("mouseover");
    item.addClass("mouseover");
    return images[img];
    // console.log("enter!!");
}


function getJson($scope, $http, path) {
    $http({method: 'GET', url: path}).
        success(function(data, status, headers, config) {
            var $container = $('#imageDiv');
            $container.isotope({
                itemSelector: '.item'
            });
            var $newItems = ''; 
            images={};
            if (!data || typeof data !== 'object') return;
            Object.keys(data).forEach(function(imgName) {
            // data.images.forEach(function(img) {
                $newItems += makeItem(data[imgName], 200);
            });
            $scope.itemsHtml = $newItems;
            images = data;
            
            setTimeout(function () {
                $('#imageDiv').isotope('reloadItems');
                $('#imageDiv').isotope({ filter: '*' }, function( $items ) {
                    var id = this.attr('id'),
                    len = $items.length;
                    console.log( 'Isotope has filtered for ' + len + ' items in #' + id );
                    // $('img').hover(imageHover);
                    // $('.item').find('div').hover(descHover);
                });
            }, 1);
            
            $('#imageDiv').isotope({
                getSortData : {
                    price : function ( $elem ) {
                        return parseInt($elem.attr('data-price'), 10);
                    }
                }
            });

            // $('img').click(imageClicked);
            
        }).
        error(function(data, status, headers, config) {
            console.log('Failed', status);
            alert('Failed to get listing.');
        });
    
    }

function attachDataToImages(images, data) {
    Object.keys(data).forEach(function(d) {
        if (images[d]) images[d] = data[d];
    }); 
    return images;
}

var images = {};
myApp.controller("mainCntl", function mainCntl($q, $location, $scope, $http) {
    console.log('in main');
    var getDir = function(path) {
        var deferred = $q.defer();
        console.log('Getting path:' + path);
        $http({method: 'GET', url: path}).
            success(function(data, status, headers, config) {
                var imageNames = getFileList(data);
                var imagesOnServer = {};
                imageNames.forEach(function(imgName) {
                    imagesOnServer[imgName] = {
                        name: imgName
                    };
                });
                deferred.resolve(imagesOnServer);
            }).
            error(function(data, status, headers, config) {
                deferred.reject("Failed to get " + path);
                console.log('Failed', status);
            });
        
        return deferred.promise;
    };
    
    var getImageData = function(imagesOnServer) {
        
        console.log('in getImageData', imagesOnServer);
        
        var deferred = $q.defer();
        $http({method: 'GET', url: '/terrariums.json'}).
            success(function(data, status, headers, config) {
                console.log('Image data in getImageData', data);
               //merge imagesOnServer and data 
                //and resolve the result
                deferred.resolve(attachDataToImages(imagesOnServer, data));
            
            }).
            error(function(data, status, headers, config) {
                console.log('Failed to get data on images in getImageData');
                deferred.resolve(imagesOnServer);
            });
        
        return deferred.promise;
    };

    function setIsotope(items) {
        console.log('in isotope', items);
        var $container = $('#imageDiv');
        $container.isotope({
            itemSelector: '.item'
        });
        var itemsHtml = ''; 
        Object.keys(items).forEach(function(imgName) {
            itemsHtml += makeItem(items[imgName], 200);
        });
        $scope.itemsHtml = itemsHtml;
            
        setTimeout(function () {
            $('#imageDiv').isotope('reloadItems');
            $('#imageDiv').isotope({ filter: '*' }, function( $items ) {
                var id = this.attr('id'),
                len = $items.length;
                console.log( 'Isotope has filtered for ' + len + ' items in #' + id );
                // $('img').hover(imageHover);
                // $('.item').find('div').hover(descHover);
            });
        }, 1000);
            
        $('#imageDiv').isotope({
            getSortData : {
                price : function ( $elem ) {
                    return parseInt($elem.attr('data-price'), 10);
                }
            }
        });

        // $('img').click(imageClicked);
        images = items;
    }
    //
    getDir('/images').
        then(getImageData).
        then( setIsotope
              ,function(data, status) {
                  console.log('Failed', status);
                  alert('Failed to retrieve an image list!!.');
              });
        
    $scope.saveItems = function() {
        console.log("Saving items to server");
        $http({method: 'POST', url: '/greenglass', data:images}).
            success(function(data, status, headers, config) {
                console.log(status, data);
            }).
            error(function(data, status, headers, config) {
                console.log('Failed', status);
                alert('Failed to post data.');
            });
        
    };
    $scope.enterImage = imageHover;
    $scope.leaveDescr = descHover;
    $scope.price = {
        left: false,
        middle: true,
        right: false
    };
    $scope.size = {
        left: false,
        middle: true,
        right: false
    };
    $scope.buy = {
        left: false,
        middle: true,
        right: false
    };
    $scope.type = {
        left: false,
        middle: true,
        right: false
    };
    $scope.shape = {
        left: false,
        middle: true,
        right: false
    };
    
    $scope.oneAtATime = true;
    
    $scope.editImage = function (imageName) {
        $scope.shouldBeOpen = true;
        $scope.item = images[imageName];
    };

    $scope.close = function () {
        $scope.shouldBeOpen = false;
    };
    $scope.save = function () {
        $scope.shouldBeOpen = false;
        
        $scope.item.price = $("#price").val();
        console.log($scope.item);
    };

    $scope.opts = {
        backdropFade: true,
        dialogFade:true
    };

    $scope.getItem = function(imgName) {
        return images[imgName];
    };
});

// angular.module('myModule', [], function($provide) {
//   $provide.factory('notify', ['$window', function(win) {
//     var msgs = [];
//     return function(msg) {
//       msgs.push(msg);
//       if (msgs.length == 3) {
//         win.alert(msgs.join("\n"));
//         msgs = [];
//       }
//     };
//   }]);
// });

// myAppModule.factory('mainScope', function() {
//   var shinyNewServiceInstance = { a:1 };
//     // var msgs = [];
//     // return function(msg) {
//     //   msgs.push(msg);
//     //   if (msgs.length == 3) {
//     //     win.alert(msgs.join("\n"));
//     //     msgs = [];
//     //   }
//     // };
//   //factory function body that constructs shinyNewServiceInstance
//   return shinyNewServiceInstance;
// });

// var TabsDemoCtrl = function ($scope) {
//   $scope.panes = [
//     { title:"Dynamic Title 1", content:"Dynamic content 1" },
//     { title:"Dynamic Title 2", content:"Dynamic content 2" }
//   ];
// };

// myAppModule.value('ui.config', {
//    // The ui-jq directive namespace
//    jq: {
//       // The Tooltip namespace
//       tooltip: {
//          // Tooltip options. This object will be used as the defaults
//          placement: 'left'
//       }
//    }
// });

// function AccordionDemoCtrl($scope) {
//   $scope.oneAtATime = true;

//   $scope.groups = [
//     {
//       title: "Dynamic Group Header - 1",
//       content: "Dynamic Group Body - 1"
//     },
//     {
//       title: "Dynamic Group Header - 2",
//       content: "Dynamic Group Body - 2"
//     }
//   ];

//   $scope.items = ['Item 1', 'Item 2', 'Item 3'];

//   $scope.addItem = function() {
//     var newItemNo = $scope.items.length + 1;
//     $scope.items.push('Item ' + newItemNo);
//   };
// }

// function initScrollToTop() {
    
//     jQuery('#bla').click(function(){
//         console.log('clicked scroll to top');
//         jQuery("html, body").animate({
//             scrollTop: 110
//         }, 700);
//         return false;
//     });

//     jQuery(window).scroll(function(){
//         if (jQuery(this).scrollTop() > 100) {
//             jQuery('#scroll-to-top').fadeIn();
//         } else {
//             jQuery('#scroll-to-top').fadeOut();
//         }
//     }); 
    
// }

// function scrollOnClick() {
    
//     $(".scroll").click(function(event){
        
//         // console.log('click on scroll');
//         //prevent the default action for the click event
//         event.preventDefault();
        
//         //get the full url - like mysitecom/index.htm#home
//         var full_url = this.href;
        
//         //split the url by # and get the anchor target name - home in mysitecom/index.htm#home
//         var parts = full_url.split("#");
//         // console.log(parts);
//         var trgt = parts[parts.length-1];
        
//         if (trgt[0] === '!') return;
//         //get the top offset of the target anchor
//         var target_offset = $("#"+trgt).offset();
//         if (target_offset) {
//             var target_top = target_offset.top-50;
//             // console.log(target_offset);
//             //     //goto that anchor by setting the body scroll top to anchor top
//             $('html, body').animate({scrollTop:target_top }, 1000, 'easeOutQuad');
//         }
//     });
// }


// function DefaultCntl($scope) {
//     console.log('In DefaultCntl');
//     // console.log('Targets', $('body').find("#menu-- .nav li > a"));
//     initScrollToTop();
    
//     //any href with class scroll with smoothly scroll to the #target
//     scrollOnClick(); 
    
//     //Fix menu, but let it scroll to the top
//     var $window = $(window);
//     $('.bs-docs-sidenav').affix({
//         offset: {
//             top: function () { return $window.width() <= 980 ? 210 : 110 }
//             // , bottom: 270
//             , bottom:0 
//         }
//     });
    
//     //spy on the scrolling body and match data-target in #menu-- 
//     $('body').scrollspy({target: '#menu--', offset:60});
    
// }


