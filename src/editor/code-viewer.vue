<template>

    <div class="col-md-12 code-viewer">

        <div style="margin-bottom: 1rem;">
            <v-btn color="primary" @click="refresh">Refresh</v-btn>
            <v-btn @click="copy">Copy</v-btn>
        </div>

        <pre ref="codeDiv"/>
    </div>
</template>

<script lang="ts">
import { MapData } from '../Map';

import highlighter from 'jshighlight/lib/highlighter';
import JsonParser from 'jshighlight/lib/parsers/json-parser';

import '../../node_modules/jshighlight/src/styles/jshl-default.css';

export default {

    name: 'CodeViewer',
    components: {},

    props: {
        game: Object,
    },

    methods: {

        refresh() {
            const start: Date = new Date();
            console.log('Refreshing started at: ' + start);

            const json: MapData = this.game.map.toJson();
            let jsonStr: string = JSON.stringify(json, null, 2);
            // console.log(jsonStr);
            // jsonStr = jsonStr.replace(/\[((\r?\n +\d+,)+(\r?\n +\d+))\]/g, '[$1]');
            jsonStr = jsonStr.replace(/( +)"tiles": \[(?:[ \d,\n\[\]]+)\][, \n]+\]/g, (match: string, p1: string) => {
                return match.replace(/ +/g, ' ').replace(/\n/g, '').replace(/\], \[/g, ']\,\n' + p1 + '  [');
            });
            // jsonStr = jsonStr.replace(/\n/g, '');

            const codeDiv: HTMLPreElement = this.$refs.codeDiv as HTMLPreElement;
            codeDiv.innerHTML = highlighter.highlight(new JsonParser(), jsonStr);

            console.log('Refreshing completed, took: ' + (new Date().getTime() - start.getTime()));
        },

        copy() {
            console.log('Copy that text!');
            const range: Range = document.createRange();
            range.selectNodeContents(this.$refs.codeDiv as Node);
            window.getSelection()!.removeAllRanges();
            window.getSelection()!.addRange(range);
            const success: boolean = document.execCommand('copy');
            console.log('Successful - ' + success);
            // range.setStart(element.get(0), 0);
            // range.setEnd(element.get(0), 1);
        }
    },
}
</script>

<style lang="scss" scoped>
.code-viewer {

    button {
        margin-right: 1rem;
    }

    pre {
        background: #fcfcfc;
        border: 1px solid #f0f0f0;
        max-height: 400px;
        overflow: auto;
    }
}
</style>
