import { ZeldaGame } from '../ZeldaGame';
import * as React from 'react';
import { MapData } from '../Map';

import highlighter from 'jshighlight/lib/highlighter';
import { JsonParser } from 'jshighlight/lib/parsers/json-parser';

import '../../../../node_modules/jshighlight/src/styles/jshl-default.css';

export interface CodeViewerProps {
    game: ZeldaGame;
}

interface CodeViewerState {
}

export default class CodeViewer extends React.Component<CodeViewerProps, CodeViewerState> {

    private codeDiv: HTMLPreElement;

    constructor(props: CodeViewerProps) {
        super(props);

        this.refresh = this.refresh.bind(this);
        this.copy = this.copy.bind(this);
    }

    refresh() {
        const start: Date = new Date();
        console.log('Refreshing started at: ' + start);

        const json: MapData = this.props.game.map.toJson();
        let jsonStr: string = JSON.stringify(json, null, 2);
        //console.log(jsonStr);
        //jsonStr = jsonStr.replace(/\[((\r?\n +\d+,)+(\r?\n +\d+))\]/g, '[$1]');
        jsonStr = jsonStr.replace(/( +)"tiles": \[(?:[ \d,\n\[\]]+)\][, \n]+\]/g, (match: string, p1: string) => {
            return match.replace(/ +/g, ' ').replace(/\n/g, '').replace(/\], \[/g, ']\,\n' + p1 + '  [');
        });
        //jsonStr = jsonStr.replace(/\n/g, '');

        this.codeDiv.innerHTML = highlighter.highlight(new JsonParser(), jsonStr);

        console.log('Refreshing completed, took: ' + (new Date().getTime() - start.getTime()));
    }

    copy() {
        console.log('Copy that text!');
        const range: Range = document.createRange();
        range.selectNodeContents(this.codeDiv);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        const success: boolean = document.execCommand('copy');
        console.log('Successful - ' + success);
        //range.setStart(element.get(0), 0);
        //range.setEnd(element.get(0), 1);
    }

    render() {

        const buttonStyle: any = {
            marginRight: '1rem'
        };

        return (
            <div className="code-viewer">

                <div className="panel panel-default">

                    <div className="panel-heading">
                        <h3 className="panel-title">Map JSON</h3>
                    </div>
                    <div className="panel-body">
                        <div style={{ marginBottom: '1rem' }}>
                            <button className="btn btn-primary" style={buttonStyle} onClick={this.refresh}>Refresh</button>
                            <button className="btn btn-default" style={buttonStyle} onClick={this.copy}>Copy</button>
                        </div>
                        <pre ref={(element: HTMLPreElement) => { this.codeDiv = element; }}/>
                    </div>
                </div>
            </div>
        );
    }
}
