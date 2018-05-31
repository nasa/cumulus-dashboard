import LocalizedStrings from 'localized-strings';

function getCustomInterfaceLanguage() {
  return process.env.LANG;
}

export const strings = new LocalizedStrings({
  gitc: {
    add_a_collection: 'Add a Layer',
    all_collections: 'All Layers',
    all_granules: 'All Products',
    associated_collections: 'Associated Layers',
    back_to_collections: "Back to Layers",
    back_to_granules: "Back to Products",
    collection: 'Layer',
    collection_id: 'Layer ID',
    collection_logs: 'Layer Logs',
    collection_name: 'Layer Name',
    collection_overview: 'Layer Overview',
    collections: 'Layers',
    granule: 'Product',
    granules: 'Products',
    granules_updated: 'Products Updated',
    granules_errors: 'Products Errors',
    granules_completed: 'Products Completed',
    granules_failed: 'Products Failed',
    granule_overview: 'Product Overview',
    granules_running: 'Products Running',
    remove_from_cmr: 'Remove from OnEarth',
    running_granules: 'Running Products',
    view_granules_overview: 'View Product Overview'
  },
  cmr: {
    add_a_collection: 'Add a Collection',
    all_collections: 'All Granules',
    all_granules: 'All Granules',
    associated_collections: 'Associated collections',
    back_to_collections: "Back to Collections",
    back_to_granules: "Back to Granules",
    collection: 'Collection',
    collection_id: 'Collection ID',
    collection_logs: 'Collection Logs',
    collection_name: 'Collection Name',
    collection_overview: 'Collection Overview',
    collections: 'Collections',
    granule: 'Granule',
    granules: 'Granules',
    granules_updated: 'Granules Updated',
    granules_errors: 'Granules Errors',
    granule_overview: 'Granule Overview',
    granules_running: 'Granule Running',
    remove_from_cmr: 'Remove from CMR',
    running_granules: 'Running Granules',
    view_granules_overview: 'View Granule Overview'
  }
}, getCustomInterfaceLanguage);

