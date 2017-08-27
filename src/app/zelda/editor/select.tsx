import * as React from 'react';
import { LabelValuePair } from './label-value-pair';
import { CSSProperties } from 'react';

/**
 * Note: <code>choices</code> should only be a <code>string[]</code> if <code>t</code> is <code>string</code>!
 */
interface SelectProps<T> {
    buttonId?: string;
    choices: LabelValuePair<T>[] | string[] | number[];
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

        // Ensure we get start with an array of LabelValuePairs.  Note just passing an array of strings is
        // wonky, as it makes the big assumption that T === 'string'
        let lvpChoices: LabelValuePair<any>[];
        if (nextProps.choices.length > 0 &&
            (typeof nextProps.choices[0] === 'string' || typeof nextProps.choices[0] === 'number')) {
            lvpChoices = (nextProps.choices as string[]).map((choice: string) => {
                return { label: choice, value: choice };
            });
        }
        else {
            lvpChoices = nextProps.choices as LabelValuePair<T>[];
        }

        if (nextProps.noneOption) {
            const label: string = typeof nextProps.noneOption === 'string' ? nextProps.noneOption : '(none)';
            lvpChoices.unshift({ label: label, value: null });
        }

        let initialValue: T | null | undefined = nextProps.initialValue;
        if (!initialValue) {
            initialValue = lvpChoices[0].value;
        }

        this.setState({
            choices: lvpChoices,
            selection: this.getLabelValuePairFor(lvpChoices, initialValue!)
        });
    }

    componentWillMount() {

        this.buttonId = this.props.buttonId || Select.createUniqueId();
        this.setState({ choices: [], selection: { label: 'notUsed', value: null } });
    }

    private static createUniqueId(): string {
        return 'select-' + new Date().getTime();
    }

    private getLabelValuePairFor(choices: LabelValuePair<T>[], value: T): LabelValuePair<T> {
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
