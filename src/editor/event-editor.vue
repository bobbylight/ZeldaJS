<template>
    <div>

        <div class="modifiable-table">

                <v-data-table
                    :dense="dense"
                    :headers="headers"
                    :items="allItems"
                    item-key="id"
                    :items-per-page="5"
                    :single-select="true"
                    show-select
                    v-model="selectedItems"
                    @input="onSelectedItemsChanged"
                >

                <template v-slot:top>

                    <v-toolbar flat color="white">

                        <span class="title">{{title}}</span>

                        <v-spacer v-if="title || rightAlignButtons"/>

                        <v-btn color="primary" text icon @click="showAddOrEditModal(true)">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                        <v-btn color="primary" text icon @click="showAddOrEditModal(false)" :disabled="selectedItems.length === 0">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn color="primary" text icon @click="deleteDialog = true" :disabled="selectedItems.length === 0">
                            <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                    </v-toolbar>
                </template>

                <template v-slot:item.type="{ value }">
                    {{typeColumnRenderer(value)}}
                </template>

                <template v-slot:item.desc="{ item }">
                    {{descColumnRenderer(item)}}
                </template>
            </v-data-table>

            <v-dialog v-model="showModifyRowDialog" max-width="500px" @click:outside="onCancel"
                      @keydown.esc="onCancel">

                <v-card>
                    <v-card-title>
                        <span class="headline">{{dialogTitle}}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container v-if="rowBeingModified">

                            <v-row>
                                <v-select label="Event Type" :items="generatorSelectItems" v-model="newGenerator"/>
                            </v-row>

                            <v-row v-if="newGenerator.type === 'goDownStairs'/*GoDownStairsEvent.EVENT_TYPE*/">
                                <v-col class="xs6">
                                    <v-select label="Source Row" :items="screenRows"
                                            v-model="rowBeingModified.tile.row"/>
                                </v-col>
                                <v-col class="xs6">
                                    <v-select label="Source Column" :items="screenCols"
                                              v-model="rowBeingModified.tile.col"/>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-select label="Destination Map" :items="maps" v-model="rowBeingModified.destMap"/>
                            </v-row>

                            <v-row>
                                <h4>Destination Screen</h4>
                            </v-row>
                            <v-row>
                                <v-col class="xs6">
                                    <v-select label="Row" :items="rows" v-model="rowBeingModified.destScreen.row"/>
                                </v-col>
                                <v-col class="xs6">
                                    <v-select label="Column" :items="cols" v-model="rowBeingModified.destScreen.col"/>
                                </v-col>
                            </v-row>

                            <v-row>
                                <h4>Destination Tile</h4>
                            </v-row>
                            <v-row>
                                <v-col class="xs6">
                                    <v-select label="Row" :items="screenRows" v-model="rowBeingModified.destPos.row"/>
                                </v-col>
                                <v-col class="xs6">
                                    <v-select label="Column" :items="screenCols" v-model="rowBeingModified.destPos.col"/>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer/>
                        <v-btn color="blue darken-1" text :disabled="saveDisabled" @click="onSave">Save</v-btn>
                        <v-btn color="blue darken-1" text @click="onCancel">Cancel</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="deleteDialog" max-width="500px">

                <v-card>
                    <v-card-title>
                        <span class="headline">{{deleteDialogTitle}}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                            <v-row>
                                <slot name="deleteDialogContent" :selected-item="rowBeingModified">
                                    <div v-if="rowBeingModified != null">
                                        Are you sure you want to delete the selected {{itemName}}?
                                    </div>
                                    <div v-else>
                                        Nothing is selected to delete.
                                    </div>
                                </slot>
                            </v-row>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer/>
                        <v-btn color="blue darken-1" text @click="onDeleteItem">Yes</v-btn>
                        <v-btn color="blue darken-1" text @click="onCancelDelete">No</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { ZeldaGame } from '../ZeldaGame';
import { Event } from '../event/Event';
import { GoDownStairsEvent } from '../event/GoDownStairsEvent';
import { Position } from '../Position';
import { ChangeScreenWarpEvent } from '../event/ChangeScreenWarpEvent';
import { ChangeScreenWarpEventGenerator, EventGenerator, GoDownStairsEventGenerator } from '@/editor/event-generators';
import ModifiableTable, { ModifiableTableHeader } from '@/editor/modifiable-table.vue';

@Component({ components: { ModifiableTable } })
export default class EventEditor extends Vue {

    @Prop({ required: true })
    game: ZeldaGame;

    @Prop({ required: true })
    value: Event<any>[];

    title: string = '';
    rightAlignButtons: boolean = false;

    itemName: string = 'Event';
    itemKey: string = 'id';
    validationFunc: any = null;

