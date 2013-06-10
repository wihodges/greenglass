/*global PAYPAL:false mode:false angular:false $:false  console:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

function makeItem(item, size) {
    var imageName = "'" + item.name + "'";
    var classAttr = "item " +
        (item.size ? item.size + ' ': '') +
        (item.shape ? item.shape + ' ': '') +
        (item.buy ? item.buy + ' ': '') +
        (item.published ? item.published + ' ': 'no ') +
        (item.groupedWith ? 'grouped' + ' ': '') +
        (item.type ? item.type + ' ': '');
    
    if (item.price <= 50) classAttr += "under50";
    if (item.price > 50 && item.price <= 100) classAttr += "between50and100";
    if (item.price > 100) classAttr += "over100";
    
    
    var datas = ''; 
    datas += 'data-id="{{getItem(\'' + item.name + '\').id}}" ';
    datas += 'data-price="{{getItem(\'' + item.name + '\').price}}" ';
    datas += 'id=' + item.elId + ' ';
    
    
    var clickEvent= 'ng-click="imageClicked($event)"';
    var editClick= ' ng-click="editImage(' + imageName +  ')"';
    var viewClick= ' ng-click="viewImage(' + imageName +  ')"';
    var buyClick= 'ng-click="buyItem(' + imageName +  ')"';
    var removeFromCartClick= 'ng-click="removeFromCartByName(' + imageName +  ')"';
    var enterImage= 'ng-mouseover="enterImage($event)"';
    var leaveDescr= 'ng-mouseleave="leaveDescr($event)"';
    // var descrStyle = ' style="position:relative"';
    // console.log(background);
    var description = "<div class='descr'" + leaveDescr +// descrStyle +
    (mode === 'edit' ? editClick : viewClick) +
        ">" +
        '<div id="descrContainer" class="well">' +
        // (item.size ? "Size: " + '{{getItem("' + item.name + '").size}}' + '<br>': '') +
        // (item.buy ? "Buy: " + '{{getItem("' + item.name + '").buy}}'  + '<br>': '') +
        // (item.price ? "Price: $" + '{{getItem("' + item.name + '").price}}' + '<br>': '') +
        // (item.shape ? "Shape: " + '{{getItem("' + item.name + '").shape}}' + '<br>': '') +
        // (item.typ ? "Type: " + '{{getItem("' + item.name + '").type}}' + '<br>': '') +
        
        (true ? "Size: " + '{{getItem(\'' + item.name + '\').size}}' + '<br>': '') +
        (true ? "Buy: " + '{{getItem("' + item.name + '").buy}}'  + '<br>': '') +
        (true ? "Price: $" + '{{getItem("' + item.name + '").price}}' + '<br>': '') +
        (true .shape ? "Shape: " + '{{getItem("' + item.name + '").shape}}' + '<br>': '') +
        (true ? "Type: " + '{{getItem("' + item.name + '").type}}' + '<br>': '') +
        (mode === 'edit' ?
         "Published: " + '{{getItem("' + item.name + '").published}}' + '<br>': '') +
        (mode === 'edit' ?
         "ID: " + '{{getItem("' + item.name + '").id}}' + '<br>': '') +
        
        // "<button class='btn btn-inverse'" + viewClick + ">View</button>" +
        // (mode === 'edit' ?
        //  "<button class='btn btn-inverse'" + editClick + " >Edit</button>" : '') +
        // (item.buy !== 'sold' ?
        //  "<button ng-show=" + '"!getItem(' + "'" + item.name  + "'" + ').inCart"' +
        //  " class='btn btn-inverse'" + buyClick + ">"+ (item.buy === 'now' ? 'Buy Now' : 'On order') +"</button>": '') +
        // (item.buy !== 'sold' ?
        //  "<button ng-show=" + '"getItem(' + "'" + item.name  + "'" + ').inCart"' +
        //  " class='btn btn-inverse'" + removeFromCartClick + ">Cancel</button>": '') +
    
        "</div>" +
        "</div>";
    
    
    
    return '<div '+ datas +
        // 'class="' + classAttr +
        'ng-class="getItemClasses(\'' + item.name + '\')"' + 
        '">' +
        '<img  ' +  viewClick + enterImage + 
        ' alt="" src="images/' + item.name + 
        '" width="' + size + 'px;" height=auto;>' +
        description + 
        '</div>';
    
}

function imageClicked(event) {
    console.log('imageClicked');
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
    if (mode !== 'edit') return;
    // return;
    // console.log(event);
    // var url = event.target.src;
    // console.log(url);
    // var img = url.slice(url.lastIndexOf('/') + 1);
    // console.log(img, images[img]);
    var target = event.target;
    var height =$(target).height();
    var width = $(target).width();
    var descr = $($(target).next());
    
    descr.height(height);
    descr.width(width);
    window.test=descr;
    descr.css("margin-top", "-" + height + "px");
    var item = $(event.target.parentNode);
    $(".item").removeClass("mouseover");
    // descr.css("display", "block")
    item.addClass("mouseover");
    // return images[img];
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
    if (data)
        Object.keys(data).forEach(function(d) {
            if (images[d]) {
                images[d] = data[d];
                if (!images[d].images) images[d].images = [images[d].name];
                if (!images[d].published) images[d].published = 'no';
            }
         }); 
    return images;
}

var images = {};
myApp.controller("GalleryCntl", function (IsoFilter, $q, $location, $scope, $http) {
    var defaultFilter = IsoFilter.defaultFilter;
    var executeFilter = IsoFilter.executeFilter;
    // $("a[rel^='prettyPhoto']").prettyPhoto();
    var zoom = 200;
    $scope.mode = mode;
    console.log('in Gallery controller');
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
                        ,images: [imgName]
                        ,mainImage: imgName
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
        
        console.log('in imagesOnServer', imagesOnServer);
        
        var deferred = $q.defer();
        $http({method: 'GET', url: 'terrariums.json'}).
            success(function(data, status, headers, config) {
                console.log('Image data', data);
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
    function setSelectIsotope() {
        console.log('in select isotope');
        var $container = $('#selectContainer');
        $container.isotope({
            itemSelector: '.selector'
        });
        setTimeout(function () {
            $('#selectContainer').isotope('reloadItems');
            $('#selectContainer').isotope({ filter: "*" }, function( $items ) {
                var id = this.attr('id'),
                    len = $items.length;
                console.log( 'Isotope has filtered for ' + len + ' items in #' + id );
                // $('img').hover(imageHover);
                // $('.item').find('div').hover(descHover);
            });
        },100); 
    }
    
    // function groupById(items) {
    //     var grouped = {};
    //     Object.keys(items).forEach(function(item) {
            
    //     });
        
    // }

    function setIsotope(items) {
        
        console.log('Showing isotope images:', items);
            var $container = $('#imageDiv');
        $container.isotope({
            itemSelector: '.item'
        });
        var itemsHtml = ''; 
        var i = 0;
        Object.keys(items).forEach(function(imgName) {
            items[imgName].elId = 'img' + i++;
            itemsHtml += makeItem(items[imgName], zoom);
        });
        $scope.itemsHtml = itemsHtml;
            
        setTimeout(function () {
            $('#imageDiv').isotope('reloadItems');
            executeFilter(defaultFilter);
            // $('#imageDiv').isotope({ filter: makeFilterString() }, function( $items ) {
            //     var id = this.attr('id'),
            //     len = $items.length;
            //     console.log( 'Isotope has filtered for ' + len + ' items in #' + id );
            //     // $('img').hover(imageHover);
            //     // $('.item').find('div').hover(descHover);
            // });
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
                    return getAttr($elem, ["yes", "no", "archived"]);
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
                console.log('Failed', status, data, headers, config);
                console.log('Failed to post data.');
            });
        
    };
    $scope.enterImage = imageHover;
    $scope.leaveDescr = descHover;
    

    $scope.filter = (function() {
        var filter = {};
        Object.keys(defaultFilter).forEach(function(k) {
            filter[k] = defaultFilter[k];
        }); 
        return filter;
    })();
    
    
    
    
    $scope.filtered = 0;
    $scope.$watch('filter',
                  function(newValue, oldValue) {
                      
                      console.log('changed!!!', newValue, oldValue);
                      var keys = Object.keys(newValue);
                      for (var i=0; i<keys.length; i++) {
                          if (newValue[keys[i]] !== oldValue[keys[i]])
                          {
                              if (newValue[keys[i]] !== defaultFilter[keys[i]]) $scope.filtered++;
                              else $scope.filtered--;
                              console.log($scope.filtered);
                              
                              executeFilter(newValue);
                            break;
                          }
                      }

                      
                  },
                  true);
    
    $scope.oneAtATime = true;
    
    
    $scope.editImage = function (imageName) {
        if (descrButtonClicked) {
            descrButtonClicked = false;
            return;
        }
        console.log('in editimage');
        if ($scope.addingImages) {
            if ($scope.item.images.indexOf(imageName) === -1) {
                images[imageName].groupedWith = $scope.item.name;
                $scope.item.images.push(imageName);
                
            }
            else {
                $scope.addAlert('Already added!!', 'error', 3000);
                return;
            }
        }
        else {
            var groupedWith = images[imageName].groupedWith;
            // if (groupedWith) {
            //     $scope.item = images[groupedWith];
            // }
            // else $scope.item = images[imageName];   
            $scope.item = images[groupedWith || imageName];
        }
        $scope.addingImages = false;
        $scope.shouldBeOpen = true;
        
    };
    
    $scope.cart = [];
    var descrButtonClicked = false;
    $scope.buyItem = function (imageName) {
        console.log('in buy item');
        var item = images[imageName];
        var data ={"business":"michieljoris@gmail.com","item_name":'myitem',"amount":"45","currency_code":"AUD"};
        console.log(data);
            
        PAYPAL.apps.MiniCart.addToCart(data);
        setTimeout(function() {
        PAYPAL.apps.MiniCart.show();
            
        },100);
        
        return;
        
        console.log('in buy item');
        // var item = images[imageName];
        if (item.inCart) {
            $scope.addAlert('Terrarium already in cart!', 'error', 3000);
            return;
        }
        $scope.cart.push(item); 
        item.inCart = true;
        // $scope.addAlert('Terrarium added to cart!', 'success', 3000);
        console.log('Cart: ', $scope.cart);
        descrButtonClicked = true;
        
    };
    
    $scope.getCartTotal = function() {
        var total = 0;
        $scope.cart.forEach(function(c) {
            // console.log(c.price);
            var n = parseInt(c.price, 10);
            if (typeof n === 'number') 
                total += n;
        }); 
        return total;
    };
    
    $scope.removeFromCartByName = function(imageName) {
        
        descrButtonClicked = true;
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
    
    $scope.getItemClasses = function(itemName) {
        var item = images[itemName];
        var classes = 'item ' +
            (item.size ? item.size + ' ': '') +
            (item.shape ? item.shape + ' ': '') +
            (item.buy ? item.buy + ' ': '') +
            (item.published ? item.published + ' ': 'no ') +
            (item.groupedWith ? 'grouped' + ' ': '') +
            (item.type ? item.type + ' ': '');
    
        if (item.price <= 50) classes += "under50";
        if (item.price > 50 && item.price <= 100) classes += "between50and100";
        if (item.price > 100) classes += "over100";
        
        return classes;
        // var datas = ''; 
        // datas += 'data-price=' + item.price + ' ';
        // datas += 'data-id=' + item.id + ' ';
        
        
    };
    $scope.okthen = true;
    
    $scope.closeEdit = function (itemName) {
        console.log('closing');
        $scope.shouldBeOpen = false;
        $scope.addingImages = false ;
        $scope.saveItems();
        // setIsotope(images);
        executeFilter($scope.filter);
        // var item = images[itemName];
        // console.log('images', images, item);
        // var descr = '<div id="descrContainer" class="well">' +
        //     (item.size ? "Size: " + '{{getItem("' + item.name + '").size}}' + '<br>': '') +
        //     (item.buy ? "Buy: " + '{{getItem("' + item.name + '").buy}}'  + '<br>': '') +
        //     (item.price ? "Price: $" + '{{getItem("' + item.name + '").price}}' + '<br>': '') +
        //     (item.shape ? "Shape: " + '{{getItem("' + item.name + '").shape}}' + '<br>': '') +
        //     (item.type ? "Type: " + '{{getItem("' + item.name + '").type}}' + '<br>': '') +
        //     (mode === 'edit' ?
        //      "Published: " + '{{getItem("' + item.name + '").published}}' + '<br>': '') +
        //     (mode === 'edit' ?
        //      "ID: " + '{{getItem("' + item.name + '").id}}' + '<br>': '') +
        //     "</div>";
        // $("#" + item.elId + " #descrContainer").html(descr);
        
        // var el = $('#' + item.name);
        // removeClasses(el, ['size', 'shape', 'buy', 'published', 'groupedWith', 'type']);
    };
    
    $scope.deleteImg = function(name) {
        console.log('Deleting ' + name);
        $http({method: 'POST', url: '/delete', data:{name: name}}).
            success(function(data, status, headers, config) {
                $scope.shouldBeOpen = false;
                $scope.addingImages = false ;
                console.log(status, data);
                console.log('#'+images[name].elId, $(images[name].elId));
                $('#' + images[name].elId).addClass('deleted');
                delete images[name];
            }).
            error(function(data, status, headers, config) {
                alert('Failed to delete ' + name);
                $scope.shouldBeOpen = false;
                $scope.addingImages = false ;
                console.log('Failed', status, data, headers, config);
                console.log('Failed to post data.');
            });
    };
    
    $scope.close = function () {
        console.log('close');
        $scope.shouldBeOpen = false;
        // $scope.addingImages = false ;
        // $scope.saveItems();
    };
    
    $scope.viewItemImage = function(imageName) {
        
        imageName = imageName.slice(imageName.indexOf('/') + 1);
        $scope.viewImage(imageName);
        
    };
    
    $scope.viewImage = function (imageName) {
        
        if (descrButtonClicked) {
            descrButtonClicked = false;
            return;
        }
        
        
        // $.fancybox([
	//     {
        //         href : 'fullsize/frommamaipad020'
        //         , title : 'Title'},
	//     {href : 'fullsize/frommamaipad021' , title : 'Title'}
            
        // ]);
        
        var addToCartButton = '<button id="cartButton" class="btn btn-info pull-right" onClick="addToCart(\'' + imageName +'\')"> ' +
            "Add to cart" +
            '</button>';
        
        var removeFromCartButton =
            '<button id="cartButton" class="btn btn-info pull-right" onClick="removeFromCart(\'' + imageName +'\')"> ' +
            "Remove from cart" +
            '</button>';
        var imgBox = [];
        images[imageName].images.forEach(function(img) {
            img = images[img];
            imgBox.push({
                href : 'fullsize/' + img.name
                ,title : "<div class='fullsize well'>" +
                    //Size:" +
                    // images[imageName].size +
                    " Price: $" + 
                    images[imageName].price +
                    (images[imageName].inCart ? removeFromCartButton : addToCartButton) +
                
                "</div>" 

            });
            
        });
        window.addToCart = function(imageName) {
            
            var item = images[imageName];
            // if (item.inCart) {
            //     return;
            // }
            item.inCart = true;
            
            console.log('we\'ve added to the cart!!!' + imageName);
            var data ={"business":"michieljoris@gmail.com","item_name":'bla',"amount":item.price || "123","currency_code":"AUD"};
            console.log(data);
            
            PAYPAL.apps.MiniCart.addToCart(data);
            var button =$('#cartButton');
            button.html('Remove from cart');
        };
        
       window.removeFromCart = function(imageName) {
           console.log('removing from cart: ' + imageName);
            var item = images[imageName];
           
            item.inCart = false;
           
            var button =$('#cartButton');
            button.html('Add to cart');
       };
        
    
        $.fancybox.open(
            imgBox
            , {
                nextEffect : 'fade',
                prevEffect : 'fade',
                openEffect : 'elastic',
                closeEffect : 'elastic',
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
        // console.log('zoom =', zoom);
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

    $scope.addAlert = function(msg, type, timeout) { //type = error, success or info or nothing
        var alert = {msg: msg, type: type};
        $scope.alerts.push(alert);
        // console.log(index);
        
        if (!timeout) {
            
        }
        else setTimeout(function() {
            var alerts = [];
            console.log('closing alert ');
            $scope.alerts.forEach(function(a) {
                if (a !== alert) alerts.push(a);
            });
            $scope.alerts = alerts;
            $scope.$apply();
            // $scope.alerts.splice(index, 1);
        },timeout);
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
        then(setIsotope
              ,function(data, status) {
                  console.log('Failed', status);
                  alert('Failed to retrieve an image list!!.');
              });
    
    $(function() {
        var select = $( "#zoom" );
        var slider = $( "<div id='slider'></div>" ).insertAfter( select ).slider({
            min: 1,
            max: 100,
            range: "min",
            value: 40,
            slide: function( event, ui ) {
                var width = (ui.value*4 + 40);
                // select[ 0 ].selectedIndex = ui.value - 1;
                $(".item img").attr("width",40 + ui.value * 4);
                $("#imageDiv").isotope("reLayout");
            }
        });
        // $( "#minbeds" ).change(function() {
        //     slider.slider( "value", this.selectedIndex + 1 );
        // });
    });
    
    $scope.setLayout = function(density) {
        console.log($scope.dense);
        if (density === 'wide')
            $('#imageDiv').isotope({
                layoutMode: 'cellsByRow',
                cellsByRow: {
                    columnWidth: 288,
                    rowHeight:288
                }
            }); 
        else $('#imageDiv').isotope({
            layoutMode: 'masonry',
            masonry: {
                // columnWidth: 288,
                // rowHeight:288
            }
  
        });
    };
    
    // $scope.isCollapsed = true;
    $scope.moreless=function() {
        if ($scope.isCollapsed) return 'Less';
        return 'More';
    };
    
    setSelectIsotope();
    
    
    // $scope.test = ['images/2012-12-11 at 07.28.35.jpg', 'images/2012-12-11 at 07.28.35.jpg'];
    $scope.addImageToItem = function(imageName) {
        if (imageName) {
            if ($scope.item.images.indexOf(imageName) === -1)
                $scope.item.images.push(imageName);
            return;
        }
        $scope.shouldBeOpen = false;
        $scope.addingImages = true;
        // $scope.addAlert("Click an image to add..", 'info', 10000);
        };
    $scope.removeImageFromItem = function(item) {
        if (item.images.length <= 1) return;
        
        images[item.mainImage].groupedWith = null;
        console.log(item.images, item.mainImage);
        var loc = item.images.indexOf(item.mainImage);
        item.images = item.images.slice(0, loc ).concat(item.images.slice(loc+1));
        item.mainImage = item.images[0];
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


