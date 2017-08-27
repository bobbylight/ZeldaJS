import * as React from 'react';
import { ActionablePanelAction } from './actionable-panel-action';

interface ActionButtonProps {
    key: string;
    action: ActionablePanelAction;
}

interface ActionButtonState {
    pressed: boolean;
}

export default class ActionButton extends React.Component<ActionButtonProps, ActionButtonState> {

    constructor(props: ActionButtonProps) {

        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        this.setState({ pressed: false });
    }

    handleClick() {

        // setState() is asynchronous
        let newPressedState: boolean = this.state.pressed;

        if (this.props.action.toggle) {
            newPressedState = !this.state.pressed;
            this.setState({ pressed: newPressedState });
        }
        this.props.action.callback(newPressedState);
    }

    render() {

        const className: string = 'action-button' + (this.state.pressed ? ' action-button-pressed' : '');

        return (
            <div className={className} onClick={this.handleClick} title={this.props.action.title}>
                <i className={`fa fa-${this.props.action.iconClass}`}/>
            </div>
        );
    }
}
