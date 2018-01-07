import * as React from 'react';
import { ZeldaGame } from '../ZeldaGame';
import VisibleMainContent from './containers/VisibleMainContent';
import VisibleToolBar from './containers/visible-toolbar';

export interface EditorProps {
    game: ZeldaGame;
}

export interface EditorState {
}

export class Editor extends React.Component<EditorProps, EditorState> {

    state: EditorState = {};

    constructor(props: EditorProps, context?: any) {
        super(props, context);
        //this.changeName = this.changeName.bind(this);
    }

    render() {
        //const myButton: any = React.createElement( Button, {bsStyle: 'success'}, 'Hello World' );
        //
        // React.render( myButton, document.getElementById('react-content') );
        return (

            <div>
                <VisibleToolBar/>
                <VisibleMainContent/>
            </div>
        );
    }
}
