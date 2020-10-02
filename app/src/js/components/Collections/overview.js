import { get } from 'object-path';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import {
  clearGranulesFilter,
  clearGranulesSearch,
  deleteCollection,
  filterGranules,
  getCollection,
  getCumulusInstanceMetadata,
  listGranules,
  searchGranules,
  listCollections,
} from '../../actions';
import {
  collectionName as collectionLabelForId,
  collectionNameVersion,
  getCollectionId,
  lastUpdated,
} from '../../utils/format';
import statusOptions from '../../utils/status';
import { getPersistentQueryParams, historyPushWithQueryParams } from '../../utils/url-helper';
import {
  reingestAction,
  tableColumns,
} from '../../utils/table-config/granules';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import DeleteCollection from '../DeleteCollection/DeleteCollection';
import Dropdown from '../DropDown/dropdown';
import SimpleDropdown from '../DropDown/simple-dropdown';
import Bulk from '../Granules/bulk';
import ListFilters from '../ListActions/ListFilters';
import { strings } from '../locale';
import Overview from '../Overview/overview';
import Search from '../Search/search';
import List from '../Table/Table';
const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/',
  },
  {
    label: 'Collections',
    href: '/collections',
  },
  {
    label: 'Collection Overview',
    active: true,
  },
];

class CollectionOverview extends React.Component {
  constructor(props) {
    super(props);
    [
      this.changeCollection,
      this.deleteMe,
      this.errors,
      this.generateQuery,
      this.generateBulkActions,
      this.gotoGranules,
      this.load,
      this.navigateBack,
    ].forEach((fn) => (this[fn.name] = fn.bind(this)));
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps) {
    const { name, version } = this.props.match.params;
    const { name: prevName, version: prevVersion } = prevProps.match.params;

    if (
      name !== prevName ||
      version !== prevVersion ||
      !isEqual(this.props.datepicker, prevProps.datepicker)
    ) {
      this.load();
    }
  }

  load() {
    const { name, version } = this.props.match.params;
    this.props.dispatch(listCollections());
    this.props.dispatch(getCumulusInstanceMetadata());
    this.props.dispatch(getCollection(name, version));
  }

  changeCollection(_, collectionId) {
    const { name, version } = collectionNameVersion(collectionId);
    historyPushWithQueryParams(`/collections/collection/${name}/${version}`);
  }

  generateBulkActions() {
    const { granules } = this.props;
    return [
      reingestAction(granules),
      {
        Component: (
          <Bulk
            element="a"
            className="button button__bulkgranules button--green button--small form-group__element link--no-underline"
            confirmAction={true}
          />
        ),
      },
    ];
  }

  generateQuery() {
    const { match, queryParams } = this.props;
    return {
      ...queryParams,
      collectionId: getCollectionId(match.params),
    };
  }

  deleteMe() {
    const { name, version } = this.props.match.params;
    this.props.dispatch(deleteCollection(name, version));
  }

  navigateBack() {
    historyPushWithQueryParams('/collections/all');
  }

  gotoGranules() {
    historyPushWithQueryParams('/granules');
  }

  errors() {
    const { name, version } = this.props.match.params;
    const collectionId = getCollectionId({ name, version });
    return [
      get(this.props.collections.map, [collectionId, 'error']),
      get(this.props.collections.deleted, [collectionId, 'error']),
    ].filter(Boolean);
  }

