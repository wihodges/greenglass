/*global */

var mainMenuTree = [
    // { label: 'Home', icon: '', route: 'home'
    //    // sub: [
    //    //     { label: 'Contact us', route: 'contactus', scroll: true}
    //    //     ]
    // }
];

var slides =  [
    // { url: "images/slides/home_page_Early_Childhood_Education_and_Care_training.jpg"
    //   // ,title: 'Early Childhood Education and Care training'
    //   // ,subtitle: 'Aged care slogan'
    // }
];


var exports = {
    verbose: true
    ,monitor: true
    
    ,prettyPrintHtml: false
    // ,tagIdPostfix: '__' //can be overridden per template
    ,paths: {
        root: process.cwd() 
        //relative to this root:
        ,partials: 'build/'  //can be overridden per template
        ,out:'www/built' 
        ,js: 'www/js'
    }
    ,routes : [
        ['gallery', '/built/view-gallery.html', '\"GalleryCntl\"'],
        ['blog', '/built/view-blog.html', '"BlogCntl"']
        
    ]
    
    //Every partial generates a string. How the partial is generated
    //depends on its type. Each type can define more than one partial
    //of that type by assigning an array of definitions instead of
    //just one (object) definition to that type. These partials are
    //identified by their id. This enables them to uses as the source in
    //later defined templates. They don't need an id if you just want
    //to generate a string to save to the file defined in 'out'.
    ,partials: {
        ids: {
            title: '<title>green glass terrariums</title>'
            ,skewer:'<script src="http://localhost:9090/skewer"></script>'
            ,editMode:'<script>var mode="edit"</script>'
            ,viewMode:'<script>var mode="view"</script>'
            ,persona:'<script src="https://login.persona.org/include.js"></script>'
            ,uploadcare: "<script> UPLOADCARE_PUBLIC_KEY = '122d4d06f195611a02bc'; </script>"
            
        }
        ,metaBlock : {
            id: 'meta',
            tags: [ { charset:'utf-8' },
                    { name: "viewport"
                      ,content: "width=device-width, initial-scale=1, maximum-scale=1"
                    } ,
                    //stops IE using compatibility mode, important for Persona
                    { 'http-equiv':"X-UA-Compatible", 'content':"IE=Edge"
                    }
                  ]
        }
        ,linkBlock:  {
            id: 'myLinkBlock',
            files:  [
                'bootstrap'
                ,'bootstrap-responsive'
                ,'jquery-ui-1.10.2.custom'
                ,'angular-ui'
                ,'checkboxes'
                // ,'prettyPhoto'
                ,'fancybox/source/jquery.fancybox'
                ,'fancybox/source/helpers/jquery.fancybox-buttons'
                ,'fancybox/source/helpers/jquery.fancybox-thumbs'
                ,'persona-buttons'
                ,'main'
            ]
            ,path: 'css/'
        }
        ,scriptBlock: [
            {
                id: 'headJsBlock',
                files: [
                ],
                path: 'js/'
            },
            {
                id: 'myJsBlock',
                files: [
                    'jquery-1.9.1.min.js'
                    ,'jquery-ui-1.10.2.custom.min'
                    ,'bootstrap'
                    ,'angular.min'
                    ,'angular-ui'
                    ,'ui-bootstrap-tpls-0.2.0'
                    ,'modernizr'
                    ,'jquery.isotope.min.js'
                    ,'galleria/galleria-1.2.9.min'
                    // ,'jquery.prettyPhoto'
                    // ,'tinymce/js/tinymce/jquery.tinymce.min'
                    ,'fancybox/lib/jquery.mousewheel-3.0.6.pack'
                    ,'fancybox/source/jquery.fancybox.pack'
                    ,'fancybox/source/helpers/jquery.fancybox-buttons'
                    ,'fancybox/source/helpers/jquery.fancybox-media'
                    ,'fancybox/source/helpers/jquery.fancybox-thumbs'
                    ,"ckeditor/ckeditor"
                    ,'getpos'
                    ,"cookie"
                    ,"vow"
                    ,'persona_include' //to be replaced by include.js from CDN
                    ,'persona'
                    ,'angularModule'
                    ,"MainCntl"
                    ,'BlogCntl'
                    ,'GalleryCntl'
                    ,'InfoCntl'
                    ,'router'
                    // ,'myjs'
                ],
                path: 'js/'
            }
        ]
        // ,slideShow: [{ type: 'flex',
        //                id: 'flex',
        //                slides: slides
        //              }
        // ]
        ,menu: [
            // { type: 'superfish',
            //       tree: mainMenuTree,
            //       id: 'superfish'
            //     },
        ]
        ,template: [
            { src: 'html/isotope' 
              ,tagIdPostfix: '--' //can be overridden per template
              ,id: 'isotope'
              // ,out: 'guideView.html'
              ,mapping: {
                  select: 'html/select'
              }
            }
            // ,{ src: "views/view-gallery.html",
            //    out:"view-gallery.html",
               
            //    mapping: {
            //        isotope: 'isotope'
            //    }
            //  }
            // ,{ src: "views/view-blog.html",
            //    out:"view-blog.html",
            //    mapping: {
            //       blog: 'html/blog'
            //    }
            //  }
            ,{ src: 'html/body' 
              ,id: 'body'
              ,tagIdPostfix: '--' //can be overridden per template
              ,pathOut: 'www/'
               ,mapping: {
                   // sidebar: 'html/sidebar'
                   isotope: 'isotope'
                   ,linkbar: 'html/links'
                   ,blog: "html/blog"
               }
            }
            //Main layout
            ,{// id: 'page' 
                pathOut: 'www/'
                ,out: 'edit.html' //optional, relative to root
                ,src: 'html/basicPage.html'
                //Maps tag ids to partial ids. Tag ids have to be
                //postfixed with two dashes in the template. Partials
                //with an extension will be loaded from the partials
                //folder for this template. Markdown files will be
                //converted to html. Partials in an array will be
                //concatenated before inserted at the tag id element
                
                ,mapping: {
                    head: ['title', 'meta', 'html/ieshim',  'skewer', 'uploadcare', 'headJsBlock', 'myLinkBlock' 
                           // ,'_linkBlock'
                          ],
                    wrapper: [
                        'body'
                        ,'editMode'
                        ,'myJsBlock'
                        // ,'_scriptBlock'
                    ]
                }
            }
            ,{// id: 'page' 
                pathOut: 'www/'
                ,out: 'index.html' //optional, relative to root
                ,src: 'html/basicPage.html'
                //Maps tag ids to partial ids. Tag ids have to be
                //postfixed with two dashes in the template. Partials
                //with an extension will be loaded from the partials
                //folder for this template. Markdown files will be
                //converted to html. Partials in an array will be
                //concatenated before inserted at the tag id element
                
                ,mapping: {
                    head: ['title', 'meta', 'html/ieshim',  'skewer',
                           // ,'persona',
                           'uploadcare', 'headJsBlock', 'myLinkBlock' 
                           // ,'_linkBlock'
                          ],
                    wrapper: [
                        'body'
                        ,'viewMode'
                        ,'myJsBlock'
                        // ,'_scriptBlock'
                    ]
                }
            }
            
        ] 
        
    }
};



