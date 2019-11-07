# Table documentation

A lot of logic is encapsulated in the table components. They are central abstractions and wrap functionality like sorting, pagination, selection, and search. The main components are `sortable-table` and `list-view`.

## `sortable-table`

A basic table component that supports row selection and dumb sorting (see below).

**Props**

- **primaryIdx**: Column number to apply bold typeface to. Default is `0` or far-left column.
- **data**: Array of data items. Items can be objects or arrays, depending on the accessor functions defined in `row`.
- **header**: Array of strings representing the header row.
- **row**: Array of items representing columns in each row. Items can be accessor functions with the arguments `data[k], k, data` (where `k` is the index of the current loop), or string values, ie `"collectionName"`.
- **props**: Array of property names to send to Elasticsearch for a re-ordering query.
- **sortIdx**: The current index of the `props` array to sort by.
- **order**: Either 'desc' or 'asc', corresponding to sort order.
- **changeSortProps**: Callback when a new sort order is defined, passed an object with the properties `{ sortIdx, order }`.
- **onSelect**: Callback when a row is selected (or unselected), passed a string id corresponding to the `rowId` selector.
- **canSelect**: Boolean value defining whether 1. rows can be selected and 2. to render check marks.
- **selectedRows**: Array of row ID's corresponding to rows that are currently selected.
- **rowId**: String accessor to define as that row's id, ie `collectionName`.

Note, `props`, `sortIdx`, `order`, and `changeSortProps` only apply to components that implement smart searching, such as `list-view`. This base component does internal prop checking to determine whether it uses smart or dumb sorting, based on whether the above props are defined.

## `list-view`

Wraps `sortable-table` and implements auto-update and smart sort. When a new sort order is requested, `sortable-table` calls a callback in `list-view`, which in turn dispatches the new sort parameters to the redux store. When `list-view` detects the new query in `componentWillReceiveProps`, it cancels the previous auto-update interval and creates a new one with the updated query parameters.

**Props**

- **list**: Parent data structure, ie `state.granules.list` or `state.collections.list`. Expected to contain `{ data, inflight, error, meta }` properties corresponding to all `list` state objects.
- **dispatch**: Redux dispatch function.
- **action**: Redux-style action to send, ie `listCollections`.
- **tableHeader**: Corresponds to `sortableTable#header`.
- **tableRow**: Corresponds to `sortableTable#row`.
- **tableSortProps**: Corresponds to `sortableTable#props`.
- **sortIdx**: Corresponds to `sortableTable#sortIdx`.
- **query**: Array of configuration objects passed to `batch-async-command`.
- **rowId** Corresponds to `sortableTable#rowId`.

## Dumb vs smart sort

Dumb sorting uses `Array.sort()` within the component to re-order table data that has **already** been received from the API. Smart sorting initiates a new API request, passing the sort parameter to the server (elasticsearch) which returns a sorted response.

Dumb sorting is for smaller, simple tables that do not need pagination.
