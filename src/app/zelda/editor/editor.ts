import * as angular from 'angular';

// Webpack makes you import your HTML and CSS.  WTF?
import 'editor.html';
import 'editor.css';

angular.module('editorApp',
    [ 'ui.bootstrap', 'ngSanitize', 'editorControllers', 'editorDirectives', 'editorServices' ]);
