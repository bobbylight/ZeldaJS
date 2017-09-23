import * as React from 'react';
import Select, { SelectOnChangeEvent } from './select';
import { LabelValuePair } from './label-value-pair';
import { Screen } from '../Screen';

export interface ScreenMiscProps {
    screen: Screen | null;
}

interface ScreenMiscState {

}

export default class ScreenMisc extends React.Component<ScreenMiscProps, ScreenMiscState> {

    private songs: LabelValuePair<string>[];

    constructor(props: ScreenMiscProps) {

        super(props);

        this.songChanged = this.songChanged.bind(this);
    }

    componentWillMount() {

        this.songs = [
            { label: '(default)', value: null },
            { label: 'No music', value: 'none' },
            { label: 'Overworld', value: 'overworldMusic' }
        ];
    }

    songChanged(e: SelectOnChangeEvent<string>) {
        this.props.screen!.music = e.newValue;
    }

    render() {
        return (
            <div>
                <div className="form-group">
                    <label>Song</label>
                    <Select choices={this.songs}
                            initialValue={this.props.screen!.music}
                            onChange={this.songChanged}/>
                </div>
            </div>
        );
    }
}
