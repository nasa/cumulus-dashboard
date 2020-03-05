# Table documentation

Our table components leverage [react-table](https://github.com/tannerlinsley/react-table/) to handle basic sorting, row selection, and resizable columns. The main components are `sortable-table` and `list-view`.

react-table's main hook is `useTable()`. Options are passed into this hook for the desired functionality.

## `sortable-table`

A basic table component that supports row selection and dumb sorting (see below).

**Props**

- **tableColumns**: This is an array containing the column configuration for the table. It is the value for the `columns` key in the options object that is passed to `useTable()`
  * Options for each column include:
    - Header: *text or component that will render as the header*
    - accessor: *key or function for obtaining value*
    - id: *unqiure column id. required if accessor is function*
    - disableSortBy: *set to true if the column should not be sortable*
    - width: *default is 125. set value if column needs to be wider/smaller*

  * Additional options can be found [here](https://github.com/tannerlinsley/react-table/blob/master/docs/api/useTable.md#column-options) or in the documation for a specific plugin hook

- **data**: Array of data items. Items can be any format.
- **sortIdx**: The id of the column to sort on.
- **changeSortProps**: Callback when a new sort order is defined, passed an object with the properties `{ sortIdx, order }`.
- **onSelect**: Callback when a row is selected (or unselected), passed an array containing the ids of all selected rows.
- **canSelect**: Boolean value defining whether 1. rows can be selected and 2. to render check marks.
- **rowId**: String or function that defines a particular row's id. Passed to `useTable` options via `getRowId`.

Note, `sortIdx` and `changeSortProps` only apply to components that implement smart searching, such as `list-view`. This base component does internal prop checking to determine whether it uses smart or dumb sorting, based on whether the above props are defined.

## `list-view`

Wraps `sortable-table` and implements auto-update and smart sort. When a new sort order is requested, `sortable-table` calls a callback in `list-view`, which in turn dispatches the new sort parameters to the redux store. When `list-view` detects the new query in `componentWillReceiveProps`, it cancels the previous auto-update interval and creates a new one with the updated query parameters.

**Props**

- **list**: Parent data structure, ie `state.granules.list` or `state.collections.list`. Expected to contain `{ data, inflight, error, meta }` properties corresponding to all `list` state objects.
- **dispatch**: Redux dispatch function.
- **action**: Redux-style action to send, ie `listCollections`.
- **sortIdx**: Corresponds to `sortableTable#sortIdx`.
- **query**: Array of configuration objects passed to `batch-async-command`.
- **rowId** Corresponds to `sortableTable#rowId`.

## Dumb vs smart sort

Dumb sorting uses react-table's built in sort functionality to sort table data that has **already** been received from the API. Smart sorting initiates a new API request, passing the sort parameter to the server (elasticsearch) which returns a sorted response. The `maunalSortBy` option passed to `useTable()` tells react-table whether we are doing server-side sorting (`true`) or letting react-table sort (`false`).

Dumb sorting is for smaller, simple tables that do not need pagination.
