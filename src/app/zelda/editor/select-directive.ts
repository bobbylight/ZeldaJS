export class SelectController {

    buttonId: string;
    choices: LabelValuePair[];
    selection: LabelValuePair;
    selectedValue: any;
    onChange: Function;
    noneOption: boolean | string;

    static $inject: string[] = [ '$scope' ];

    constructor(private $scope: ng.IScope) {
    }

    $onInit() {
        if (!this.buttonId) {
            this.buttonId = SelectController.createUniqueId();
        }

        if (this.noneOption) {
            const label: string = this.noneOption === true ? '(none)' : this.noneOption.toString();
            this.choices.unshift({ label: label, value: null });
        }

        if (!this.selectedValue) {
            this.selection = this.choices[0];
            this.selectedValue = this.selection.value;
        }

        this.$scope.$watch(() => { return this.selectedValue; }, (newValue: any, oldValue: any) => {
            const matches: LabelValuePair[] = this.choices.filter((lvp: LabelValuePair) => { return lvp.value === newValue; });
            if (matches.length === 0) {
                throw 'Internal error: value selected in select not found in label/value pairs: ' + newValue;
            }
            this.selection = matches[0];
        });
    }

    private static createUniqueId(): string {
        return 'select-' + new Date().getTime();
    }

    getSelectedLabel(): string {
        return this.selection != null ? this.selection.label : '(none)';
    }

    onClick(choice: LabelValuePair) {
        this.selection = choice;
        this.selectedValue = choice.value;
        if (this.onChange) {
            this.onChange({ newValue: this.selectedValue });
        }
    }
}

export interface LabelValuePair {
    label: string;
    value: any;
}

angular.module('editorDirectives').component('zeldaSelect', {

    //require: 'ngModel',
    templateUrl: 'js/zelda/editor/templates/select.html',

    controller: SelectController,

    bindings: {
        buttonId: '@id',
        choices: '=',
        selectedValue: '=selection',
        onChange: '&',
        noneOption: '='
    }
});
