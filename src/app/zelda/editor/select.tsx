import * as React from 'react';
import { LabelValuePair } from './label-value-pair';
import { CSSProperties } from 'react';

/**
 * Note: <code>choices</code> should only be a <code>string[]</code> if <code>t</code> is <code>string</code>!
 */
interface SelectProps<T> {
    buttonId?: string;
    choices: LabelValuePair<T>[] | string[];
    initialValue?: T | null;
    onChange: SelectOnChangeHandler<T>;
    noneOption?: boolean | string;
    display?: string;
    buttonStyle?: 'default' | 'info' | 'success' | 'primary' | 'warning' | 'danger';
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

    componentWillReceiveProps(nextProps: Readonly<SelectProps<T>>) {

        console.log('-------- componentWillReceiveProps called: ' + JSON.stringify(nextProps));
        let initialValue: T | null | undefined = nextProps.initialValue;
        if (!initialValue) {
            initialValue = this.state.choices[0].value;
        }

        this.setState({
            choices: this.state.choices,
            selection: this.getLabelValuePairFor(this.state.choices, initialValue)
        });
    }

    componentWillMount() {

        // Ensure we get start with an array of LabelValuePairs.  Note just passing an array of strings is
        // wonky, as it makes the big assumption that T === 'string'
        let lvpChoices: LabelValuePair<any>[];
        if (this.props.choices.length > 0 && typeof this.props.choices[0] === 'string') {
            lvpChoices = (this.props.choices as string[]).map((choice: string) => {
                return { label: choice, value: choice };
            });
        }
        else {
            lvpChoices = this.props.choices as LabelValuePair<T>[];
        }

        this.buttonId = this.props.buttonId || Select.createUniqueId();
        const choices: LabelValuePair<T>[] = lvpChoices.slice();

        if (this.props.noneOption) {
            const label: string = this.props.noneOption === true ? '(none)' : this.props.noneOption;
            choices.unshift({ label: label, value: null });
        }

        let initialValue: T | null | undefined = this.props.initialValue;
        if (!initialValue) {
            initialValue = choices[0].value;
        }

        console.log('>>> >>> >>> ' + JSON.stringify(choices));
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
        return this.state.selection.label;
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

        const listItems: JSX.Element[] = this.state.choices.map((lvp: LabelValuePair<T>) => {
            return (<li role="menuitem" key={lvp.value ? lvp.value.toString() : 'null'}>
                        <a href="#" onClick={() => { this.onClick(lvp); } }>{lvp.label}</a>
                    </li>);
        });

        const style: CSSProperties = {
            display: this.props.display ? this.props.display : 'inherit'
        };
        const buttonClass: string = `btn btn-${this.props.buttonStyle || 'default'}`;

        return (
            <div className="dropdown" style={style}>
                <button id={this.buttonId} type="button" className={buttonClass}
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
