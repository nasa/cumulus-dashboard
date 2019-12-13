'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import {
  getCollection,
  listGranules,
  filterGranules,
  clearGranulesFilter,
  deleteCollection,
  searchGranules,
  clearGranulesSearch
} from '../../actions';
import { get } from 'object-path';
import {
  tally,
  lastUpdated,
  getCollectionId,
  deleteText,
  collectionNameVersion
} from '../../utils/format';
import Dropdown from '../DropDown/dropdown';
import SimpleDropdown from '../DropDown/simple-dropdown';
import Search from '../Search/search';
import statusOptions from '../../utils/status';
import ErrorReport from '../Errors/report';
import List from '../Table/Table';
import Overview from '../Overview/overview';
import AsyncCommand from '../AsyncCommands/async-command';
import {
  tableHeader,
  tableRow,
  tableSortProps
} from '../../utils/table-config/granules';
import { updateDelay } from '../../config';
import { strings } from '../locale';

class CollectionOverview extends React.Component {
  constructor (props) {
    super(props);

    this.displayName = 'CollectionOverview';

    this.changeCollection = this.changeCollection.bind(this);
    this.delete = this.delete.bind(this);
    this.errors = this.errors.bind(this);
    this.generateQuery = this.generateQuery.bind(this);
    this.load = this.load.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
  }

  componentDidMount () {
    this.load();
  }

  componentDidUpdate (prevProps) {
    const { name, version } = this.props.params;
    if (name !== prevProps.params.name ||
       version !== prevProps.params.version) {
      this.load();
    }
  }

  load () {
    const { name, version } = this.props.params;
    this.props.dispatch(getCollection(name, version));
  }

  changeCollection (_, collectionId) {
    const { name, version } = collectionNameVersion(collectionId);
    Object.assign(this.props.params, { name, version });
    this.props.dispatch(getCollection(name, version));
  }

  generateQuery () {
    return {
      collectionId: getCollectionId(this.props.params)
    };
  }

  delete () {
    const { name, version } = this.props.params;
    this.props.dispatch(deleteCollection(name, version));
  }

  navigateBack () {
    const { router } = this.props;
    router.push('/collections/all');
  }

  errors () {
    const { name, version } = this.props.params;
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
      [tally(stats.running), strings.granules_running],
      [tally(stats.completed), strings.granules_completed],
      [tally(stats.failed), strings.granules_failed]
    ];
    return <Overview items={overview} inflight={record.inflight} />;
  }

  render () {
    const { params, granules, collections } = this.props;
    const collectionName = params.name;
    const collectionVersion = params.version;
    const collectionId = getCollectionId(params);
    const sortedCollectionIds = collections.list.data.map(getCollectionId).sort(
      // Compare collection IDs ignoring case
      (id1, id2) => id1.localeCompare(id2, 'en', { sensitivity: 'base' }));
    const record = collections.map[collectionId];
    const { list } = granules;
    const { meta } = list;
    const deleteStatus = get(collections.deleted, [collectionId, 'status']);
    const errors = this.errors();

    // create the overview boxes
    const overview = record ? this.renderOverview(record) : <div></div>;

    return (
      <div className='page__component'>
        <section className='page__section page__section__controls'>
          <div className='breadcrumbs'></div>
          <div className='dropdown__collection form-group__element--right'>
            <SimpleDropdown
              label={'Collection'}
              value={getCollectionId(params)}
              options={sortedCollectionIds}
              id={'collection-chooser'}
              onChange={this.changeCollection}
              noNull={true}
            />
          </div>
        </section>
        <section className='page__section page__section__header-wrapper'>
          <div className='heading-group'>
            <ul className='heading-form-group--left'>
              <li>
                <h1 className='heading--large heading--shared-content with-description'>{collectionName} / {collectionVersion}</h1>
              </li>
              <li>
                <Link className='button button--edit button--small button--green' to={`/collections/edit/${collectionName}/${collectionVersion}`}>Edit</Link>
              </li>
              <li>
                <AsyncCommand
                action={this.delete}
                success={this.navigateBack}
                successTimeout={updateDelay}
                status={deleteStatus}
                confirmAction={true}
                 confirmText={deleteText(`${collectionName} ${collectionVersion}`)}
                text={deleteStatus === 'success' ? 'Success!' : 'Delete'}
                />
              </li>
            </ul>
           <span className="last-update">{lastUpdated(get(record, 'data.timestamp'))}</span>
          </div>
        </section>
        <section className='page__section page__section__overview'>
          {overview}
          {errors.length ? <ErrorReport report={errors} truncate={true} /> : null}
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>{strings.total_granules}<span className='num--title'>{meta.count ? ` ${meta.count}` : null}</span></h2>
          </div>
          <div className='filters filters__wlabels'>
            <Search dispatch={this.props.dispatch}
              action={searchGranules}
              clear={clearGranulesSearch}
            />
            <Dropdown
              options={statusOptions}
              action={filterGranules}
              clear={clearGranulesFilter}
              paramKey={'status'}
              label={'Status'}
            />
          </div>
          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listGranules}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            query={this.generateQuery()}
            rowId={'granuleId'}
            sortIdx={6}
          />
          <Link className='link--secondary link--learn-more' to={`/collections/collection/${collectionName}/${collectionVersion}/granules`}>{strings.view_all_granules}</Link>
        </section>
      </div>
    );
  }
}

CollectionOverview.propTypes = {
  params: PropTypes.object,
  dispatch: PropTypes.func,
  granules: PropTypes.object,
  collections: PropTypes.object,
  router: PropTypes.object
};

export default connect(state => ({
  collections: state.collections,
  granules: state.granules
}))(CollectionOverview);
