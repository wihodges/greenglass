/*global myApp:false mode:false CKEDITOR:false $:false  console:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

myApp.controller("InfoCntl", function ($scope) {
    CKEDITOR.replace( 'editor1',{
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
        // toolbar: 'Basic',
        // uiColor: '#9AB8F3'
    } );
    // $scope.editMode = true;
    $scope.editMode = false;
    // $scope.content = "just some text";
    
    $scope.saveText = function() {
        $scope.content = CKEDITOR.instances.editor1.getData();
        
        // console.log(editor_data);
    };
    $scope.cancelEditor = function() {
        $scope.editMode = false;
    };
    
    $scope.editText = function() {
        $scope.editMode = true;
        
    };
    
    $scope.closeEditor = function() {
        $scope.editMode = false;
        $scope.content = CKEDITOR.instances.editor1.getData();
    };
    
    
}); 