import * as React from 'react';
import { ActionablePanelAction } from './actionable-panel-action';
import ActionButton from './action-button';

interface ActionablePanelProps {
    title: string;
    panelClass?: string;
    actions?: ActionablePanelAction[];
    children: any;
}

interface ActionablePanelState {

}

export default class ActionablePanel extends React.Component<ActionablePanelProps, ActionablePanelState> {

    render() {

        let i: number = 0;
        const rows: JSX.Element[] | null = this.props.actions ?
            this.props.actions.map((action: ActionablePanelAction) => {
                return (
                    <ActionButton key={'action-' + (i++)} action={action}/>
                );
            }) : null;
        const actions: JSX.Element | null = rows ? (<div className="card-action-buttons">{rows}</div>) : null;

        return (
            <div className="actionable-panel card">
                <div className="card-header">
                    <h5 className="card-title">{this.props.title}</h5>
                    {actions ? actions : ''}
                </div>
                <div className="card-body">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
