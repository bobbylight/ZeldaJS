import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Main} from './editor';

// Webpack makes you import your HTML and CSS.  WTF?
//import 'editor.html';
import 'editor.css';

ReactDOM.render(React.createElement(Main), document.getElementById('react-content'));
