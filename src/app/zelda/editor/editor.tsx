import * as React from 'react';
import ToolBar from './toolbar';
import { ZeldaGame } from '../ZeldaGame';
import VisibleMainContent from './containers/VisibleMainContent';

export interface EditorProps {
    game: ZeldaGame;
}

export interface EditorState {
}

export class Editor extends React.Component<EditorProps, EditorState> {

    state: EditorState = {};

    constructor() {
        super();
        //this.changeName = this.changeName.bind(this);
    }

    render() {
        //const myButton: any = React.createElement( Button, {bsStyle: 'success'}, 'Hello World' );
        //
        // React.render( myButton, document.getElementById('react-content') );
        return (

            <div>
                <ToolBar/>
                <VisibleMainContent/>
            </div>
        );
    }
}