    rows: number[] = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    cols: number[] = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ];
    screenRows: number[] = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
    screenCols: number[] = [];

    headers: ModifiableTableHeader[] = [
        { text: 'Type', value: 'type' },
        { text: 'Description', value: 'desc'}
    ];

    deleteDialog: boolean = false;

    showModifyRowDialog: boolean = false;
    modifiedItemKey: string | null = null;
    rowBeingModified: Event<any> | null = null;
    selectedItems: Event<any>[] = [];
    dense: boolean = false;
    saveDisabled: boolean = false;

    generators: EventGenerator<any>[] = [
        new GoDownStairsEventGenerator(),
        new ChangeScreenWarpEventGenerator()
    ];

    generatorSelectItems: any[] = [
        { text: 'Go Down Stairs', value: this.generators[0] },
        { text: 'Warp on Screen Change', value: this.generators[1] }
    ];

    maps: any[] = [
        { text: 'Overworld', value: 'overworld' },
        { text: 'Level 1', value: 'level1' }
    ];

    newGenerator: EventGenerator<any> = this.generators[0];

    typeColumnRenderer(eventType: string): string {
        return this.generatorSelectItems.find((item: any) => item.value.type === eventType)
            .text;
    }

    descColumnRenderer(cellValue: Event<any>): string {

        if (cellValue instanceof GoDownStairsEvent) {

            const sourceTile: Position = cellValue.getTile();
            const map: string = cellValue.destMap;
            const screen: Position = cellValue.destScreen;
            const destPos: Position = cellValue.destPos;

            return `(${sourceTile.row}, ${sourceTile.col}) to ${map}, screen (${screen.row}, ${screen.col}), ` +
                `pos (${destPos.row}, ${destPos.col})`;
        } else if (cellValue instanceof ChangeScreenWarpEvent) {

            const map: string = cellValue.destMap;
            const screen: Position = cellValue.destScreen;
            const destPos: Position = cellValue.destPos;

            return `Warp to ${map}, screen (${screen.row}, ${screen.col}), ` +
                `pos (${destPos.row}, ${destPos.col})`;
        }

        return cellValue.toString();
    }

    get allItems(): Event<any>[] {
        return this.value;
    }

    set allItems(items: Event<any>[]) {
        this.$emit('input', items);
    }

    get deleteDialogTitle(): string {
        return `Delete ${this.itemName}`;
    }

    get dialogTitle(): string {
        return (this.selectedItems.length ? 'Edit ' : 'New ') + this.itemName;
    }

    isSaveButtonDisabled(): boolean {

        if (!this.rowBeingModified) {
            return true;
        }

        const origRow: Event<any> | null = this.modifiedItemKey ? this.selectedItems[0] : null;
        return !!this.validationFunc && !this.validationFunc(this.rowBeingModified, origRow, this.allItems);
    }

    mounted() {

        for (let i: number = 0; i <= 15; i += .5) {
            this.screenCols.push(i);
        }
    }

    moveTableRow(row: number, delta: number) {

        const newValue: Event<any>[] = this.allItems.slice();

        const temp: Event<any> = newValue[row + delta];
        newValue[row + delta] = newValue[row];
        newValue[row] = temp;

        this.allItems = newValue;
    }

    onCancel() {
        this.showModifyRowDialog = false;
        this.refreshRowBeingModified();
    }

    onCancelDelete() {
        this.deleteDialog = false;
    }

    onDeleteItem() {

        const selectedKey: any = (this.rowBeingModified as any)[this.itemKey];

        const newDataList: Event<any>[] = this.value.filter((v: Event<any>) => {
            return (v as any)[this.itemKey] !== selectedKey;
        });

        this.$emit('input', newDataList);

        this.deleteDialog = false;
        this.selectedItems.length = 0;
        this.refreshRowBeingModified();
    }

    @Watch('rowBeingModified', { deep: true })
    onRowBeingModifiedChanged() {
        this.saveDisabled = this.isSaveButtonDisabled();
    }

    onSave() {

        const newDataList: Event<any>[] = this.value.slice();
        const index: number = newDataList.findIndex((item: Event<any>) => {
            return (item as any)[this.itemKey] === this.modifiedItemKey;
        });

        const generator: EventGenerator<any> = this.newGenerator;
        const value: Event<any> = this.rowBeingModified!;
        generator.setTile(value.tile);
        generator.setDestination(value.destMap, value.destScreen, value.destPos);
        const event: Event<any> = generator.generate();

        if (index > -1) {
            newDataList.splice(index, 1, event);
        }
        else {
            // Generate a key if it isn't a natural key that the user had to enter
            (event as any)[this.itemKey] = Date.now().toString(10);
            newDataList.push(event);
        }

        this.$emit('input', newDataList);

        this.showModifyRowDialog = false;
        this.selectedItems.length = 0;
        this.refreshRowBeingModified();
    }

    onSelectedItemsChanged() {
        this.refreshRowBeingModified();
    }

    getInitialValue(): Event<any> {
        return new GoDownStairsEventGenerator().generate();
    }

    private refreshRowBeingModified() {

        this.rowBeingModified = (this.selectedItems.length > 0 ?
            JSON.parse(JSON.stringify(this.selectedItems[0])) : this.getInitialValue()) as Event<any>;
        this.saveDisabled = this.isSaveButtonDisabled();
    }

    showAddOrEditModal(newRecord: boolean) {

        // Remember the key of the item being edited, or null if this is for a new item
        this.modifiedItemKey = newRecord ? null : (this.selectedItems[0] as any)[this.itemKey] as string;

        // Clone the record to pass to the callback
        this.rowBeingModified = (newRecord ? this.getInitialValue() :
            JSON.parse(JSON.stringify(this.selectedItems[0]))) as Event<any>;
        this.newGenerator = this.generators.find((g: EventGenerator<any>) => {
            return g.type === this.rowBeingModified.type;
        });
        this.showModifyRowDialog = true;
    }
}
</script>

<style lang="less">

</style>
