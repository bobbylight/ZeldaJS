import * as React from 'react';
import { ActionablePanelAction, ActionablePanelMenuItem } from './actionable-panel-action';

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
        this.setState({ pressed: !!this.props.action.pressed });
    }

    handleClick() {

        // setState() is asynchronous
        let newPressedState: boolean = this.state.pressed;

        if (this.props.action.toggle) {
            newPressedState = !this.state.pressed;
            this.setState({ pressed: newPressedState });
        }

        if (this.props.action.callback) {
            this.props.action.callback(newPressedState);
        }
        else if (this.props.action.menu) {

        }
    }

    render() {

        const className: string = 'action-button' + (this.state.pressed ? ' action-button-pressed' : '');

        if (this.props.action.menu) {

            const buttonId: string = 'abc123';

            let i: number = 0;
            const menuItems: JSX.Element[] = this.props.action.menu.map((item: ActionablePanelMenuItem) => {
                return <li key={'action-' + i++}><a href="#">Action</a></li>;
            });
            const menu: JSX.Element = <ul className="dropdown-menu" aria-labelledby={buttonId}>
                {menuItems}
            </ul>;

            return (
                <span className={className + ' dropdown'}>
                    <span id={buttonId} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                         className="dropdown-toggle" onClick={this.handleClick} title={this.props.action.title}>
                        <span className="caret"/>
                    </span>
                    {menu ? menu : ''}
                </span>
            );
        }

        return (
            <span className={className} onClick={this.handleClick} title={this.props.action.title}>
                <i className={`fa fa-${this.props.action.iconClass}`}/>
            </span>
        );
    }
}
