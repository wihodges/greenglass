/*global myApp:false mode:false CKEDITOR:false $:false  console:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

myApp.controller("InfoCntl", function ($scope, $http, $location, $timeout) {
    console.log('in INFOCNTL!!!!!!');
    CKEDITOR.replace( 'editor2',{
        toolbar : [
            // { name: 'document', items: [ 'Source', '-', 'NewPage', 'Preview', '-', 'Templates' ] },
            { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
            {name: 'letters', items: [ 'Find', 'Replace', 'SelectAll']},
            // '/',
            {name: 'styles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat']},
            {name: 'lists', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote']},
            {name: 'bar3', items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
            '/',
            
            {name: 'bar4', items: [ 'Link', 'Unlink']},
            {name: 'bar5', items: [ 'Image', 'Table', 'HorizontalRule']},
            {name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize', 'TextColor', 'BGColor', 'Maximize']}
        ]
        ,disableNativeSpellChecker : false
        ,removePlugins: 'fastimage'
        ,enterMode: CKEDITOR.ENTER_BR
        ,extraPlugins : 'divarea' 
            
        // toolbar: 'Basic',
        // uiColor: '#9AB8F3'
    } );
    $scope.editMode = false;
    // $scope.editMode = false;
    // $scope.content = "just some text";
    
    $scope.saveText = function() {
        console.log($scope);
        var content = CKEDITOR.instances.editor2.getData();
        console.log(content);
        $http.post('save?path=' + $scope.info, content).
            success(function(data, status, headers, config) {
                console.log(data, status, config);
                if (!data.success) {
                    console.log('Failed to save on the server ', data.error);
                    alert('Warning: this file did not save to the server!!');
                    // if (data.error === 'Not authorized.')
                    //     $scope.signedIn = false;
                    
                    return;
                }
                $scope.saveNotify = true;
                $scope.$parent.content = content;
                console.log($scope);
                $timeout(function(){
                    $scope.saveNotify = false;
                }, 3000);
                
            }).
            error(function(data, status, headers, config) {
                console.log('Failed to post data!!', data, status, headers, config);
                alert('Warning: this file did not save to the server!!\n' +
                     'Reason:' + data.error);
                return;
                    
            });
    };
    $scope.cancelEditor = function() {
        $scope.editMode = false;
    };
    
    $scope.editText = function() {
        $scope.editMode = true;
        
    };
    
    $scope.closeEditor = function() {
        $scope.editMode = false;
        $scope.saveText();
        // $scope.content = CKEDITOR.instances.editor2.getData();
    };
    
    
}); 