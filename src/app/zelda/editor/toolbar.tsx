import * as React from 'react';

interface ToolBarProps {

}

interface ToolBarState {

}

export default class ToolBar extends React.Component<ToolBarProps, ToolBarState> {

    state: ToolBarState = {};

    render() {
        return (

            <nav className="navbar navbar-inverse" role="navigation">
                <div className="container">

                    {/* Brand and toggle get grouped for better mobile display */}
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#bs-example-navbar-collapse-1">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#/"><img src="img/crest.png" className="banner-img"/>
                            Zelda Map Creator</a>
                    </div>

                    {/* Collect the nav links, forms, and other content for toggling */}
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="#/about">About</a></li>
                        </ul>
                    </div>
                    {/* /.navbar-collapse */}

                </div>

            </nav>
        );
    }
}
