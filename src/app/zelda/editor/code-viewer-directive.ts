angular.module('editorDirectives', [])

.directive('codeViewer', [function() {

    function CodeViewerController($scope: any, $element: JQuery, $attrs: ng.IAttributes) {

        this.$onInit = function() {
            console.log('hi');
        };
    }

    function preLink(scope: any, element: JQuery, attrs: ng.IAttributes, controller: any) {

        scope.$watch('map', (newValue: any, oldValue: any) => {
            if (newValue) {
                controller.mapJson = hljs.highlight('json', JSON.stringify(controller.map)).value;
                console.log(controller.mapJson);
            }
        });
    }

    function postLink(scope: any, element: JQuery, attrs: ng.IAttributes, controller: any) {

//        hljs.highlightBlock(element.get(0));
    }

    return {
        bindToController: true,
        controller: CodeViewerController,
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