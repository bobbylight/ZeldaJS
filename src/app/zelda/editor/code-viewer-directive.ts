module zeldaEditor {
    'use strict';

    export class CodeViewerController {

        map: zelda.Map;
        mapJson: string;

        constructor($scope: ng.IScope, $element: JQuery, $attrs: ng.IAttributes) {

            $scope.$watch(() => { return this.map; }, (newValue: zelda.Map) => {
                console.log('Yee-haw');
                this.mapJson = hljs.highlight('json', JSON.stringify(newValue)).value;
            });
        }

        refresh() {
            console.log('Refreshing...');
            this.mapJson = hljs.highlight('json',
                JSON.stringify({ one: true, two: { name: 'Robert', age: 35 } }, null, 2)).value;
        }

    }
}

angular.module('editorDirectives', [])

.directive('codeViewer', [function() {

    function preLink(scope: any, element: JQuery, attrs: ng.IAttributes, controller: any) {

        scope.$watch('map', (newValue: any, oldValue: any) => {
            if (newValue) {
                console.log(controller.mapJson);
            }
        });
    }

    function postLink(scope: any, element: JQuery, attrs: ng.IAttributes, controller: any) {

//        hljs.highlightBlock(element.get(0));
    }

    return {
        bindToController: true,
        controller: zeldaEditor.CodeViewerController,
        controllerAs: 'vm',
        link: {
            pre: preLink,
            post: postLink
        },
        restrict: 'E',
        scope: {
            map: '='
        },
        templateUrl: 'js/zelda/editor/templates/codeViewer.html'
    };
}]);