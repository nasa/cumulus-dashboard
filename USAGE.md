# Viewing data

Cumulus Dashboard shows comprehensive data on the status and workings of the Cumulus system. In this Dashboard you will find both aggregate and individual data slices.

Cumulus is a moving system. Almost all of the data views in Dashboard will update automatically to show the latest data every 15 seconds, so you don't have to refresh the page manually. Many pages provide a timer and adjacent clickable span to stop automatic updates, should you need to. Once stopped, you can click again to restart automatic updates.

## Searching and filtering

Many tables provide dropdowns to filter the data based on attributes like status or parent collection. Often, you will find search fields where you can enter arbitrary search strings. As you type, the Cumulus Dashboard and API will attempt to find records containing attributes with **infixes** that match your search string.

For example, say a granule belongs to a PDR with the name `MODAPSops8.15810456.PDR`. In the granules section under "All Granules," searching for "MODAPS" or "15810" will return a selection containing this granule.

## Sorting

In the data tables, small up and down arrows next to the table header means you can click re-order the table based on that column. Clicking the same header again will change the order from ascending to descending, and vice versa.

Some columns cannot be sorted, and these will not show small arrows.

# Performing actions on data

Depending on the type, some sections will allow you to modify the data using buttons. These actions range from reingesting to reprocessing and deleting.

Some actions cannot be performed on all records. For example, you can't delete a granule without removing it from CMR first. In general, these actions will be grayed out. However, if they are not grayed out but not allowed, the Dashboard will show an error when you try to perform the action.

Actions on individual records are performed as soon as you click the button. On bulk records, a notification will pop up asking you to confirm your action, then show a loading indicator that will close automatically when all actions are successfully sent to Cumulus API.

# Adding and editing records

In the Cumulus Dashboard you can create and edit existing collections and providers. Links to create new records are at the top of the collections and providers sections, and links to edit an existing records are in the detail pages for single collections and providers.

Whether you're editing or creating a new record, the form will be the same. This form corresponds to a data schema that Cumulus API defines, and which the Dashboard queries. This means the form you see in the Dashboard should always correspond with the schema that the API uses internally.

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

## Recovery options

If the dashboard is started with a truthful value for the environment variable ENABLE_RECOVERY.  "Recover Granule" and "Recover Collection" buttons are added to the the granule and collection dashboard pages, respectively. Which workflow is run by these buttons is configured in a collection under meta.granuleRecoveryWorkflow. If a user attempts to recover a granule from a collection that doesn't have this value configured, an error will show up on the dashboard and no workflow will be started.
