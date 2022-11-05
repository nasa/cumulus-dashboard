import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import withQueryParams from 'react-router-query-params';
import { get } from 'object-path';
import isEqual from 'lodash/isEqual';
import {
  searchGranules,
  clearGranulesSearch,
  filterGranules,
  clearGranulesFilter,
  listGranules,
  listWorkflows,
  applyWorkflowToGranule,
  applyRecoveryWorkflowToGranule,
  getOptionsCollectionName,
  getOptionsProviderName,
  refreshCumulusDbConnection,
  toggleGranulesTableColumns,
} from '../../actions';
import { lastUpdated, tally } from '../../utils/format';
import {
  bulkActions,
  defaultHiddenColumns,
  defaultWorkflowMeta,
  executeDialog,
  groupAction,
  recoverAction,
  tableColumns,
} from '../../utils/table-config/granules';
import { granuleStatus as statusOptions } from '../../utils/status';
import { strings } from '../locale';
import { workflowOptionNames } from '../../selectors';
import List from '../Table/Table';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import Overview from '../Overview/overview';
import ListFilters from '../ListActions/ListFilters';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/',
  },
  {
    label: 'Granules',
    active: true,
  },
];

class GranulesOverview extends React.Component {
  constructor(props) {
    super(props);
    this.generateQuery = this.generateQuery.bind(this);
    this.generateBulkActions = this.generateBulkActions.bind(this);
    this.queryMeta = this.queryMeta.bind(this);
    this.selectWorkflow = this.selectWorkflow.bind(this);
    this.applyWorkflow = this.applyWorkflow.bind(this);
    this.getExecuteOptions = this.getExecuteOptions.bind(this);
    this.setWorkflowMeta = this.setWorkflowMeta.bind(this);
    this.applyRecoveryWorkflow = this.applyRecoveryWorkflow.bind(this);
    this.updateSelection = this.updateSelection.bind(this);
    this.state = {
      workflow: this.props.workflowOptions[0],
      workflowMeta: defaultWorkflowMeta,
      selected: [],
    };
  }

  componentDidMount() {
    this.props.dispatch(refreshCumulusDbConnection());
    this.queryMeta();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.workflowOptions, this.props.workflowOptions)) {
      this.setState({ workflow: this.props.workflowOptions[0] });
    }
  }

  queryMeta() {
    const { dispatch } = this.props;
    dispatch(listWorkflows());
  }

  generateQuery() {
    const { queryParams } = this.props;
    return { ...queryParams };
  }

  generateBulkActions() {
    const actionConfig = {
      execute: {
        options: this.getExecuteOptions(),
        action: this.applyWorkflow,
      },
      recover: {
        options: this.getExecuteOptions(),
        action: this.applyRecoveryWorkflow,
      },
    };
    const { granules, config } = this.props;
    const { selected } = this.state;
    let actions = bulkActions(granules, actionConfig, selected);
    if (config.enableRecovery) {
      actions = actions.concat(recoverAction(granules, actionConfig));
    }
    return actions;
  }

  selectWorkflow(_selector, workflow) {
    this.setState({ workflow });
  }

  setWorkflowMeta(workflowMeta) {
    this.setState({ workflowMeta });
  }

  applyWorkflow(granuleId) {
    const { workflow, workflowMeta } = this.state;
    const { meta } = JSON.parse(workflowMeta);
    this.setState({ workflowMeta: defaultWorkflowMeta });
    return applyWorkflowToGranule(granuleId, workflow, meta);
  }

  applyRecoveryWorkflow(granuleId) {
    return applyRecoveryWorkflowToGranule(granuleId);
  }

  getExecuteOptions() {
    return [
      executeDialog({
        selectHandler: this.selectWorkflow,
        label: 'workflow',
        value: this.state.workflow,
        options: this.props.workflowOptions,
        initialMeta: this.state.workflowMeta,
        metaHandler: this.setWorkflowMeta,
      }),
    ];
  }

  updateSelection(selectedIds, currentSelectedRows) {
    const allSelectedRows = this.state.selected.concat(currentSelectedRows);
    const selected = selectedIds
      .map((id) => allSelectedRows.find((g) => id === g.granuleId)).filter(Boolean);
    this.setState({ selected });
  }

  render() {
    const { collections, granules, providers } = this.props;
    const { list } = granules;
    const { dropdowns } = collections;
    const { dropdowns: providerDropdowns } = providers;
    const { count, queriedAt } = list.meta;

    return (
      <div className="page__component">
        <Helmet>
          <title> Granules Overview </title>
        </Helmet>
        <section className="page__section page__section__controls">
          <Breadcrumbs config={breadcrumbConfig} />
        </section>
        <section className="page__section page__section__header-wrapper">
          <div className="page__section__header">
            <h1 className="heading--large heading--shared-content with-description ">
              Granule Overview
            </h1>
            {lastUpdated(queriedAt)}
            <Overview type="granules" inflight={granules.list.inflight} />
          </div>
        </section>
        <section className="page__section">
          <div className="heading__wrapper--border">
            <h2 className="heading--medium heading--shared-content with-description">
              {strings.granules}{' '}
              <span className="num-title">
                {count ? ` ${tally(count)}` : 0}
              </span>
            </h2>
          </div>
          <List
            list={list}
            action={listGranules}
            tableColumns={tableColumns}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            groupAction={groupAction}
            rowId="granuleId"
            initialHiddenColumns={defaultHiddenColumns}
            initialSortId="timestamp"
            filterAction={filterGranules}
            filterClear={clearGranulesFilter}
            onSelect={this.updateSelection}
            toggleColumnOptionsAction={toggleGranulesTableColumns}
            tableId="granules-overview"
          >
            <Search
              action={searchGranules}
              clear={clearGranulesSearch}
              label="Search"
              labelKey="granuleId"
              placeholder="Granule ID"
              searchKey="granules"
            />
            <ListFilters>
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
              <Dropdown
                getOptions={getOptionsCollectionName}
                options={get(dropdowns, ['collectionName', 'options'])}
                action={filterGranules}
                clear={clearGranulesFilter}
                paramKey="collectionId"
                label={strings.collection}
                inputProps={{
                  placeholder: 'All',
                  className: 'dropdown--large',
                }}
              />
              <Dropdown
                getOptions={getOptionsProviderName}
                options={get(providerDropdowns, ['provider', 'options'])}
                action={filterGranules}
                clear={clearGranulesFilter}
                paramKey="provider"
                label="Provider"
                inputProps={{
                  placeholder: 'All',
                  className: 'dropdown--medium',
                }}
              />
            </ListFilters>
          </List>
        </section>
      </div>
    );
  }
}

GranulesOverview.propTypes = {
  collections: PropTypes.object,
  config: PropTypes.object,
  dispatch: PropTypes.func,
  granules: PropTypes.object,
  queryParams: PropTypes.object,
  workflowOptions: PropTypes.array,
  providers: PropTypes.object,
};

export { GranulesOverview };

export default withRouter(
  withQueryParams()(
    connect((state) => ({
      collections: state.collections,
      config: state.config,
      granules: state.granules,
      workflowOptions: workflowOptionNames(state),
      providers: state.providers,
    }))(GranulesOverview)
  )
);
