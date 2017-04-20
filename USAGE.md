# Adding and editing records

In the Cumulus Dashboard you can create and edit existing collections and providers. Links to create new records are at the top of the collections and providers sections, and links to edit an existing records are in the detail pages for single collections and providers.

Whether you're editing or creating a new record, the form will be the same. This form corresponds to a data schema that Cumulus API defines, and which the dashboard queries. This means the form you see in the dashboard should always correspond with the schema that the API uses internally.

## Required items

Items marked with an asterisk `*` are required. If you omit a required field and try to submit the form, it will fail without contacting the API.

The displayed error message will then tell you which required fields you need to fill out before you can submit.

## Validation

Once you successfully submit a form, the API will do it's own validation to confirm that the data you submitted matches the format that it expects. Some ways it could return a failed notification is, for example, you try to create a collection using a collection name that already exists in the database.

For these, you should also see a corresponding error message at the top of the page.

## Editing existing records

Editing existing records is in practice almost the same as creating a new record, except that the form you see will be pre-filled with data from that record.

## Fixing a mistake

The forms do not yet support undo or redo actions, so if you accidentally make a modification that you cannot manually revert, refreshing the page will reset the form to the last saved state.

## On successful save

When you successfully save a record, you will be redirected to the overview for that section. If you do not see your changes immediately represented in the tables, check back in 15 or 30 seconds, as it sometimes takes a bit for the changes to propagate through the Cumulus system.
