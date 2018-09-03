import * as React from 'react';
import { render as ReactDOMRender } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { Editor } from './editor';
import { State } from './state';
import configureStore from './store';
import 'bootstrap/dist/js/bootstrap';

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
