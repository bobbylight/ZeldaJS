import * as React from 'react';
import { Button } from 'react-bootstrap';
import ToolBar from './toolbar';

export interface MainProps {

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

                <div className="container">
                </div>
            </div>
        );
    }
}
