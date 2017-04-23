import * as React from 'react';
import { Button } from 'react-bootstrap';
import ToolBar from './toolbar';
import MainContent from './main-content';
import {ZeldaGame} from '../ZeldaGame';

export interface MainProps {
    game: ZeldaGame;
}

export interface MainState {

}

export class Main extends React.Component<MainProps, MainState> {

    state: MainState = {};

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
