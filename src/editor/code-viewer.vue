<template>

    <div class="col-md-12 code-viewer">

        <div style="margin-bottom: 1rem;">
            <v-btn color="primary" @click="refresh">Refresh</v-btn>
            <v-btn @click="copy">Copy</v-btn>
        </div>

        <pre ref="codeDiv" data-testId="code"/>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MapData } from '@/Map';
import highlighter from 'jshighlight/lib/highlighter';
import JsonParser from 'jshighlight/lib/parsers/json-parser';
import '../../node_modules/jshighlight/src/styles/jshl-default.css';
import { ZeldaGame } from '@/ZeldaGame';

const props = defineProps({
    game: {
        type: ZeldaGame,
        required: false,
    }
});

const codeDiv = ref<HTMLPreElement | null>(null);

function refresh() {
    const start = new Date();
    console.log('Refreshing started at: ' + start);

    let jsonStr: string;
    const json: MapData | undefined = props.game?.map?.toJson();
    if (json) {
        jsonStr = JSON.stringify(json, null, 2);
        jsonStr = jsonStr.replace(/( +)"tiles": \[(?:[ \d,\n\[\]]+)\][, \n]+\]/g, (match: string, p1: string) => {
            return match.replace(/ +/g, ' ').replace(/\n/g, '').replace(/\], \[/g, ']\,\n' + p1 + '  [');
        });
    }
    else {
        jsonStr = '// No map loaded';
    }

    if (codeDiv.value) {
        codeDiv.value.innerHTML = highlighter.highlight(new JsonParser(), jsonStr);
    }

    console.log('Refreshing completed, took: ' + (new Date().getTime() - start.getTime()));
}

async function copy() {
    console.log('Copy that text!');
    if (codeDiv.value) {
        const range = document.createRange();
        range.selectNodeContents(codeDiv.value);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
        const text = codeDiv.value.textContent;
        console.log('Text: ' + text);
        await navigator.clipboard.writeText(text ?? '');
    }
}
</script>

<style scoped>
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
