import LocalizedStrings from 'localized-strings';

function getCustomInterfaceLanguage () {
  return process.env.LABELS || 'daac';
}

export const strings = new LocalizedStrings({
  daac: {
    active_collections: 'Active Collections',
    add_collection: 'Add Collection',
    all_collections: 'All Collections',
    all_granules: 'All Granules',
    associated_collections: 'Associated Collections',
    back_to_collections: 'Back to Collections',
    back_to_granules: 'Back to Granules',
    cmr: 'CMR',
    collection: 'Collection',
    collection_id: 'Collection ID',
    collection_granules: 'CollectionGranules',
    collection_logs: 'Collection Logs',
    collection_name: 'Collection Name',
    collection_overview: 'Collections Overview',
    collections: 'Collections',
    dashboard: 'CUMULUS Dashboard',
    executions: 'Executions',
    granule: 'Granule',
    granules: 'Granules',
    granules_updated: 'Granules Updated',
    granules_errors: 'Granules Errors',
    granule_overview: 'Granule Overview',
    granules_running: 'Granule Running',
    granules_completed: 'Granule Completed',
    granules_failed: 'Granule Failed',
    logo: 'cumulus-logo.png',
    operations: 'Operations',
    pdrs: 'Pdrs',
    reconciliation_reports: 'Reconciliation Reports',
    remove_from_cmr: 'Remove from CMR',
    running_granules: 'Running Granules',
    total_granules: 'Total Granules',
    view_all_granules: 'View All Granules',
    view_granules_overview: 'View Granule Overview',
    error_type: 'Error Type'
  },
}, getCustomInterfaceLanguage);

export default strings;
