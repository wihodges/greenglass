/*global */
var css = [
    'main'
];

var js = [
    //Reload when any files change, not using it now, using
    // Firefox autoreload
    // 'livepage',
    
    // ,'https://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min'
    //Version 1.7.2
    // 'jquery'
    'jquery-1.9.1.min.js'
    ,'jquery.isotope.min.js'
    ,'myjs'
    // 'jquery-1.6.2.js'
    // ,'angular-1.1.4/angular.min'
    // ,'angular-1.1.4/angular-sanitize.min'
    
    // Modernizr is a small JavaScript library that detects the
    // availability of native implementations for next-generation
    // web technologies, i.e. features that stem from the HTML5
    // and CSS3 specifications. Many of these features are already
    // implemented in at least one major browser (most of them in
    // two or more), and what Modernizr does is, very simply, tell
    // you whether the current browser has this feature natively
    // implemented or not.
    ,'modernizr'
];


var routes = [
    // ['home', '/built/view-home.html', 'HomeCntl'],
    // ['aboutus', '/build/markdown/aboutus.md'],
];

var mainMenuTree = [
    // { label: 'Home', icon: '', route: 'home'
    //    // sub: [
    //    //     { label: 'Contact us', route: 'contactus', scroll: true}
    //    //     ]
    // }
];
/*
The wording for the four rolling images on the home page are:
1. Early Childhood Education and Care training
 
2. First Door mentoring inspires focused students
 
3. Innovative resources to bridge the gap between theory and practice
4. Interactive professional development connecting educators to the National Quality Framework
*/

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
        root: '/home/michieljoris/www/greenglass/'
        //relative to this root:
        ,partials: 'build/'  //can be overridden per template
        ,out:'built' 
        ,js: 'js'
    }
    // ,routes: routes
    
    //Every partial generates a string. How the partial is generated
    //depends on its type. Each type can define more than one partial
    //of that type by assigning an array of definitions instead of
    //just one (object) definition to that type. These partials are
    //identified by their id. This enables them to uses as the source in
    //later defined templates. They don't need an id if you just want
    //to generate a string to save to the file defined in 'out'.
    ,partials: {
        ids: {
            title: '<title>Greenglass terrariumns</title>'
        }
        ,metaBlock : {
            id: 'meta',
            tags: [ { charset:'utf-8' },
                    { name: "viewport"
                      ,content: "width=device-width, initial-scale=1, maximum-scale=1"
                    } ]
        }
        ,linkBlock:  {
            id: 'myLinkBlock',
            files: css,
            path: 'css/'
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
                files: js,
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
            //Main layout
            { id: 'page' 
              ,src: 'html/basicPage.html'
               //Maps tag ids to partial ids. Tag ids have to be
               //postfixed with two dashes in the template. Partials
               //with an extension will be loaded from the partials
               //folder for this template. Markdown files will be
               //converted to html. Partials in an array will be
               //concatenated before inserted at the tag id element
              ,mapping: {
                  head: ['title', 'meta', 'headJsBlock', 'myLinkBlock'
                         // ,'_linkBlock'
                        ],
                  body: ['html/body.html', 'myJsBlock'
                         // ,'_scriptBlock'
                        ]
              }
            }
            ,{ src: 'page' 
               ,tagIdPostfix: '--' //can be overridden per template
               ,pathOut: ''
               ,out: 'index.html' //optional, relative to root
               ,mapping: {
                   // message: 'html/message'
                   // ,logo: 'html/logo'
                   // ,social: 'html/social'
                   // ,contact: 'html/contact'
                   // ,studentLogin: 'html/wisenet-login'
                   // ,search: 'html/search'
                   // ,menu: 'cssmenu'
                   // ,fixedmenu: 'fixedmenu'
                   // ,footerLeft: 'html/footerLeft'
                   // ,footerMiddle: 'html/footerMiddle'
                   // ,footerRight: 'html/footerRight'
                   // ,'footerBottom': 'html/footerBottom'
                   // ,'feedback': 'html/feedback'
               }
             }
            
        ] 
        
    }
};



