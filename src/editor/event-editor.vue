<template>
    <div>

        <div class="modifiable-table">

                <v-data-table
                    :dense="dense"
                    :headers="headers"
                    :items="getAllItems()"
                    :items-per-page="5"
                    :return-object="true"
                    select-strategy="single"
                    show-select
                    v-model="selectedItems"
                    @input="onSelectedItemsChanged"
                >

                <template v-slot:top>

                    <v-toolbar flat color="white">

                        <span class="title">{{title}}</span>

                        <v-spacer v-if="title || rightAlignButtons"/>

                        <v-btn color="primary" text icon @click="showAddOrEditModal(true)" data-testId="add-event-button">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                        <v-btn color="primary" text icon @click="showAddOrEditModal(false)" data-testId="edit-event-button" :disabled="selectedItems.length === 0">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn color="primary" text icon @click="deleteDialog = true" data-testId="delete-event-button" :disabled="selectedItems.length === 0">
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

                <v-card data-testId="edit-event-modal">
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

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Event } from '@/event/Event';
import { GoDownStairsEvent } from '@/event/GoDownStairsEvent';
import { Position } from '@/Position';
import { ChangeScreenWarpEvent } from '@/event/ChangeScreenWarpEvent';
import { ChangeScreenWarpEventGenerator, EventGenerator, GoDownStairsEventGenerator } from '@/editor/event-generators';

const props = defineProps<{
    game: any,
    modelValue: Event<any>[]
}>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: Event<any>[]): void
}>();

const title = ref('');
const rightAlignButtons = ref(false);
const itemName = ref('Event');
const itemKey = ref('id');
const validationFunc = ref<any>(null);

const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const cols = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const screenRows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const screenCols = ref<number[]>([]);

const headers = [
    { title: 'Type', value: 'type' },
    { title: 'Description', value: 'desc' }
];

const dense = ref(false);

const generators = [
    new GoDownStairsEventGenerator(),
    new ChangeScreenWarpEventGenerator()
];

const generatorSelectItems = [
    { title: 'Go Down Stairs', value: generators[0] },
    { title: 'Warp on Screen Change', value: generators[1] }
];

const maps = [
    { title: 'Overworld', value: 'overworld' },
    { title: 'Level 1', value: 'level1' }
];

const deleteDialog = ref(false);
const showModifyRowDialog = ref(false);
const modifiedItemKey = ref<string | null>(null);
const rowBeingModified = ref<Event<any> | null>(null);
const selectedItems = ref<Event<any>[]>([]);
const saveDisabled = ref(false);
const newGenerator = ref<EventGenerator<any>>(generators[0]);

function typeColumnRenderer(eventType: string): string {
    return generatorSelectItems.find((item: any) => item.value.type === eventType)?.title ?? eventType;
}

function descColumnRenderer(cellValue: Event<any>): string {
    if (cellValue instanceof GoDownStairsEvent) {
        const sourceTile: Position = cellValue.getTile();
        const map: string = cellValue.destMap;
        const screen: Position = cellValue.destScreen;
        const destPos: Position = cellValue.destPos;
        return `(${sourceTile.row}, ${sourceTile.col}) to ${map}, screen (${screen.row}, ${screen.col}), pos (${destPos.row}, ${destPos.col})`;
    } else if (cellValue instanceof ChangeScreenWarpEvent) {
        const map: string = cellValue.destMap;
        const screen: Position = cellValue.destScreen;
        const destPos: Position = cellValue.destPos;
        return `Warp to ${map}, screen (${screen.row}, ${screen.col}), pos (${destPos.row}, ${destPos.col})`;
    }
    return cellValue.toString();
}

function getAllItems(): Event<any>[] {
    return props.modelValue;
}

function setAllItems(items: Event<any>[]) {
    emit('update:modelValue', items);
}

function isSaveButtonDisabled(): boolean {
    if (!rowBeingModified.value) return true;
    const origRow: Event<any> | null = modifiedItemKey.value ? selectedItems.value[0] : null;
    return !!validationFunc.value && !validationFunc.value(rowBeingModified.value, origRow, getAllItems());
}

function moveTableRow(row: number, delta: number) {
    const newValue: Event<any>[] = getAllItems().slice();
    const temp: Event<any> = newValue[row + delta];
    newValue[row + delta] = newValue[row];
    newValue[row] = temp;
    setAllItems(newValue);
}

function onCancel() {
    showModifyRowDialog.value = false;
    refreshRowBeingModified();
}

function onCancelDelete() {
    deleteDialog.value = false;
}

function onDeleteItem() {
    const selectedKey: any = (rowBeingModified.value as any)[itemKey.value];
    const newDataList: Event<any>[] = props.modelValue.filter((v: Event<any>) => {
        return (v as any)[itemKey.value] !== selectedKey;
    });
    emit('update:modelValue', newDataList);
    deleteDialog.value = false;
    selectedItems.value.length = 0;
    refreshRowBeingModified();
}

function onSave() {
    const newDataList: Event<any>[] = props.modelValue.slice();
    const index: number = newDataList.findIndex((item: Event<any>) => {
        return (item as any)[itemKey.value] === modifiedItemKey.value;
    });
    const generator: EventGenerator<any> = newGenerator.value;
    const value: Event<any> = rowBeingModified.value!;
    generator.setTile(value.tile);
    generator.setDestination(value.destMap, value.destScreen, value.destPos);
    const event: Event<any> = generator.generate();
    if (index > -1) {
        newDataList.splice(index, 1, event);
    } else {
        (event as any)[itemKey.value] = Date.now().toString(10);
        newDataList.push(event);
    }
    emit('update:modelValue', newDataList);
    showModifyRowDialog.value = false;
    selectedItems.value.length = 0;
    refreshRowBeingModified();
}

function onSelectedItemsChanged() {
    refreshRowBeingModified();
}

function getInitialValue(): Event<any> {
    return new GoDownStairsEventGenerator().generate();
}

function refreshRowBeingModified() {
    rowBeingModified.value = (selectedItems.value.length > 0
        ? JSON.parse(JSON.stringify(selectedItems.value[0])) : getInitialValue()) as Event<any>;
    saveDisabled.value = isSaveButtonDisabled();
}

function showAddOrEditModal(newRecord: boolean) {
    modifiedItemKey.value = newRecord ? null : (selectedItems.value[0] as any)[itemKey.value] as string;
    rowBeingModified.value = (newRecord ? getInitialValue()
        : JSON.parse(JSON.stringify(selectedItems.value[0]))) as Event<any>;
    newGenerator.value = generators.find((g: EventGenerator<any>) => {
        return g.type === rowBeingModified.value!.type;
    })!;
    showModifyRowDialog.value = true;
}

const deleteDialogTitle = computed(() => `Delete ${itemName.value}`);
const dialogTitle = computed(() => (selectedItems.value.length ? 'Edit ' : 'New ') + itemName.value);

onMounted(() => {
    for (let i = 0; i <= 15; i += 0.5) {
        screenCols.value.push(i);
    }
});

watch(rowBeingModified, () => {
    saveDisabled.value = isSaveButtonDisabled();
}, { deep: true });
</script>

<style>

</style>
