<template>

    <div>

        <!--
            Spawn style:
            <zelda-select choices="vm.spawnStyles" selection="vm.spawnStyle"></zelda-select>

            Enemy group:
            {/*<zelda-select choices="vm.choices" selection="vm.selectedEnemyGroup" none-option="true"*/}
            {/*on-change="vm.selectedEnemyGroupChanged(newValue)"></zelda-select>*/}
        -->

        <div class="modifiable-table">

            <v-data-table
                :dense="dense"
                :headers="headers"
                :items="getAllItems()"
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
            </v-data-table>

        </div>

        <v-dialog v-model="showModifyRowDialog" max-width="500px" @click:outside="onCancel"
                  @keydown.esc="onCancel">

            <v-card>
                <v-card-title>
                    <span class="headline">{{dialogTitle}}</span>
                </v-card-title>

                <v-card-text>
                    <v-container v-if="rowBeingModified">

                        <v-row>
                            <v-col class="xs6">
                                <v-select label="Type" :items="enemyTypes"
                                          v-model="rowBeingModified.type"/>
                            </v-col>
                            <v-col class="xs6">
                                <v-select label="Color (Strength)" :items="enemyStrengths"
                                          v-model="rowBeingModified.strength"/>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-text-field label="Count" v-model="rowBeingModified.count"/>
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
</template>

<script lang="ts">
import Vue from 'vue';
import { EnemyGroup, EnemyInfo } from '../EnemyGroup';
import { Enemy } from '../enemy/Enemy';
import { v4 as uuidv4 } from 'uuid';

export default Vue.extend({

    name: 'EnemySelector',
    components: {},

    props: {
        game: Object, // ZeldaGame
        value: Object, // EnemyGroup
    },

    data() {
        return {
            title: '',
            rightAlignButtons: false,
            itemName: 'Enemy Group',
            itemKey: 'id',
            validationFunc: null, // any
            enemyTypes: [
                { text: 'Octorok', value: 'Octorok' },
                { text: 'Moblin', value: 'Moblin' },
                { text: 'Tektite', value: 'Tektite' },
                { text: 'Lynel', value: 'Lynel' }
            ],
            enemyStrengths: [
                { text: 'Blue (strong)', value: 'blue' },
                { text: 'Red (weak)', value: 'red' }
            ],
            headers: [ // ModifiableTableHeader[]
                { text: 'Enemy', value: 'type' },
                { text: 'Strength', value: 'strength' },
                { text: 'Count', value: 'count' }
            ],
            deleteDialog: false,
            showModifyRowDialog: false,
            modifiedItemKey: null, // string
            rowBeingModified: null, // EnemyInfo | null,
            selectedItems: [], // EnemyInfo[] = [];
            dense: false, // boolean = false;
            saveDisabled: false, // boolean = false;
        };
    },

    methods: {
        getAllItems(): EnemyInfo[] {
            // Avoid errors from bogus initial data
            return this.value ? this.value.enemies : [];
        },

        setAllItems(items: EnemyInfo[]) {
            // Update our entire EnemyGroup prop, which will in turn refresh our
            // 'allItems' generated prop
            const newValue: EnemyGroup = this.value.clone();
            newValue.enemies = items;
            this.$emit('input', newValue);
        },

        onSave() {
            const newDataList: EnemyInfo[] = this.value.enemies.slice();
            const index: number = newDataList.findIndex((item: EnemyInfo) => {
                return (item as any)[this.itemKey] === this.modifiedItemKey;
            });

            const value: EnemyInfo = this.rowBeingModified!;

            if (index > -1) {
                newDataList.splice(index, 1, value);
            }
            else {
                // Generate a key if it isn't a natural key that the user had to enter
                (value as any)[this.itemKey] = uuidv4();
                newDataList.push(value);
            }

            // Go through generated property setter since our data is more than just an array
            this.setAllItems(newDataList);

            this.showModifyRowDialog = false;
            this.selectedItems.length = 0;
            this.refreshRowBeingModified();
        },

        onSelectedItemsChanged() {
            this.refreshRowBeingModified();
        },

        getInitialValue(): EnemyInfo {
            return {
                id: uuidv4(),
                type: this.enemyTypes[0].value,
                count: 2,
                strength: 'red'
            };
        },

        onCancel() {
            this.showModifyRowDialog = false;
            this.refreshRowBeingModified();
        },

        onCancelDelete() {
            this.deleteDialog = false;
        },

        onDeleteItem() {
            const selectedKey: any = (this.rowBeingModified as any)[this.itemKey];

            const newDataList: EnemyInfo[] = this.value.enemies.filter((v: EnemyInfo) => {
                return (v as any)[this.itemKey] !== selectedKey;
            });

            // Go through generated property setter since our data is more than just an array
            this.setAllItems(newDataList);

            this.deleteDialog = false;
            this.selectedItems.length = 0;
            this.refreshRowBeingModified();
        },

        refreshRowBeingModified() {
            this.rowBeingModified = (this.selectedItems.length > 0
                ? JSON.parse(JSON.stringify(this.selectedItems[0])) : this.getInitialValue()) as EnemyInfo;
            this.saveDisabled = this.saveButtonDisabled;
        },

        showAddOrEditModal(newRecord: boolean) {
            // Remember the key of the item being edited, or null if this is for a new item
            this.modifiedItemKey = newRecord ? null : (this.selectedItems[0] as any)[this.itemKey] as string;

            // Clone the record to pass to the callback
            this.rowBeingModified = (newRecord ? this.getInitialValue()
                : JSON.parse(JSON.stringify(this.selectedItems[0]))) as EnemyInfo;
            this.showModifyRowDialog = true;
        }
    },

    computed: {
        deleteDialogTitle(): string {
            return `Delete ${this.itemName}`;
        },

        dialogTitle(): string {
            return (this.selectedItems.length ? 'Edit ' : 'New ') + this.itemName;
        },

        saveButtonDisabled(): boolean {
            if (!this.rowBeingModified) {
                return true;
            }

            const origRow: EnemyInfo | null = this.modifiedItemKey ? this.selectedItems[0] : null;
            return !!this.validationFunc && !this.validationFunc(this.rowBeingModified, origRow, this.getAllItems());
        },
    },

    selectedEnemyGroupChanged(newGroup: string) {
        const enemies: EnemyInfo[] = [];

        switch (newGroup) {
            case 'Octorok':
                enemies.push({ id: uuidv4(), type: 'Octorok', strength: 'blue', count: 2 });
                enemies.push({ id: uuidv4(), type: 'Octorok', count: 2 });
                break;
            case 'Moblin':
                enemies.push({ id: uuidv4(), type: 'Moblin', strength: 'blue', count: 2 });
                enemies.push({ id: uuidv4(), type: 'Moblin', count: 2 });
                break;
            case 'Tektite':
                enemies.push({ id: uuidv4(), type: 'Tektite', strength: 'blue', count: 2 });
                enemies.push({ id: uuidv4(), type: 'Tektite', count: 2 });
                break;
            case 'Lynel':
                enemies.push({ id: uuidv4(), type: 'Tektite', count: 2 });
                break;
        }

        // this.curScreen.enemyGroup = new EnemyGroup('random', enemies);

        // Go through generated property setter since our data is more than just an array
        this.setAllItems(enemies);
    },
});
</script>

<style lang="scss" scoped>
</style>
