/*global VOW:false myApp:false PAYPAL:false mode:false angular:false $:false  console:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

myApp.factory('cart', function($http) {
    var api = {};
    var cart = [];
    var images;
    api.checkingout = false;
    api.init = function(someImages) {
        images = someImages;
    };
    
    api.buyItem = function (imageName, id, price) {
        // console.log('in buy item');
        // var item = images[imageName];
        // var data ={"business":"michieljoris@gmail.com","item_name": id,"amount":price,
        //            "currency_code":"AUD"};
        // console.log(data);
            
        // PAYPAL.apps.MiniCart.addToCart(data);
        // setTimeout(function() {
        //     PAYPAL.apps.MiniCart.show();
            
        // },100);
        var item = images[imageName];
        if (item.inCart) {
            api.addAlert('Terrarium already in cart!', 'error', 3000);
            return;
        }
        cart.push(item); 
        item.inCart = true;
        // api.addAlert('Terrarium added to cart!', 'success', 3000);
        console.log('Cart: ', cart);
        
    };
    
    api.getCartTotal = function() {
        var total = 0;
        cart.forEach(function(c) {
            // console.log(c.price);
            var n = parseInt(c.price, 10);
            if (typeof n === 'number') 
                total += n;
        }); 
        return total;
    };
    
    api.removeFromCartByName = function(imageName) {
        api.removeFromCart(images[imageName]);
    };
    
    api.removeFromCart = function(item) {
        console.log(item);
        item.inCart=false;
        var newCart = [];
        cart.forEach(function(c) {
            if (c !== item) newCart.push(c);
        }); 
        cart = newCart;
    };
    
    api.checkout = function() {
        api.checkingout = true;
    };
    
    api.payWithCash = function() {
        api.checkingout = false;
    };
    
    api.payWithPaypal = function() {
        api.checkingout = false;
    };
    
    api.cancel = function() {
        api.checkingout = false;
    };
    
    
    api.get = function() {
        return cart;
    };
    
    return api;

}); 

myApp.factory('IsoFilter', function($http) {
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
        square:true, round:false, rectangle:false,
        cylindrical:false, hurricane:false, teardrop:false, centerpiece:false,
        hanging:false, open:false, closed:false,
        yes:true, no:false, archived:false
        ,grouped:false
        ,incart: false, outcart:true
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
        orKeys(filter, ['square', 'round', 'rectangle',
                        'cylindrical', 'hurricane', 'teardrop', 'centerpiece']); 
        orKeys(filter, ['yes', 'no', 'archived' ]); 
        orKeys(filter, ['hanging', 'open', 'closed']);
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
    
    var saveItems = function() {
        console.log("Saving items to server");
        // $scope.cart.forEach(function(c) {
        //     c.inCart = false;
        // }); 
        $http({method: 'POST', url: '/save?path=terrariums.json', data:images}).
            success(function(data, status, headers, config) {
                console.log(status, data);
                // $scope.cart.forEach(function(c) {
                //     c.inCart = true;
                // }); 
            }).
            error(function(data, status, headers, config) {
                alert('Failed to save data\nReason: ' + data.error);
                console.log('Failed', status, data, headers, config);
                console.log('Failed to post data.');
            });
        
    };
    
    
    return {
        saveItems: saveItems,
        defaultFilter: defaultFilter,
        executeFilter: executeFilter
    };
    
});
