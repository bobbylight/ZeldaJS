import * as React from 'react';
import { render as ReactDOMRender } from 'react-dom';
import { Provider, Store } from 'react-redux';
import { Editor } from './editor';
import { State } from './state';
import configureStore from './store';
import 'popper.js';
import 'bootstrap';

// Webpack makes you import your HTML and CSS.  WTF?
//import 'editor.html';
import '../../../less/editor.less';

const store: Store<State> = configureStore();

ReactDOMRender(
    React.createElement(Provider,
        { store: store },
        React.createElement(Editor, { game: store.getState().game })),
    document.getElementById('react-content')
);
