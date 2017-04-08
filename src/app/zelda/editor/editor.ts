import * as angular from 'angular';

// Webpack makes you import your HTML and CSS.  WTF?
import 'editor.html';
import 'editor.css';

import './main-controller';
import './code-viewer-directive';
import './keypress-directive';
import './map-editor-directive';
import './map-preview-directive';
import './select-directive';
import './tile-palette-directive';
import './enemySelector/enemy-selector-directive';
import './eventTable/event-table-directive';
import './modifiableTable/modifiable-table-directive';
import './resource-service';

import 'zelda/editor/enemySelector/edit-row-modal.html';
import 'zelda/editor/enemySelector/enemy-selector.html';

angular.module('editorApp',
    [ 'ui.bootstrap', 'ngSanitize', 'editorControllers', 'editorDirectives', 'editorServices' ]);
