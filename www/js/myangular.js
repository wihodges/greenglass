/*global mode:false angular:false $:false jQuery:false console:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

// var mode = 'edit';
// var mode = 'edit';
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

function AlertDemoCtrl($scope) {
}


function makeItem(item, size) {
    var imageName = "'" + item.name + "'";
    var classAttr = "item " +
        (item.size ? item.size + ' ': '') +
        (item.shape ? item.shape + ' ': '') +
        (item.buy ? item.buy + ' ': '') +
        (item.published ? item.published + ' ': 'no') +
        (item.type ? item.type + ' ': '');
    
    if (item.price <= 50) classAttr += "below50";
    if (item.price > 50 && item.price <= 100) classAttr += "between50and100";
    if (item.price > 100) classAttr += "over100";
    
    
    var datas = ''; 
    datas += 'data-price=' + item.price + ' ';
    datas += 'data-id=' + item.id + ' ';
    
    
    var clickEvent= 'ng-click="imageClicked($event)"';
    var editClick= 'ng-click="editImage(' + imageName +  ')"';
    var viewClick= 'ng-click="viewImage(' + imageName +  ')"';
    var buyClick= 'ng-click="buyItem(' + imageName +  ')"';
    var removeFromCartClick= 'ng-click="removeFromCartByName(' + imageName +  ')"';
    var enterImage= 'ng-mouseover="enterImage($event)"';
    var leaveDescr= 'ng-mouseleave="leaveDescr($event)"';
    var description = "<div class='descr'" + leaveDescr + 
        ">" +
        (item.size ? "Size: " + '{{getItem("' + item.name + '").size}}' + '<br>': '') +
        (item.buy ? "Buy: " + '{{getItem("' + item.name + '").buy}}'  + '<br>': '') +
        (item.price ? "Price: $" + '{{getItem("' + item.name + '").price}}' + '<br>': '') +
        (item.shape ? "Shape: " + '{{getItem("' + item.name + '").shape}}' + '<br>': '') +
        (item.typ ? "Type: " + '{{getItem("' + item.name + '").type}}' + '<br>': '') +
        (mode === 'edit' ?
         "Published: " + '{{getItem("' + item.name + '").published}}' + '<br>': '') +
        (mode === 'edit' ?
         "ID: " + '{{getItem("' + item.name + '").id}}' + '<br>': '') +
        
        "<button class='btn btn-inverse'" + viewClick + ">View</button>" +
        (mode === 'edit' ?
         "<button class='btn btn-inverse'" + editClick + " >Edit</button>" : '') +
        (item.buy !== 'sold' ?
         "<button ng-show=" + '"!getItem(' + "'" + item.name  + "'" + ').inCart"' +
         " class='btn btn-inverse'" + buyClick + ">Buy</button>": '') +
        (item.buy !== 'sold' ?
         "<button ng-show=" + '"getItem(' + "'" + item.name  + "'" + ').inCart"' +
         " class='btn btn-inverse'" + removeFromCartClick + ">Cancel</button>": '') +
    
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
    // console.log(event);
    var url = event.target.src;
    var img = url.slice(url.lastIndexOf('/') + 1);
    // console.log(img, images[img]);
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


// function getJson($scope, $http, path) {
//     $http({method: 'GET', url: path}).
//         success(function(data, status, headers, config) {
//             var $container = $('#imageDiv');
//             $container.isotope({
//                 itemSelector: '.item'
//             });
//             var $newItems = ''; 
//             images={};
//             if (!data || typeof data !== 'object') return;
//             Object.keys(data).forEach(function(imgName) {
//             // data.images.forEach(function(img) {
//                 $newItems += makeItem(data[imgName], 100);
//             });
//             $scope.itemsHtml = $newItems;
//             images = data;
            
//             setTimeout(function () {
//                 $('#imageDiv').isotope('reloadItems');
//                 $('#imageDiv').isotope({ filter: '*' }, function( $items ) {
//                     var id = this.attr('id'),
//                     len = $items.length;
//                     console.log( 'Isotope has filtered for ' + len + ' items in #' + id );
//                     // $('img').hover(imageHover);
//                     // $('.item').find('div').hover(descHover);
//                 });
//             }, 1);
            
//             $('#imageDiv').isotope({
//                 getSortData : {
//                     price : function ( $elem ) {
//                         return parseInt($elem.attr('data-price'), 10);
//                     }
//                 }
//             });

//             // $('img').click(imageClicked);
            
//         }).
//         error(function(data, status, headers, config) {
//             console.log('Failed', status);
//             alert('Failed to get listing.');
//         });
    
//     }

function attachDataToImages(images, data) {
    Object.keys(data).forEach(function(d) {
        if (images[d]) images[d] = data[d];
    }); 
    return images;
}

var images = {};
myApp.controller("mainCntl", function mainCntl($q, $location, $scope, $http) {
    // $("a[rel^='prettyPhoto']").prettyPhoto();
    var zoom = 200;
    $scope.mode = mode;
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
            itemsHtml += makeItem(items[imgName], zoom);
        });
        $scope.itemsHtml = itemsHtml;
            
        setTimeout(function () {
            $('#imageDiv').isotope('reloadItems');
            $('#imageDiv').isotope({ filter: makeFilterString() }, function( $items ) {
                var id = this.attr('id'),
                    len = $items.length;
                console.log( 'Isotope has filtered for ' + len + ' items in #' + id );
                // $('img').hover(imageHover);
                // $('.item').find('div').hover(descHover);
            });
        }, 1000);
        
        function getAttr(e, array) {
            for (var i = 0; i < array.length; i++) {
                // console.log(e.attr("class"));
                // console.log('Checking: ' + array[i], e.context.className.toString());
                if (e.context.className.toString().indexOf(array[i]) !== -1) return i;
            }
            return 10;
        }
            
        $('#imageDiv').isotope({
            getSortData : {
                price : function ( $elem ) {
                    // console.log( parseInt($elem.attr('data-price'), 10));
                    var n = parseInt($elem.attr('data-price'), 10);
                    if (typeof n === 'number') return n+'';
                    return '';
                }
                ,id : function ( $elem ) {
                    // console.log( parseInt($elem.attr('data-price'), 10));
                    return $elem.attr('data-id');
                    // var n = parseInt($elem.attr('data-id'), 10);
                    // if (typeof n === 'number') return n+'';
                    // return '';
                }
                ,shape : function ( $elem ) {
                    return getAttr($elem, ["square", "round", "rectangle"]);
                }
                ,type : function ( $elem ) {
                    return getAttr($elem, ["standing", "hanging"]);
                }
                ,size : function ( $elem ) {
                    return getAttr($elem, ["small", "medium", "large"]);
                }
                ,buy : function ( $elem ) {
                    return getAttr($elem, ["now", "order", "sold"]);
                }
                ,published : function ( $elem ) {
                    // console.log($elem, getAttr($elem, ["yes", "no"]));
                    return getAttr($elem, ["yes", "no"]);
                }
            }
        });

        // $('img').click(imageClicked);
        images = items;
    }
    //
        
    $scope.saveItems = function() {
        console.log("Saving items to server");
        $scope.cart.forEach(function(c) {
            c.inCart = false;
        }); 
        $http({method: 'POST', url: '/greenglass', data:images}).
            success(function(data, status, headers, config) {
                console.log(status, data);
                $scope.cart.forEach(function(c) {
                    c.inCart = true;
                }); 
            }).
            error(function(data, status, headers, config) {
                console.log('Failed', status);
                alert('Failed to post data.');
            });
        
    };
    $scope.enterImage = imageHover;
    $scope.leaveDescr = descHover;

    $scope.filter = {
        now:true, order:true, sold:true,
        small:true, medium:true, large:true,
        under50:true, between50and100:true, over100:true,
        square:true, round:true, rectangle:true,
        standing:true, hanging:true,
        yes:true, no:false
    };
    function orKeys(keys) {
        var b = false;
        keys.forEach(function(k) {
            b |= $scope.filter[k]; 
        });
        console.log('checking ', keys, b);
        return b; 
    }
    
    var makeFilterString = function() {
        var filterString = '.item';
        Object.keys($scope.filter).forEach(function(f) {
            // console.log(f + ':' + $scope.filter[f]);
            if (!$scope.filter[f]) filterString += ':not(.' + f + ')';
        });
        return filterString + ':not(.undefined)';
    };
    
    var executeFilter = function (v) {
        console.log($scope.filter);
        if (!(orKeys(['now', 'order', 'sold']) && 
              orKeys(['small', 'medium', 'large']) &&
              orKeys(['under50', 'between50and100', 'over100']) &&
              orKeys(['square', 'round', 'rectangle']) &&
              orKeys(['yes', 'no' ]) &&
              orKeys(['hanging', 'standing'])
             )) {
            $scope.filter[v] = true;
            console.log(v);
            return;
        }
        
        var filterString = makeFilterString();
        console.log(filterString);
        $('#imageDiv').isotope({ filter: filterString});
        
    };
    
    $scope.$watch('filter',
                  function(newValue, oldValue) {
                      console.log('changed!!!', newValue, oldValue);
                      var keys = Object.keys(newValue);
                      for (var i=0; i<keys.length; i++) {
                          if (newValue[keys[i]] !== oldValue[keys[i]])
                          { executeFilter(keys[i]);
                            break;
                          }
                      }

                      
                  },
                  true);
    
    $scope.oneAtATime = true;
    
    $scope.editImage = function (imageName) {
        $scope.shouldBeOpen = true;
        $scope.item = images[imageName];
    };
    
    $scope.cart = [];
    $scope.buyItem = function (imageName) {
        var item = images[imageName];
        if (item.inCart) {
            $scope.addAlert('Terrarium already in cart!', 'error');
            return;
        }
        $scope.cart.push(item); 
        item.inCart = true;
        $scope.addAlert('Terrarium added to cart!', 'success');
        console.log('Cart: ', $scope.cart);
    };
    
    $scope.getCartTotal = function() {
        var total = 0;
        $scope.cart.forEach(function(c) {
            console.log(c.price);
            var n = parseInt(c.price, 10);
            if (typeof n === 'number') 
                total += n;
        }); 
        return total;
    };
    
    $scope.removeFromCartByName = function(imageName) {
        $scope.removeFromCart(images[imageName]);
    };
    
    $scope.removeFromCart = function(item) {
        console.log(item);
        item.inCart=false;
        var newCart = [];
        $scope.cart.forEach(function(c) {
            if (c !== item) newCart.push(c);
        }); 
        $scope.cart = newCart;
    };
    
    $scope.close = function () {
        $scope.shouldBeOpen = false;
        $scope.saveItems();
    };
    
    $scope.viewImage = function (imageName) {
        // $.fancybox([
	//     {
        //         href : 'fullsize/frommamaipad020'
        //         , title : 'Title'},
	//     {href : 'fullsize/frommamaipad021' , title : 'Title'}
            
        // ]);
        
    
        $.fancybox.open([
            {
                    
                href : 'fullsize/' + imageName
                // ,title : 'manual 1st title'
            }
        ], {
            // nextEffect : 'none',
            // prevEffect : 'none',
            // padding    : 0,
            helpers    : {
                title : {
                    type: 'under'  
                },
                thumbs : {
                    width  : 75,
                    height : 50,
                    source : function( item ) {
                        return item.href.replace('fullsize', 'images');
                    }
                }
            }
        });
    
        // $scope.viewShouldBeOpen = true;
        // $scope.item = images[imageName];
        
        // var data = [
        //     {
        //         image: 'images/' + imageName,
        //         // thumb: 'thumb1.jpg',
        //         big: 'images/' + imageName,
        //         title: 'Title',
        //         description: 'Description'
        //         // link: 'www.google.com'
        //     }
        // ];

        // Galleria.run('#galleria', {
        //     dataSource: data
        // });
    };

    $scope.closeGalleria = function () {
        $scope.viewShouldBeOpen = false;
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
    
    $scope.zoomin = function() {
        if (zoom > 400) return;
        zoom += 30;
        $(".item img").attr("width",zoom);
        $("#imageDiv").isotope("reLayout");
    };
    
    $scope.zoomout = function() {
        if (zoom < 60) return;
        zoom -= 30;
        
        $(".item img").attr("width",zoom);
        $("#imageDiv").isotope("reLayout");
    };
    
    var sortOrder = {
        price: false,
        shape: false,
        buy: false,
        size: false,
        type: false,
        published: false
    };
    
    $scope.sortOrder = {
        price: '',
        shape: '',
        buy: '',
        size: '',
        type: '',
        published: ''
    };
    
    $scope.sortBy = function(by) {
        $scope.sortOrder = {
            price: '',
            shape: '',
            buy: '',
            size: '',
            type: '',
            published: ''
        };
        sortOrder[by] ^= true;
        $scope.sortOrder[by] = sortOrder[by] ? '  .:' : ':.';
        console.log("sorting: " + by, sortOrder[by]);
        
        $('#imageDiv').isotope({ sortBy : by,
                                 sortAscending : sortOrder[by]
                               });
    };
    
    $scope.enterSidebar = function() {
        console.log('enter sidebar');
        $scope.mouseoverControls='mouseover';
        $(".item").removeClass("mouseover");
        // descHover();
    };
    $scope.enterLinkbar = function() {
        console.log('enter linkbar');
        $scope.mouseoverControls='';
        $(".item").removeClass("mouseover");
        // descHover();
    };
    
    $scope.clickIsotope= function() {
        console.log('enter isotop');
        $scope.mouseoverControls='';
        $(".item").removeClass("mouseover");
        // descHover();
    };
    
    
    $scope.alerts = [
        // { type: 'error', msg: 'Oh snap! Change a few things up and try submitting again.' }, 
        // { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];

    $scope.addAlert = function(msg, type) {
        var alert = {msg: msg, type: type};
        $scope.alerts.push(alert);
        // console.log(index);
        
        setTimeout(function() {
            var alerts = [];
            // console.log('closing alert ', index);
            $scope.alerts.forEach(function(a) {
                if (a !== alert) alerts.push(a);
            });
            $scope.alerts = alerts;
            $scope.$apply();
            // $scope.alerts.splice(index, 1);
        },3000);
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    
    $(".ajax").fancybox({
	maxWidth	: 800,
	maxHeight	: 600,
	fitToView	: false,
	width		: '70%',
	height		: '70%',
	autoSize	: false,
	closeClick	: false,
	openEffect	: 'none',
	closeEffect	: 'none'
    });
    
    getDir('/images').
        then(getImageData).
        then( setIsotope
              ,function(data, status) {
                  console.log('Failed', status);
                  alert('Failed to retrieve an image list!!.');
              });
    
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


