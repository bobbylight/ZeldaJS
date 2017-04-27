import {ZeldaGame} from '../ZeldaGame';
import * as React from 'react';
import {MapData} from '../Map';
import {Button, ButtonToolbar} from 'react-bootstrap';
import * as hljs from 'highlight.js';

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

        // Strip out values inserted by stuff like Angular's ng-repeat ($$hashKey, etc.).
        const replacer: any = (key: string, value: any) => {
            if (key === '$$hashKey') {
                return undefined;
            }
            return value;
        };

        const json: MapData = this.props.game.map.toJson();
        let jsonStr: string = JSON.stringify(json, replacer, 2);
        //console.log(jsonStr);
        //jsonStr = jsonStr.replace(/\[((\r?\n +\d+,)+(\r?\n +\d+))\]/g, '[$1]');
        jsonStr = jsonStr.replace(/( +)"tiles": \[(?:[ \d,\n\[\]]+)\][, \n]+\]/g, (match: string, p1: string) => {
            return match.replace(/ +/g, ' ').replace(/\n/g, '').replace(/\], \[/g, ']\,\n' + p1 + '  [');
        });
        //jsonStr = jsonStr.replace(/\n/g, '');

        const mapJson: string = hljs.highlight('json', jsonStr).value;

        this.codeDiv.innerHTML = mapJson;

        console.log('Refreshing completed, took: ' + (new Date().getTime() - start.getTime()));
    }

    copy() {
        console.log('Copy that text!');
        let range: Range = document.createRange();
        range.selectNodeContents(this.codeDiv);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        const success: boolean = document.execCommand('copy');
        console.log('Successful - ' + success);
        //range.setStart(element.get(0), 0);
        //range.setEnd(element.get(0), 1);
    }

    render() {

        return (
            <div className="code-viewer">

                <div className="panel panel-default">

                    <div className="panel-heading">
                        <h3 className="panel-title">Map JSON</h3>
                    </div>
                    <div className="panel-body">
                        <ButtonToolbar className="widget-area">
                            <Button bsStyle="primary" onClick={this.refresh}>Refresh</Button>
                            <Button onClick={this.copy}>Copy</Button>
                        </ButtonToolbar>
                        <pre ref={(element: HTMLPreElement) => { this.codeDiv = element; }}/>
                    </div>
                </div>
            </div>
        );
    }
}
