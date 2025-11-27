import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RenderResult, render, screen, within } from '@testing-library/vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { type Plugin } from 'vue';
import userEvent, { UserEvent } from '@testing-library/user-event';
import EnemySelector from '../../src/editor/enemy-selector.vue';
import { ZeldaGame } from '@/ZeldaGame';
import { EnemyGroup } from '@/EnemyGroup';

const mapData = { tiles: [ 1, 2, 3 ], other: 'data' };
const mockMap = {
    toJson: vi.fn(() => mapData),
};

const mockGame = {
    map: mockMap,
} as unknown as ZeldaGame;

describe('EnemySelector', () => {
    let vuetify: Plugin;
    let user: UserEvent;
    let wrapper: RenderResult;

    beforeEach(() => {
        vuetify = createVuetify({
            components,
            directives,
        });
        user = userEvent.setup();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('when there are no enemy groups yet', () => {
        const modelValue = new EnemyGroup();

        beforeEach(() => {
            wrapper = render(EnemySelector, {
                props: {game: mockGame, modelValue},
                global: {plugins: [ vuetify ]},
            });
        });

        it('renders an enabled button to add enemies', () => {
            expect(screen.getByTestId('add-enemies-button')).toBeEnabled();
        });

        it('renders a disabled button to edit enemies', () => {
            expect(screen.getByTestId('edit-enemies-button')).toBeDisabled();
        });

        it('renders a disabled button to remove enemies', () => {
            expect(screen.getByTestId('delete-enemies-button')).toBeDisabled();
        });

        it('shows a table stating there are currently no enemies', () => {
            const table = screen.getByRole('table');
            const bodyRows = within(table).getAllByRole('row');
            expect(bodyRows).toHaveLength(2); // Including header row
            const firstRowCells = within(bodyRows[1]).getAllByRole('cell');
            expect(firstRowCells).toHaveLength(1);
            expect(firstRowCells[0].textContent).toEqual('No data available');
        });

        it('shows a modal to add enemies when the add button is clicked', async() => {
            expect(screen.queryByTestId('modify-row-dialog')).toBeNull();
            await user.click(screen.getByTestId('add-enemies-button'));
            expect(screen.getByTestId('modify-row-dialog')).toBeInTheDocument();
        });

        describe('when enemies are added', () => {
            beforeEach(async() => {
                expect(screen.queryByTestId('modify-row-dialog')).not.toBeInTheDocument();
                await user.click(screen.getByTestId('add-enemies-button'));
                expect(screen.getByTestId('modify-row-dialog')).toBeVisible();

                const select = screen.getByLabelText('Type');
                await user.click(select);
                const lynelOption = screen.getByText('Lynel');
                await user.click(lynelOption);
                const countInput = screen.getByLabelText('Count');
                await user.clear(countInput);
                await user.type(countInput, '3');
            });

            it('updates the model with the new value when Save is clicked', async() => {
                await user.click(screen.getByText('Save'));
                expect(screen.queryByTestId('modify-row-dialog')).not.toBeVisible();

                expect(wrapper.emitted()).toHaveProperty('update:modelValue');
                expect(wrapper.emitted()['update:modelValue']).toHaveLength(1);
                expect(wrapper.emitted()['update:modelValue'][0]).toHaveLength(1);
                const value = wrapper.emitted<EnemyGroup[]>()['update:modelValue'][0][0];
                expect(value.spawnStyle).toEqual('random');
                expect(value.enemies).toHaveLength(1);
                expect(value.enemies[0].type).toEqual('Lynel');
                expect(value.enemies[0].strength).toEqual('red');
                expect(value.enemies[0].count).toEqual('3');
            });

            it('does not update the model value if Cancel is clicked', async() => {
                await user.click(screen.getByText('Cancel'));
                expect(screen.queryByTestId('modify-row-dialog')).not.toBeVisible();

                expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');
            });
        });
    });

    describe('when there is at least one group of enemies already displayed', () => {
        const modelValue = new EnemyGroup('random', [
            {
                id: 'group-1',
                type: 'Moblin',
                strength: 'blue',
                count: 2,
            },
            {
                id: 'group-2',
                type: 'Moblin',
                strength: 'red',
                count: 1,
            },
        ]);

        beforeEach(() => {
            wrapper = render(EnemySelector, {
                props: {game: mockGame, modelValue},
                global: {plugins: [ vuetify ]},
            });
        });

        it('renders an enabled button to add enemies', () => {
            expect(screen.getByTestId('add-enemies-button')).toBeEnabled();
        });

        it('renders a disabled button to edit enemies', () => {
            expect(screen.getByTestId('edit-enemies-button')).toBeDisabled();
        });

        it('renders a disabled button to remove enemies', () => {
            expect(screen.getByTestId('delete-enemies-button')).toBeDisabled();
        });

        it('shows a row in the table for each enemy group', () => {
            const table = screen.getByRole('table');
            const rows = within(table).getAllByRole('row');
            expect(rows).toHaveLength(3); // Header + 2 enemy groups

            let cols = within(rows[1]).getAllByRole('cell');
            expect(cols).toHaveLength(4);
            expect(cols[0].textContent).toEqual(''); // Checkbox column
            expect(cols[1].textContent).toEqual('Moblin');
            expect(cols[2].textContent).toEqual('blue');
            expect(cols[3].textContent).toEqual('2');

            cols = within(rows[2]).getAllByRole('cell');
            expect(cols).toHaveLength(4);
            expect(cols[0].textContent).toEqual(''); // Checkbox column
            expect(cols[1].textContent).toEqual('Moblin');
            expect(cols[2].textContent).toEqual('red');
            expect(cols[3].textContent).toEqual('1');
        });

        describe('when a row is selected', () => {
            beforeEach(async() => {
                const firstRowCheckbox = screen.getAllByRole('checkbox')[0];
                await user.click(firstRowCheckbox);
            });

            it('edit button is enabled', () => {
                expect(screen.getByTestId('edit-enemies-button')).toBeEnabled();
            });

            it('remove button is enabled', () => {
                expect(screen.getByTestId('delete-enemies-button')).toBeEnabled();
            });

            describe('when the edit button is clicked', () => {
                beforeEach(async() => {
                    expect(screen.queryByTestId('modify-row-dialog')).toBeNull();
                    await user.click(screen.getByTestId('edit-enemies-button'));
                });

                it('displays a modal to edit the selected row', () => {
                    expect(screen.queryByTestId('modify-row-dialog')).toBeInTheDocument();
                });

                it('prepopulates values in the modal with the selected row', () => {
                    const modal = screen.getByTestId('modify-row-dialog');
                    // As of vuetify 3.10, getByDisplayValue() returns the value, not the display text, for selects.
                    // So we use getByText() This doesn't match testing-library's docs:
                    // https://testing-library.com/docs/queries/bydisplayvalue/
                    expect(within(modal).getByText('Moblin')).toBeInTheDocument();
                    expect(within(modal).queryByText('Octorok')).not.toBeInTheDocument(); // sanity
                    expect(within(modal).getByText('Blue (strong)')).toBeInTheDocument();
                    expect(within(modal).queryByText('Red (weak)')).not.toBeInTheDocument(); // sanity
                    expect(within(modal).getByDisplayValue('2')).toBeInTheDocument();
                });

                describe('when values are changed', () => {
                    beforeEach(async() => {
                        const select = screen.getByLabelText('Type');
                        await user.click(select);
                        const lynelOption = screen.getByText('Lynel');
                        await user.click(lynelOption);
                        const strengthInput = screen.getByLabelText('Color (Strength)');
                        await user.click(strengthInput);
                        const redOption = screen.getByText('Red (weak)');
                        await user.click(redOption);
                        const countInput = screen.getByLabelText('Count');
                        await user.clear(countInput);
                        await user.type(countInput, '9');
                    });

                    it('does not update the model value if Cancel is clicked', async() => {
                        await user.click(screen.getByText('Cancel'));
                        expect(screen.queryByTestId('modify-row-dialog')).not.toBeVisible();

                        expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');
                    });

                    it('updates the model with the new value if Save is clicked', async() => {
                        await user.click(screen.getByText('Save'));
                        expect(screen.queryByTestId('modify-row-dialog')).not.toBeVisible();

                        expect(wrapper.emitted()).toHaveProperty('update:modelValue');
                        expect(wrapper.emitted()['update:modelValue']).toHaveLength(1);
                        expect(wrapper.emitted()['update:modelValue'][0]).toHaveLength(1);
                        const value = wrapper.emitted<EnemyGroup[]>()['update:modelValue'][0][0];
                        expect(value.spawnStyle).toEqual('random');
                        expect(value.enemies).toHaveLength(2);

                        // The first element is the modified enemy group
                        expect(value.enemies[0].type).toEqual('Lynel');
                        expect(value.enemies[0].strength).toEqual('red');
                        expect(value.enemies[0].count).toEqual('9');

                        // The second element is the unchanged enemy group
                        expect(value.enemies[1].type).toEqual('Moblin');
                        expect(value.enemies[1].strength).toEqual('red');
                        expect(value.enemies[1].count).toEqual(1);
                    });
                });

                describe('when values are not changed', () => {
                    it('triggers a model update, but with no changes, when Save is clicked', async() => {
                        await user.click(screen.getByText('Save'));
                        expect(screen.queryByTestId('modify-row-dialog')).not.toBeVisible();

                        expect(wrapper.emitted()).toHaveProperty('update:modelValue');
                        expect(wrapper.emitted()['update:modelValue']).toHaveLength(1);
                        expect(wrapper.emitted()['update:modelValue'][0]).toHaveLength(1);
                        const value = wrapper.emitted<EnemyGroup[]>()['update:modelValue'][0][0];
                        expect(value.spawnStyle).toEqual('random');
                        expect(value.enemies).toHaveLength(2);

                        // The first element is the modified enemy group
                        expect(value.enemies[0].type).toEqual('Moblin');
                        expect(value.enemies[0].strength).toEqual('blue');
                        expect(value.enemies[0].count).toEqual(2);

                        // The second element is the unchanged enemy group
                        expect(value.enemies[1].type).toEqual('Moblin');
                        expect(value.enemies[1].strength).toEqual('red');
                        expect(value.enemies[1].count).toEqual(1);
                    });

                    it('does not update the model value if Cancel is clicked', async() => {
                        await user.click(screen.getByText('Cancel'));
                        expect(screen.queryByTestId('modify-row-dialog')).not.toBeVisible();

                        expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');
                    });
                });
            });

            describe('when the remove button is clicked', () => {
                beforeEach(async() => {
                    await user.click(screen.getByTestId('delete-enemies-button'));
                });

                it('displays a modal confirming removal of the enemy group', () => {
                    expect(screen.getByText('Are you sure you want to delete the selected Enemy Group?'))
                        .toBeInTheDocument();
                });

                describe('when "Yes" is clicked', () => {
                    beforeEach(async() => {
                        await user.click(screen.getByText('Yes'));
                    });

                    it('updates the model with the new value (without the selected enemy group)', () => {
                        expect(wrapper.emitted()).toHaveProperty('update:modelValue');
                        expect(wrapper.emitted()['update:modelValue']).toHaveLength(1);
                        expect(wrapper.emitted()['update:modelValue'][0]).toHaveLength(1);
                        const value = wrapper.emitted<EnemyGroup[]>()['update:modelValue'][0][0];
                        expect(value.spawnStyle).toEqual('random');
                        expect(value.enemies).toHaveLength(1);
                        expect(value.enemies[0].type).toEqual('Moblin');
                        expect(value.enemies[0].strength).toEqual('red');
                        expect(value.enemies[0].count).toEqual(1);
                    });
                });

                describe('when "No" is clicked', () => {
                    beforeEach(async() => {
                        await user.click(screen.getByText('No'));
                    });

                    it('does not update the model value', () => {
                        expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');
                    });
                });
            });
        });
    });
});
