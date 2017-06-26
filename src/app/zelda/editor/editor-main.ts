import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Editor} from './editor';
import configureStore from './store';
import 'bootstrap/dist/js/bootstrap';

// Webpack makes you import your HTML and CSS.  WTF?
//import 'editor.html';
import 'editor.css';
import {Store} from 'react-redux';
import {State} from './state';

const store: Store<State> = configureStore();

ReactDOM.render(
    React.createElement(Provider,
        { store: store },
        React.createElement(Editor, { game: store.getState().game })),
    document.getElementById('react-content')
);
