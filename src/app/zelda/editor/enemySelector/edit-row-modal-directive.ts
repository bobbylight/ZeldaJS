// export interface EditRowModalScope extends ng.IScope {
// }

import {EnemyInfo} from '../../EnemyGroup';
import {LabelValuePair} from '../select-directive';
import {IModalServiceInstance} from 'angular-ui-bootstrap';

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
    constructor(private $scope: ng.IScope, private $uibModalInstance: IModalServiceInstance) {
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

    private _createSelectedEnemyInfo(): EnemyInfo {

        // TODO: Do this the right way
        const conversions: any = [];
        conversions.moblin = 'Moblin';
        conversions.octorok = 'Octorok';
        conversions.tektite = 'Tektite';

        return {
            type: conversions[this.selectedEnemy],
            args: [],
            count: this.enemyCount
        };
    }

    onSubmit() {
        console.log('submit clicked');
        const result: { [ key: string ]: any } = {};
        this.$uibModalInstance.close(result);
        if (this.okCallback) {
            this.okCallback(this._createSelectedEnemyInfo());
        }
    }

    onCancel() {
        console.log('cancel clicked');
        this.$uibModalInstance.close();
    }
}
