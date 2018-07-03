import * as React from 'react';
import Select, { SelectOnChangeEvent } from './select';
import { LabelValuePair } from './label-value-pair';

interface ToolBarProps {
    currentScreenChanged: (mapName: string) => void;
}

interface ToolBarState {

}

export default class ToolBar extends React.Component<ToolBarProps, ToolBarState> {

    state: ToolBarState = {};

    constructor(props: ToolBarProps, context: any) {

        super(props, context);

        this.screenSelected = this.screenSelected.bind(this);
    }

    screenSelected(value: SelectOnChangeEvent<string>) {

        this.props.currentScreenChanged(value.newValue!);
    }

    render() {

        const screens: LabelValuePair<string>[] = [
            { label: 'Overworld', value: 'overworld' }
        ];
        for (let i: number = 1; i <= 1 /*9*/; i++) {
            screens.push({ label: `Level ${i}`, value: `level${i}` });
        }

        return (

            <nav className="navbar navbar-expand-lg navbar-light bg-light" role="navigation">

                <a className="navbar-brand" href="#/"><img src="img/crest.png" className="banner-img"/>
                    Zelda Map Creator</a>

                {/* Brand and toggle get grouped for better mobile display */}
                <button type="button" className="navbar-toggler" data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-1">
                    <span className="navbar-toggler-icon">Toggle navigation</span>
                </button>

                {/* Collect the nav links, forms, and other content for toggling */}
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Select choices={screens}
                                    initialValue={screens[0].value}
                                    onChange={this.screenSelected}
                                    display="inline-block"/>
                        </li>
                        <li className="nav-item"><a href="#/about">About</a></li>
                    </ul>
                </div>

            </nav>
        );
    }
}
