module zeldaEditor {
    'use strict';

    // export interface EditRowModalScope extends ng.IScope {
    // }

    export class EditorRowModalController {

        submitButtonLabel: string;
        title: string;
        enemyChoices: LabelValuePair[];
        selectedEnemy: any;
        enemyCount: number;
        okCallback: Function;

        static $inject: string[] = [ '$scope', '$uibModalInstance' ];

        // Note we must hang stuff off of the scope here since ui-bootstrap does not
        // use controller-as.
        constructor(private $scope: ng.IScope, private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance) {
            console.log('In controller!!!');

            this.submitButtonLabel = 'OK';

            const isNew: boolean = true;
            if (isNew) {
                this.title = 'Add new';
            }
            else {
                this.title = 'Edit existing';
            }

            this.enemyChoices = [
                { label: 'Moblin', value: 'moblin' },
                { label: 'Octorok', value: 'octorok' },
                { label: 'Tektite', value: 'tektite' }
            ];
            this.selectedEnemy = this.enemyChoices[0].value;

            this.enemyCount = 1;
        }

        onSubmit() {
            console.log('submit clicked');
            const result: { [ key: string ]: any } = {};
            this.$uibModalInstance.close(result);
            if (this.okCallback) {
                this.okCallback('apples');
            }
        }

        onCancel() {
            console.log('cancel clicked');
            this.$uibModalInstance.close();
        }
    }
}
