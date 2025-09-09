import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RenderResult, render, screen, within } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import EventEditor from './event-editor.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { Plugin } from 'vue';
import { UserEvent } from '@testing-library/user-event/index';
import { Event, EventData } from '@/event/Event';
import { Position } from '@/Position';

function createEventMock(id: string, type = 'goDownStairs'): Event<EventData> {
    return {
        id,
        type,
        tile: new Position(1, 2),
        destMap: 'overworld',
        destScreen: new Position(3, 4),
        destPos: new Position(5, 6),
    } as unknown as Event<EventData>;
}

describe('EventEditor', () => {
    let vuetify: Plugin;
    let user: UserEvent;
    let wrapper: RenderResult;
    let modelValue: Event<EventData>[];

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

    describe('when no row is checked', () => {
        beforeEach(() => {
            modelValue = [
                createEventMock('1'),
                createEventMock('2', 'changeScreenWarp'),
            ];
            wrapper = render(EventEditor, {
                global: { plugins: [ vuetify ] },
                props: {
                    game: {},
                    modelValue,
                },
            });
        });

        it('renders an enabled button to add events', () => {
            expect(screen.getByTestId('add-event-button')).toBeEnabled();
        });

        it('renders a disabled button to edit events', () => {
            expect(screen.getByTestId('edit-event-button')).toBeDisabled();
        });

        it('renders a disabled button to remove events', () => {
            expect(screen.getByTestId('delete-event-button')).toBeDisabled();
        });

        it('renders table with the proper headers', () => {
            const table = screen.getByRole('table');
            const bodyRows = within(table).getAllByRole('row');
            expect(bodyRows).toHaveLength(3); // Including header row
            const headerCells = within(bodyRows[0]).getAllByRole('columnheader');
            expect(headerCells).toHaveLength(3);
            expect(headerCells[0].textContent).toEqual(''); // Checkbox column
            expect(headerCells[1].textContent).toEqual('Type');
            expect(headerCells[2].textContent).toEqual('Description');
        });

        it('renders a row for each event', () => {
            const table = screen.getByRole('table');
            const bodyRows = within(table).getAllByRole('row');
            expect(bodyRows).toHaveLength(3); // Including header row

            const firstRowCells = within(bodyRows[1]).getAllByRole('cell');
            expect(firstRowCells).toHaveLength(3);
            expect(firstRowCells[0].textContent).toEqual('');
            expect(firstRowCells[1].textContent).toEqual('Go Down Stairs');
            expect(firstRowCells[2].textContent).not.toBeNull(); // TODO

            const secondRowCells = within(bodyRows[2]).getAllByRole('cell');
            expect(secondRowCells).toHaveLength(3);
            expect(secondRowCells[0].textContent).toEqual('');
            expect(secondRowCells[1].textContent).toEqual('Warp on Screen Change');
            expect(secondRowCells[2].textContent).not.toBeNull(); // TODO
        });

        it('shows a modal to add events when the add button is clicked', async() => {
            expect(screen.queryByTestId('edit-event-modal')).toBeNull();
            await user.click(screen.getByTestId('add-event-button'));
            expect(screen.getByTestId('edit-event-modal')).toBeInTheDocument();
        });

        describe('when events are added', () => {
            beforeEach(async() => {
                expect(screen.queryByTestId('edit-event-modal')).not.toBeInTheDocument();
                await user.click(screen.getByTestId('add-event-button'));
                expect(screen.getByTestId('edit-event-modal')).toBeVisible();

                const select = screen.getByLabelText('Event Type');
                await user.click(select);
                const warpOption = screen.getByRole('option', { name: 'Warp on Screen Change' });
                await user.click(warpOption);
                const rowDropdowns = screen.getAllByLabelText('Row');
                for (const dropdown of rowDropdowns) {
                    await user.click(dropdown);
                    const rowOption = screen.getByRole('option', { name: '3' });
                    await user.click(rowOption);
                }
                const colDropdowns = screen.getAllByLabelText('Column');
                for (const dropdown of colDropdowns) {
                    await user.click(dropdown);
                    const colOption = screen.getByRole('option', { name: '4' });
                    await user.click(colOption);
                }
            });

            it('updates the model with the new value when Save is clicked', async() => {
                await user.click(screen.getByText('Save'));
                expect(screen.queryByTestId('edit-event-modal')).not.toBeVisible();

                expect(wrapper.emitted()).toHaveProperty('update:modelValue');
                expect(wrapper.emitted()['update:modelValue']).toHaveLength(1);
                expect(wrapper.emitted()['update:modelValue'][0]).toHaveLength(1);
                const value = wrapper.emitted<Event<EventData>[][]>()['update:modelValue'][0][0];
                expect(value).toHaveLength(3);

                // The first two events are the preseeded ones
                for (let i = 0; i < 2; i++) {
                    expect(value[i].id).toEqual((i + 1).toString());
                    expect(value[i].type).toEqual(i === 0 ? 'goDownStairs' : 'changeScreenWarp');
                    expect(value[i].tile.row).toEqual(1);
                    expect(value[i].tile.col).toEqual(2);
                    expect(value[i].destMap).toEqual('overworld');
                    expect(value[i].destScreen.row).toEqual(3);
                    expect(value[i].destScreen.col).toEqual(4);
                    expect(value[i].destPos.row).toEqual(5);
                    expect(value[i].destPos.col).toEqual(6);
                }

                // The third event is our added one
                expect(value[2].id).not.toBeNull(); /// Randomly generated
                expect(value[2].type).toEqual('changeScreenWarp');
                expect(value[2].tile.row).toEqual(0);
                expect(value[2].tile.col).toEqual(0);
                expect(value[2].destMap).toEqual('overworld');
                expect(value[2].destScreen.row).toEqual(3);
                expect(value[2].destScreen.col).toEqual(4);
                expect(value[2].destPos.row).toEqual(3);
                expect(value[2].destPos.col).toEqual(4);
            });

            it('does not update the model value if Cancel is clicked', async() => {
                await user.click(screen.getByText('Cancel'));
                expect(screen.queryByTestId('edit-event-modal')).not.toBeVisible();

                expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');
            })
        });
    });

    describe('when a row is checked', () => {
        beforeEach(async() => {
            modelValue = [
                createEventMock('1'),
                createEventMock('2', 'changeScreenWarp'),
            ];
            wrapper = render(EventEditor, {
                global: { plugins: [ vuetify ] },
                props: {
                    game: {},
                    modelValue,
                },
            });

            const firstRowCheckbox = screen.getAllByRole('checkbox')[0];
            await user.click(firstRowCheckbox);
        });

        it('edit button is enabled', () => {
            expect(screen.getByTestId('edit-event-button')).toBeEnabled();
        });

        it('remove button is enabled', () => {
            expect(screen.getByTestId('delete-event-button')).toBeEnabled();
        });

        describe('when the edit button is clicked', () => {
            beforeEach(async() => {
                expect(screen.queryByTestId('edit-event-modal')).toBeNull();
                await user.click(screen.getByTestId('edit-event-button'));
            });

            it('displays a modal to edit the selected row', () => {
                expect(screen.queryByTestId('edit-event-modal')).toBeInTheDocument();
            });

            it('prepopulates values in the modal with the selected row', () => {
                const modal = screen.getByTestId('edit-event-modal');
                expect(within(modal).getByDisplayValue('Go Down Stairs')).toBeInTheDocument();
                expect(within(modal).getByDisplayValue('Overworld')).toBeInTheDocument();
            });

            describe('when values are changed', () => {
                beforeEach(async() => {
                    const select = screen.getByLabelText('Event Type');
                    await user.click(select);
                    const warpOption = screen.getByRole('option', { name: 'Warp on Screen Change' });
                    await user.click(warpOption);
                    const rowDropdowns = screen.getAllByLabelText('Row');
                    for (const dropdown of rowDropdowns) {
                        await user.click(dropdown);
                        const rowOption = screen.getByRole('option', { name: '3' });
                        await user.click(rowOption);
                    }
                    const colDropdowns = screen.getAllByLabelText('Column');
                    for (const dropdown of colDropdowns) {
                        await user.click(dropdown);
                        const colOption = screen.getByRole('option', { name: '4' });
                        await user.click(colOption);
                    }
                });

                it('does not update the model value if Cancel is clicked', async() => {
                    await user.click(screen.getByText('Cancel'));
                    expect(screen.queryByTestId('edit-event-modal')).not.toBeVisible();

                    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');
                });

                it('updates the model with the new value if Save is clicked', async() => {
                    await user.click(screen.getByText('Save'));
                    expect(screen.queryByTestId('edit-event-modal')).not.toBeVisible();
                    const value = wrapper.emitted<Event<EventData>[][]>()['update:modelValue'][0][0];
                    expect(value).toHaveLength(2);

                    // The first event is modified
                    expect(value[0].id).not.toBeNull();
                    expect(value[0].type).toEqual('changeScreenWarp');
                    expect(value[0].tile.row).toEqual(1);
                    expect(value[0].tile.col).toEqual(2);
                    expect(value[0].destMap).toEqual('overworld');
                    expect(value[0].destScreen.row).toEqual(3);
                    expect(value[0].destScreen.col).toEqual(4);
                    expect(value[0].destPos.row).toEqual(3);
                    expect(value[0].destPos.col).toEqual(4);

                    // The second event is unchanged
                    expect(value[1].id).toEqual('2');
                    expect(value[1].type).toEqual('changeScreenWarp');
                    expect(value[1].tile.row).toEqual(1);
                    expect(value[1].tile.col).toEqual(2);
                    expect(value[1].destMap).toEqual('overworld');
                    expect(value[1].destScreen.row).toEqual(3);
                    expect(value[1].destScreen.col).toEqual(4);
                    expect(value[1].destPos.row).toEqual(5);
                    expect(value[1].destPos.col).toEqual(6);
                });
            });

            describe('when values are not changed', () => {
                it('triggers a model update, but with no changes, when Save is clicked', async() => {
                    await user.click(screen.getByText('Save'));
                    expect(screen.queryByTestId('edit-event-modal')).not.toBeVisible();

                    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
                    expect(wrapper.emitted()['update:modelValue']).toHaveLength(1);
                    expect(wrapper.emitted()['update:modelValue'][0]).toHaveLength(1);
                    const value = wrapper.emitted<Event<EventData>[][]>()['update:modelValue'][0][0];
                    expect(value).toHaveLength(2);

                    // The two events are unchanged
                    for (let i = 0; i < 2; i++) {
                        expect(value[i].id).not.toBeNull();
                        expect(value[i].type).toEqual(i === 0 ? 'goDownStairs' : 'changeScreenWarp');
                        expect(value[i].tile.row).toEqual(1);
                        expect(value[i].tile.col).toEqual(2);
                        expect(value[i].destMap).toEqual('overworld');
                        expect(value[i].destScreen.row).toEqual(3);
                        expect(value[i].destScreen.col).toEqual(4);
                        expect(value[i].destPos.row).toEqual(5);
                        expect(value[i].destPos.col).toEqual(6);
                    }
                });

                it('does not update the model value if Cancel is clicked', async() => {
                    await user.click(screen.getByText('Cancel'));
                    expect(screen.queryByTestId('edit-event-modal')).not.toBeVisible();

                    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');
                });
            });
        });
    });
});
