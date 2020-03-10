'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  clearGranulesFilter,
  clearGranulesSearch,
  deleteCollection,
  filterGranules,
  getCollection,
  getCumulusInstanceMetadata,
  listGranules,
  searchGranules
} from '../../actions';
import { get } from 'object-path';
import {
  collectionName as collectionLabelForId,
  tally,
  lastUpdated,
  getCollectionId,
  collectionNameVersion
} from '../../utils/format';
import Dropdown from '../DropDown/dropdown';
import SimpleDropdown from '../DropDown/simple-dropdown';
import Search from '../Search/search';
import statusOptions from '../../utils/status';
import List from '../Table/Table';
import Bulk from '../Granules/bulk';
import Overview from '../Overview/overview';
import { tableColumns } from '../../utils/table-config/granules';
import { strings } from '../locale';
import DeleteCollection from '../DeleteCollection/DeleteCollection';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/'
  },
  {
    label: 'Collections',
    href: '/collections'
  },
  {
    label: 'Collection Overview',
    active: true
  }
];

class CollectionOverview extends React.Component {
  constructor (props) {
    super(props);

    this.displayName = 'CollectionOverview';

    [
      this.changeCollection,
      this.deleteMe,
      this.errors,
      this.generateQuery,
      this.gotoGranules,
      this.load,
      this.navigateBack,
      this.renderRunBulkGranulesButton
    ].forEach((fn) => (this[fn.name] = fn.bind(this)));
  }

  componentDidMount () {
    this.load();
  }

  componentDidUpdate (prevProps) {
    const { name, version } = this.props.match.params;
    const { name: prevName, version: prevVersion } = prevProps.match.params;

    if (name !== prevName || version !== prevVersion) {
      this.load();
    }
  }

  renderRunBulkGranulesButton () {
    return (
      <Bulk
        element='a'
        className='button button__bulkgranules button--green button__animation--md button__arrow button__arrow--md button__animation form-group__element--right link--no-underline'
        confirmAction={true}
        state={this.props.granules}
      />
    );
  }

  load () {
    const { name, version } = this.props.match.params;
    this.props.dispatch(getCumulusInstanceMetadata());
    this.props.dispatch(getCollection(name, version));
  }

  changeCollection (_, collectionId) {
    const { name, version } = collectionNameVersion(collectionId);
    this.props.history.push(`/collections/collection/${name}/${version}`);
  }

  generateQuery () {
    return {
      collectionId: getCollectionId(this.props.match.params)
    };
  }

  deleteMe () {
    const { name, version } = this.props.match.params;
    this.props.dispatch(deleteCollection(name, version));
  }

  navigateBack () {
    this.props.history.push('/collections/all');
  }

  gotoGranules () {
    this.props.history.push('/granules');
  }

  errors () {
    const { name, version } = this.props.match.params;
    const collectionId = getCollectionId({name, version});
    return [
      get(this.props.collections.map, [collectionId, 'error']),
      get(this.props.collections.deleted, [collectionId, 'error'])
    ].filter(Boolean);
  }

  renderOverview (record) {
    const data = get(record, 'data', {});
    const stats = get(data, 'stats', {});
    const overview = [
      [tally(stats.completed), strings.granules_completed],
      [tally(stats.failed), strings.granules_failed],
      [tally(stats.running), strings.granules_running]
    ];
    return <Overview items={overview} inflight={record.inflight} />;
  }

  renderDeleteButton () {
    const { match: { params }, collections } = this.props;
    const collectionId = getCollectionId(params);
    const deleteStatus = get(collections.deleted, [collectionId, 'status']);
    const hasGranules = get(
      collections.map[collectionId], 'data.stats.total', 0) > 0;

    return (
      <DeleteCollection
        collectionId={collectionId}
        errors={this.errors()}
        hasGranules={hasGranules}
        onDelete={this.deleteMe}
        onGotoGranules={this.gotoGranules}
        onSuccess={this.navigateBack}
        status={deleteStatus}
      />
    );
  }

  render () {
    const {
      match: { params },
      collections,
      granules: {
        list,
        list: { meta }
      }
    } = this.props;

    const collectionName = params.name;
    const collectionVersion = params.version;
    const collectionId = getCollectionId(params);
    const sortedCollectionIds = collections.list.data.map(getCollectionId).sort(
      // Compare collection IDs ignoring case
      (id1, id2) => id1.localeCompare(id2, 'en', { sensitivity: 'base' }));
    const record = collections.map[collectionId];

    // create the overview boxes
    const overview = record ? this.renderOverview(record) : <div></div>;

    return (
      <div className='page__component'>
        <section className='page__section page__section__controls'>
          <div className="collection__options--top">
            <ul>
              <li>
                <Breadcrumbs config={breadcrumbConfig} />
              </li>
              <li>
                <div className='dropdown__collection form-group__element--right'>
                  <SimpleDropdown
                    label={'Collection'}
                    title={'Collections Dropdown'}
                    value={getCollectionId(params)}
                    options={sortedCollectionIds}
                    id={'collection-chooser'}
                    onChange={this.changeCollection}
                    noNull={true}
                  />
                </div>
              </li>
            </ul>
          </div>
        </section>
        <section className='page__section page__section__header-wrapper'>
          <div className='heading-group'>
            <ul className='heading-form-group--left'>
              <li>
                <h1 className='heading--large heading--shared-content with-description'>
                  {collectionLabelForId(collectionId)}
                </h1>
              </li>
              <li>
                <Link
                  className='button button--copy button--small button--green'
                  to={{
                    pathname: '/collections/add',
                    state: {
                      name: collectionName,
                      version: collectionVersion
                    }
                  }}
                >
                  Copy
                </Link>
              </li>
              <li>
                <Link
                  className='button button--edit button--small button--green'
                  to={`/collections/edit/${collectionName}/${collectionVersion}`}
                >
                  Edit
                </Link>
              </li>
              <li>
                {this.renderDeleteButton()}
              </li>
            </ul>
            <span className="last-update">{lastUpdated(get(record, 'data.timestamp'))}</span>
          </div>
        </section>
        <section className='page__section page__section__overview'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--large heading--shared-content--right'>Granule Metrics</h2>
          </div>
          {overview}
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>
              {strings.total_granules}
              <span className='num--title'>
                {meta.count ? ` ${meta.count}` : 0}
              </span>
            </h2>
            <Link
              className='link--secondary link--learn-more'
              to={`/collections/collection/${collectionName}/${collectionVersion}/granules`}
            >
              {strings.view_all_granules}
            </Link>
          </div>
          <div className='filters filters__wlabels total_granules'>
            <ul>
              <li>
                <Search
                  dispatch={this.props.dispatch}
                  action={searchGranules}
                  clear={clearGranulesSearch}
                  placeholder='Search Granules'
                />
              </li>
              <li>
                <Dropdown
                  options={statusOptions}
                  action={filterGranules}
                  clear={clearGranulesFilter}
                  paramKey='status'
                  inputProps={{
                    placeholder: 'Status'
                  }}
                />
              </li>
              <li className="run_bulk">
                {this.renderRunBulkGranulesButton()}
              </li>
            </ul>
          </div>
          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listGranules}
            tableColumns={tableColumns}
            query={this.generateQuery()}
            rowId='granuleId'
            sortIdx='timestamp'
          />
        </section>
      </div>
    );
  }
}

CollectionOverview.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  dispatch: PropTypes.func,
  granules: PropTypes.object,
  collections: PropTypes.object,
  router: PropTypes.object
};

export default withRouter(connect(state => ({
  collections: state.collections,
  granules: state.granules
}))(CollectionOverview));
