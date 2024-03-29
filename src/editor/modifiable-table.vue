<template>
    <div class="modifiable-table">

        <v-data-table
                :dense="dense"
                :headers="headers"
                :items="allItems"
                :item-key="itemKey"
                :items-per-page="5"
                :single-select="true"
                show-select
                v-model="selectedItems"
                @input="onSelectedItemsChanged"
                class="elevation-1"
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

        <v-dialog v-model="showModifyRowDialog" max-width="500px" @click:outside="onCancel"
                  @keydown.esc="onCancel">

            <v-card>
                <v-card-title>
                    <span class="headline">{{dialogTitle}}</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <slot name="dialogContent" :selected-item="rowBeingModified">
                            Selected item: {{rowBeingModified}}
                        </slot>
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
import { Component, Prop, Watch } from 'vue-property-decorator';
// Being a precompiled library, we must explicitly import our
// peer dependency (Vuetify) dependencies.
// https://github.com/vuetifyjs/vuetify-loader/issues/70
import {
    VBtn, VCard, VCardActions, VCardText, VCardTitle, VContainer, VDataTable, VDialog, VIcon, VRow, VSpacer,
    VToolbar
} from 'vuetify/lib';

/**
 * Valid fields for a header in a modifiable table.
 */
export interface ModifiableTableHeader {
    text: string;
    value: string;
    align?: 'start' | 'center' | 'end';
    sortable?: boolean;
    filterable?: boolean;
    divider?: boolean;
    class?: string | string[];
    width?: string | number;
    filter?: (value: any, search: string, item: any) => boolean;
    sort?: (a: any, b: any) => number;
}

/**
 * A callback function to validate that a user's input for a row is complete
 * and valid.
 */
export interface ModifiableTableRowValidationFunction<T> {
    (newRowData: T, origRowData: T | null, allRecords: T[]): boolean;
}

/**
 * A table that allows the user to create, edit, delete, and optionally sort
 * records.
 */
@Component({
    components: {
        VBtn,
        VCard,
        VCardActions,
        VCardText,
        VCardTitle,
        VContainer,
        VDataTable,
        VDialog,
        VIcon,
        VRow,
        VSpacer,
        VToolbar
    }
})
export default class ModifiableTable<T> extends Vue {
    @Prop({ required: true })
    value!: T[]; // Named "value" for v-model support

    @Prop({ required: true })
    headers!: ModifiableTableHeader[];

    @Prop({ default: 'id' })
    itemKey!: string;

    @Prop({ default: 'Item' })
    itemName!: string;

    @Prop()
    validationFunc!: ModifiableTableRowValidationFunction<T> | null;

    @Prop({ required: false })
    title!: string;

    @Prop({ default: false })
    rightAlignButtons!: boolean;

    @Prop({ default: false })
    dense!: boolean;

    allItems: T[] = [];

    selectedItems: T[] = [];

    deleteDialog: boolean = false;

    showModifyRowDialog: boolean = false;
    rowBeingModified: T | null = null;
    modifiedItemKey: string | null = null;
    saveDisabled: boolean = true;

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

        const origRow: T | null = this.modifiedItemKey ? this.selectedItems[0] : null;
        return !!this.validationFunc && !this.validationFunc(this.rowBeingModified, origRow, this.allItems);
    }

    mounted() {
        // Need a gentle nudge the first time through
        this.onValueChanged(this.value);
        this.refreshRowBeingModified();
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

        const newDataList: T[] = this.value.filter((v: T) => {
            return (v as any)[this.itemKey] !== selectedKey;
        });

        this.$emit('input', newDataList);

        this.deleteDialog = false;
    }

    @Watch('rowBeingModified', { deep: true })
    onRowBeingModifiedChanged() {
        this.saveDisabled = this.isSaveButtonDisabled();
    }

    onSave() {
        const newDataList: T[] = this.value.slice();
        const index: number = newDataList.findIndex((item: T) => {
            return (item as any)[this.itemKey] === this.modifiedItemKey;
        });
        if (index > -1) {
            newDataList.splice(index, 1, this.rowBeingModified!);
        }
        else {
        // Generate a key if it isn't a natural key that the user had to enter
            (this.rowBeingModified as any)[this.itemKey] = Date.now().toString(10);
            newDataList.push(this.rowBeingModified!);
        }

        this.$emit('input', newDataList);

        this.showModifyRowDialog = false;
        this.selectedItems.length = 0;
        this.refreshRowBeingModified();
    }

    onSelectedItemsChanged() {
        this.refreshRowBeingModified();
    }

    @Watch('value')
    onValueChanged(newItems: any[]) {
        this.allItems = newItems.slice();
        this.selectedItems = [];
        this.rowBeingModified = null;
    }

    private refreshRowBeingModified() {
        this.rowBeingModified = (this.selectedItems.length > 0
            ? JSON.parse(JSON.stringify(this.selectedItems[0])) : {}) as T;
        this.saveDisabled = this.isSaveButtonDisabled();
    }

    showAddOrEditModal(newRecord: boolean) {
        // Remember the key of the item being edited, or null if this is for a new item
        this.modifiedItemKey = newRecord ? null : (this.selectedItems[0] as any)[this.itemKey] as string;

        // Clone the record to pass to the callback
        this.rowBeingModified = (newRecord ? {} : JSON.parse(JSON.stringify(this.selectedItems[0]))) as T;
        this.showModifyRowDialog = true;
    }
}
</script>

<style scoped>
.modifiable-table {

}
</style>
