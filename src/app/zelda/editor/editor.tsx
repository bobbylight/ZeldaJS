import * as React from 'react';
import { Button } from 'react-bootstrap';
import ToolBar from './toolbar';
import MainContent from './main-content';
import {ZeldaGame} from '../ZeldaGame';

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

                <MainContent game={this.props.game}/>
            </div>
        );
    }
}
