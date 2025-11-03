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
                v-model="selectedItems"
                :dense="dense"
                :headers="headers"
                :items="getAllItems()"
                :items-per-page="5"
                :return-object="true"
                select-strategy="single"
                show-select
                @input="onSelectedItemsChanged"
            >
                <template #top>
                    <v-toolbar
                        flat
                        color="white"
                    >
                        <span class="title">{{ title }}</span>

                        <v-spacer v-if="title || rightAlignButtons" />

                        <v-btn
                            color="primary"
                            text
                            icon
                            data-testId="add-enemies-button"
                            @click="showAddOrEditModal(true)"
                        >
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                        <v-btn
                            color="primary"
                            text
                            icon
                            data-testId="edit-enemies-button"
                            :disabled="selectedItems.length === 0"
                            @click="showAddOrEditModal(false)"
                        >
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                            color="primary"
                            text
                            icon
                            data-testId="delete-enemies-button"
                            :disabled="selectedItems.length === 0"
                            @click="deleteDialog = true"
                        >
                            <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                    </v-toolbar>
                </template>
            </v-data-table>
        </div>

        <v-dialog
            v-model="showModifyRowDialog"
            max-width="500px"
            @click:outside="onCancel"
            @keydown.esc="onCancel"
        >
            <v-card data-testId="modify-row-dialog">
                <v-card-title>
                    <span class="headline">{{ dialogTitle }}</span>
                </v-card-title>

                <v-card-text>
                    <v-container v-if="rowBeingModified">
                        <v-row>
                            <v-col class="xs6">
                                <v-select
                                    v-model="rowBeingModified.type"
                                    label="Type"
                                    :items="enemyTypes"
                                />
                            </v-col>
                            <v-col class="xs6">
                                <v-select
                                    v-model="rowBeingModified.strength"
                                    label="Color (Strength)"
                                    :items="enemyStrengths"
                                />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-text-field
                                v-model="rowBeingModified.count"
                                label="Count"
                            />
                        </v-row>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        color="blue darken-1"
                        text
                        :disabled="saveDisabled"
                        @click="onSave"
                    >
                        Save
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="onCancel"
                    >
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="deleteDialog"
            max-width="500px"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">{{ deleteDialogTitle }}</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <slot
                                name="deleteDialogContent"
                                :selected-item="rowBeingModified"
                            >
                                <div v-if="rowBeingModified != null">
                                    Are you sure you want to delete the selected {{ itemName }}?
                                </div>
                                <div v-else>
                                    Nothing is selected to delete.
                                </div>
                            </slot>
                        </v-row>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="onDeleteItem"
                    >
                        Yes
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="onCancelDelete"
                    >
                        No
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { EnemyGroup, EnemyInfo } from '@/EnemyGroup';
import { ZeldaGame } from '@/ZeldaGame';

const props = defineProps<{
    game: ZeldaGame,
    modelValue: EnemyGroup,
}>();

const emit = defineEmits<(e: 'update:modelValue' | 'change', value: EnemyGroup) => void>();

const title = ref('');
const rightAlignButtons = ref(false);
const itemName = ref('Enemy Group');
const itemKey = ref<keyof EnemyInfo>('id');

const enemyTypes = [
    { title: 'Octorok', value: 'Octorok' },
    { title: 'Moblin', value: 'Moblin' },
    { title: 'Tektite', value: 'Tektite' },
    { title: 'Lynel', value: 'Lynel' },
];
const enemyStrengths = [
    { title: 'Blue (strong)', value: 'blue' },
    { title: 'Red (weak)', value: 'red' },
];
const headers = [
    { title: 'Enemy', value: 'type' },
    { title: 'Strength', value: 'strength' },
    { title: 'Count', value: 'count' },
];

const deleteDialog = ref(false);
const showModifyRowDialog = ref(false);
const modifiedItemKey = ref<string | null>(null);
const rowBeingModified = ref<EnemyInfo | null>(null);
const selectedItems = ref<EnemyInfo[]>([]);
const dense = ref(false);
const saveDisabled = ref(false);

const deleteDialogTitle = computed(() => `Delete ${itemName.value}`);
const dialogTitle = computed(() =>
    (selectedItems.value.length ? 'Edit ' : 'New ') + itemName.value,
);
const saveButtonDisabled = computed(() => {
    return !rowBeingModified.value;
    // TODO: Call an optional prop with a validation function when move to modifiableTable
});

function getAllItems(): EnemyInfo[] {
    return props.modelValue.enemies;
}

function setAllItems(items: EnemyInfo[]) {
    const newModelValue: EnemyGroup = props.modelValue.clone();
    newModelValue.enemies = items;
    emit('update:modelValue', newModelValue);
    emit('change', newModelValue);
}

function onSave() {
    const newDataList: EnemyInfo[] = props.modelValue.enemies.slice();
    const index: number = newDataList.findIndex((item: EnemyInfo) => {
        return item[itemKey.value] === modifiedItemKey.value;
    });

    const value = rowBeingModified.value;
    if (!value) {
        console.error('No value to save!');
        return;
    }

    if (index > -1) {
        newDataList.splice(index, 1, value);
    }
    else {
        value[itemKey.value] = uuidv4();
        newDataList.push(value);
    }

    setAllItems(newDataList);

    showModifyRowDialog.value = false;
    selectedItems.value.length = 0;
    refreshRowBeingModified();
}

function onSelectedItemsChanged() {
    refreshRowBeingModified();
}

function getInitialValue(): EnemyInfo {
    return {
        id: uuidv4(),
        type: enemyTypes[0].value,
        count: 2,
        strength: 'red',
    };
}

function onCancel() {
    showModifyRowDialog.value = false;
    refreshRowBeingModified();
}

function onCancelDelete() {
    deleteDialog.value = false;
}

function onDeleteItem() {
    const selectedKey = rowBeingModified.value?.[itemKey.value];
    const newDataList: EnemyInfo[] = props.modelValue.enemies.filter((v: EnemyInfo) => {
        return v[itemKey.value] !== selectedKey;
    });

    setAllItems(newDataList);

    deleteDialog.value = false;
    selectedItems.value.length = 0;
    refreshRowBeingModified();
}

function refreshRowBeingModified() {
    rowBeingModified.value = (selectedItems.value.length > 0
        ? JSON.parse(JSON.stringify(selectedItems.value[0]))
        : getInitialValue()) as EnemyInfo;
    saveDisabled.value = saveButtonDisabled.value;
}

function showAddOrEditModal(newRecord: boolean) {
    modifiedItemKey.value = newRecord ? null : selectedItems.value[0][itemKey.value] as string;
    rowBeingModified.value = (newRecord ? getInitialValue()
        : JSON.parse(JSON.stringify(selectedItems.value[0]))) as EnemyInfo;
    showModifyRowDialog.value = true;
}

// Optional: If you need to react to modelValue changes
watch(() => props.modelValue, () => {
    refreshRowBeingModified();
});

// If you need to expose selectedEnemyGroupChanged
function selectedEnemyGroupChanged(newGroup: string) {
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
    setAllItems(enemies);
}
</script>

<style scoped>
</style>
