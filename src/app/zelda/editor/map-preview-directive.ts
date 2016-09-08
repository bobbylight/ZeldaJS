angular.module('editorDirectives')
    .directive('keyPressTrapper', [ '$document', '$rootScope', ($document: ng.IDocumentService, $rootScope: ng.IRootScopeService) => {
        'use strict';

        return {

            restrict: 'E',
            template: '<canvas></canvas>',

            scope: {

            },

            link: () => {
            }
        };

    }]);
