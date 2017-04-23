import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Main} from './editor';
import configureStore from './store';

// Webpack makes you import your HTML and CSS.  WTF?
//import 'editor.html';
import 'editor.css';
import {Store} from 'react-redux';
import {State} from './state';

const store: Store<State> = configureStore();

ReactDOM.render(
    React.createElement(Main, { game: store.getState().game }),
    document.getElementById('react-content')
);
