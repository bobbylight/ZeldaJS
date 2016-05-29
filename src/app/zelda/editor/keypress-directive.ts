angular.module('editorDirectives')
.directive('keyPressTrapper', [ '$document', '$rootScope', ($document: ng.IDocumentService, $rootScope: ng.IRootScopeService) => {
    'use strict';

    const PREVENT_DEFUALT_KEYS: number[] = [ 37, 38, 39, 40 ];

    return {

        restrict: 'A',

        link: () => {

            $document.bind('keydown', (e: JQueryEventObject) => {

                //console.log('gotcha - ' + e.which);
                $rootScope.$broadcast('keypress', e); // For all key events
                $rootScope.$broadcast('keypress:' + e.which, e);

                if (PREVENT_DEFUALT_KEYS.indexOf(e.which) > -1) {
                    e.preventDefault();
                }
            });
        }
    };

}]);
