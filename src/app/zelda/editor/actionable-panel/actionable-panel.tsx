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
        const rows: JSX.Element[] | null = this.props.actions ? this.props.actions.map((action: ActionablePanelAction) => {
            return (
                <ActionButton key={'action-' + (i++)} action={action}/>
            );
        }) : null;
        const actions: JSX.Element | null = rows ? (<div className="panel-action-buttons">{rows}</div>) : null;

        const panelClass: string  = `actionable-panel panel panel-${this.props.panelClass || 'default'}`;

        return (
            <div className={panelClass}>
                <div className="panel-heading">
                    <h3 className="panel-title">{this.props.title}</h3>
                    {actions ? actions : ''}
                </div>
                <div className="panel-body">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
