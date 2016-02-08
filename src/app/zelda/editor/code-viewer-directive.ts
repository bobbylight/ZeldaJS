module zeldaEditor {
    'use strict';

    export class CodeViewerController {

        map: zelda.Map;
        mapJsonUpdateTime: number;
        mapJson: string;

        static $inject: string[] = [ '$scope', '$sce' ];

        constructor(private $scope: ng.IScope, private $sce: ng.ISCEService) {
            this.mapJsonUpdateTime = 0;
        }

        private jsonReplacer(key: string, value: any): string {
            return value;
        }

        refresh() {
            const start: Date = new Date();
            console.log('Refreshing started at: ' + start);

            const json: zelda.MapData = this.map.toJson();
            let jsonStr: string = JSON.stringify(json, null, 2);
            //jsonStr = jsonStr.replace(/\[((\r?\n +\d+,)+(\r?\n +\d+))\]/g, '[$1]');
            jsonStr = jsonStr.replace(/( +)"tiles": \[(?:[ \d,\n\[\]]+)\][, \n]+\]/g, (match: string, p1: string) => {
                return match.replace(/ +/g, ' ').replace(/\n/g, '').replace(/\], \[/g, ']\,\n' + p1 + '  [');
            });
            //jsonStr = jsonStr.replace(/\n/g, '');

            this.mapJson = hljs.highlight('json', jsonStr).value;
            this.mapJsonUpdateTime = new Date().getTime();
            console.log('Refreshing completed, took: ' + (new Date().getTime() - start.getTime()));
        }

        copy() {
            this.$scope.$broadcast('copy-json');
        }
    }
}

angular.module('editorDirectives', [])

.directive('codeViewer', [function() {

    function link(scope: any, element: JQuery, attrs: ng.IAttributes, controller: any) {

        scope.$watch(() => { return controller.mapJsonUpdateTime; }, () => {
            const start: Date = new Date();
            console.log('Inserting JSON starting at: ' + start);
            element.find('.code-section').html(controller.mapJson);
            console.log('Inserting JSON completed, took: ' + (new Date().getTime() - start.getTime()));
        });

        scope.$on('copy-json', (e: any, args: any) => {
            console.log('Copy that text!');
            let range: Range = document.createRange();
            range.selectNodeContents(element.find('.code-section').get(0));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            const success: boolean = document.execCommand('copy');
            console.log('Successful - ' + success);
            //range.setStart(element.get(0), 0);
            //range.setEnd(element.get(0), 1);
        });
    }

    return {
        bindToController: true,
        controller: zeldaEditor.CodeViewerController,
        controllerAs: 'vm',
        link: link,
        restrict: 'E',
        scope: {
            map: '='
        },
        templateUrl: 'js/zelda/editor/templates/codeViewer.html'
    };
}]);