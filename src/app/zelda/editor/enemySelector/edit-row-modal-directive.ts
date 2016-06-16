module zeldaEditor {
    'use strict';

    export interface EditRowModalScope extends ng.IScope {
        submitButtonLabel: string;
        title: string;
        onSubmit: Function;
        onCancel: Function;
        enemyChoices: LabelValuePair[];
        selectedEnemy: any;
        enemyCount: number;
    }

    export class EditorRowModalController {

        submitButtonLabel: string;

        static $inject: string[] = [ '$scope', '$uibModalInstance' ];

        // Note we must hang stuff off of the scope here since ui-bootstrap does not
        // use controller-as.
        constructor(private $scope: EditRowModalScope, private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance) {
            console.log('In controller!!!');

            $scope.submitButtonLabel = 'OK';

            const isNew: boolean = true;
            if (isNew) {
                $scope.title = 'Add new';
            }
            else {
                $scope.title = 'Edit existing';
            }

            $scope.onSubmit = () => { this.onSubmit.call(this); };
            $scope.onCancel = () => { this.onCancel.call(this); };

            $scope.enemyChoices = [
                { label: 'Moblin', value: 'moblin' },
                { label: 'Octorok', value: 'octorok' },
                { label: 'Tektite', value: 'tektite' }
            ];
            $scope.selectedEnemy = $scope.enemyChoices[0].value;

            $scope.enemyCount = 1;
        }

        onSubmit() {
            console.log('submit clicked');
            const result: { [ key: string ]: any } = {};
            this.$uibModalInstance.close(result);
        }

        onCancel() {
            console.log('cancel clicked');
            this.$uibModalInstance.close();
        }
    }
}
