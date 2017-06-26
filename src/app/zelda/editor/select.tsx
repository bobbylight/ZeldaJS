import * as React from 'react';
import {LabelValuePair} from './label-value-pair';

interface SelectProps<T> {
    buttonId?: string;
    choices: LabelValuePair<T>[];
    initialValue?: T | null;
    onChange: SelectOnChangeHandler<T>;
    noneOption?: boolean | string;
}

interface SelectState<T> {
    choices: LabelValuePair<T>[];
    selection: LabelValuePair<T>;
}

export interface SelectOnChangeHandler<T> {
    (e: SelectOnChangeEvent<T>): void;
}

export interface SelectOnChangeEvent<T> {
    newValue: T | null;
}

export default class Select<T> extends React.Component<SelectProps<T>, SelectState<T>> {

    private buttonId: string;

    componentWillMount() {

        this.buttonId = this.props.buttonId || Select.createUniqueId();
        const choices: LabelValuePair<T>[] = this.props.choices.slice();

        if (this.props.noneOption) {
            const label: string = this.props.noneOption === true ? '(none)' : this.props.noneOption;
            choices.unshift({ label: label, value: null });
        }

        let initialValue: T | null | undefined = this.props.initialValue;
        if (!initialValue) {
            initialValue = choices[0].value;
        }

        this.setState({
            choices: choices,
            selection: this.getLabelValuePairFor(choices, initialValue)
        });
    }

    private static createUniqueId(): string {
        return 'select-' + new Date().getTime();
    }

    private getLabelValuePairFor(choices: LabelValuePair<T>[], value: any): LabelValuePair<T> {
        const matches: LabelValuePair<T>[] = choices.filter((lvp: LabelValuePair<T>) => {
            return lvp.value === value;
        });
        return matches[0];
    }

    private getSelectedLabel(): string {
        return this.state.selection != null ? this.state.selection.label : '(none)';
    }

    onClick(choice: LabelValuePair<T>) {
        this.setState({
            selection: choice
        });
        if (this.props.onChange) {
            this.props.onChange({ newValue: choice.value });
        }
    }

    render() {

        const listItems: JSX.Element[] = this.props.choices.map((lvp: LabelValuePair<T>) => {
            return (<li role="menuitem" key={lvp.value ? lvp.value.toString() : 'null'}>
                        <a href="#" onClick={() => { this.onClick(lvp); } }>{lvp.label}</a>
                    </li>);
        });

        return (
            <div className="dropdown">
                <button id={this.buttonId} type="button" className="btn btn-primary"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.getSelectedLabel()} <span className="caret"/>
                </button>
                <ul className="dropdown-menu" role="menu" aria-labelledby={this.buttonId}>
                    {listItems}
                </ul>
            </div>
        );
    }
}