  renderDeleteButton() {
    const {
      match: { params },
      collections,
    } = this.props;
    const collectionId = getCollectionId(params);
    const deleteStatus = get(collections.deleted, [collectionId, 'status']);
    const hasGranules =
      get(collections.map[collectionId], 'data.stats.total', 0) > 0;

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

  render() {
    const {
      match: { params },
      collections,
      granules: { list },
    } = this.props;
    const collectionName = params.name;
    const collectionVersion = params.version;
    const collectionId = getCollectionId(params);
    const sortedCollectionIds = collections.list.data.map(getCollectionId).sort(
      // Compare collection IDs ignoring case
      (id1, id2) => id1.localeCompare(id2, 'en', { sensitivity: 'base' })
    );
    const record = collections.map[collectionId];

    return (
      <div className="page__component">
        <Helmet>
          <title> Collection Overview </title>
        </Helmet>
        <section className="page__section page__section__controls">
          <div className="collection__options--top">
            <ul>
              <li>
                <Breadcrumbs config={breadcrumbConfig} />
              </li>
              <li>
                <div className="dropdown__collection form-group__element--right">
                  <SimpleDropdown
                    className='collection-chooser'
                    label={'Collection'}
                    title={'Collections Dropdown'}
                    value={getCollectionId(params)}
                    options={sortedCollectionIds}
                    id={'collection-chooser'}
                    onChange={this.changeCollection}
                  />
                </div>
              </li>
            </ul>
          </div>
        </section>
        <section className="page__section page__section__header-wrapper">
          <div className="heading-group">
            <ul className="heading-form-group--left">
              <li>
                <h1 className="heading--large heading--shared-content with-description">
                  {strings.collection}: {collectionLabelForId(collectionId)}
                </h1>
              </li>
              <li>
                <Link
                  className="button button--copy button--small button--green"
                  to={(location) => ({
                    pathname: '/collections/add',
                    search: getPersistentQueryParams(location),
                    state: {
                      name: collectionName,
                      version: collectionVersion,
                    },
                  })}
                >
                  Copy
                </Link>
              </li>
              <li>
                <Link
                  className="button button--edit button--small button--green"
                  to={(location) => ({
                    pathname: `/collections/edit/${collectionName}/${collectionVersion}`,
                    search: getPersistentQueryParams(location),
                  })}
                >
                  Edit
                </Link>
              </li>
              <li>{this.renderDeleteButton()}</li>
            </ul>
            <span className="last-update">
              {lastUpdated(get(record, 'data.timestamp'))}
            </span>
          </div>
        </section>
        <section className="page__section page__section__overview">
          <div className="heading__wrapper--border">
            <h2 className="heading--large heading--shared-content--right">
              Granule Metrics
            </h2>
          </div>
          {record && <Overview type='granules' params={{ collectionId }} inflight={record.inflight} />}
        </section>
        <section className="page__section">
          <div className="heading__wrapper--border">
            <h2 className="heading--medium heading--shared-content with-description">
              {strings.total_granules}
              <span className="num-title">
                {list.meta.count ? ` ${list.meta.count}` : 0}
              </span>
            </h2>
            <Link
              className="button button--small button__goto button--green form-group__element--right"
              to={(location) => ({
                pathname: `/collections/collection/${collectionName}/${collectionVersion}/granules`,
                search: getPersistentQueryParams(location),
              })}
            >
              {strings.view_all_granules}
            </Link>
          </div>
          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listGranules}
            tableColumns={tableColumns}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId="granuleId"
            sortId="timestamp"
            filterAction={filterGranules}
            filterClear={clearGranulesFilter}
          >
            <ListFilters>
              <Search
                action={searchGranules}
                clear={clearGranulesSearch}
                inputProps={{
                  className: 'search search--large',
                }}
                label="Search"
                labelKey="granuleId"
                placeholder="Granule ID"
                searchKey="granules"
              />
              <Dropdown
                options={statusOptions}
                action={filterGranules}
                clear={clearGranulesFilter}
                paramKey="status"
                label="Status"
                inputProps={{
                  placeholder: 'All',
                }}
              />
            </ListFilters>
          </List>
        </section>
      </div>
    );
  }
}

CollectionOverview.displayName = 'CollectionOverview';

CollectionOverview.propTypes = {
  collections: PropTypes.object,
  datepicker: PropTypes.object,
  dispatch: PropTypes.func,
  granules: PropTypes.object,
  match: PropTypes.object,
  queryParams: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    collections: state.collections,
    datepicker: state.datepicker,
    granules: state.granules,
  }))(CollectionOverview)
);
