'use strict';
import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import withQueryParams from 'react-router-query-params';
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
  getGranuleCSV
} from '../../actions';
import { get } from 'object-path';
import { lastUpdated, tally } from '../../utils/format';
import {
  tableColumns,
  simpleDropdownOption,
  bulkActions,
  recoverAction
} from '../../utils/table-config/granules';
import List from '../Table/Table';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import Overview from '../Overview/overview';
import statusOptions from '../../utils/status';
import { strings } from '../locale';
import { workflowOptionNames } from '../../selectors';
import { window } from '../../utils/browser';
import ListFilters from '../ListActions/ListFilters';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import pageSizeOptions from '../../utils/page-size';
import { downloadFile } from '../../utils/download-file';
import isEqual from 'lodash.isequal';

const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/'
  },
  {
    label: 'Granules',
    active: true
  }
];

class GranulesOverview extends React.Component {
  constructor (props) {
    super(props);
    this.generateQuery = this.generateQuery.bind(this);
    this.generateBulkActions = this.generateBulkActions.bind(this);
    this.queryMeta = this.queryMeta.bind(this);
    this.selectWorkflow = this.selectWorkflow.bind(this);
    this.applyWorkflow = this.applyWorkflow.bind(this);
    this.getExecuteOptions = this.getExecuteOptions.bind(this);
    this.applyRecoveryWorkflow = this.applyRecoveryWorkflow.bind(this);
    this.downloadGranuleCSV = this.downloadGranuleCSV.bind(this);
    this.state = {
      workflow: this.props.workflowOptions[0]
    };
  }

  componentDidMount () {
    this.queryMeta();
  }

  componentDidUpdate (prevProps) {
    if (!isEqual(prevProps.workflowOptions, this.props.workflowOptions)) {
      this.setState({ workflow: this.props.workflowOptions[0] }); // eslint-disable-line react/no-did-update-set-state
    }
  }

  queryMeta () {
    const { dispatch } = this.props;
    dispatch(listWorkflows());
  }

  generateQuery () {
    const { queryParams } = this.props;
    return { ...queryParams };
  }

  generateBulkActions () {
    const actionConfig = {
      execute: {
        options: this.getExecuteOptions(),
        action: this.applyWorkflow
      },
      recover: {
        options: this.getExecuteOptions(),
        action: this.applyRecoveryWorkflow
      }
    };
    const { granules, config } = this.props;
    let actions = bulkActions(granules, actionConfig);
    if (config.enableRecovery) {
      actions = actions.concat(recoverAction(granules, actionConfig));
    }
    return actions;
  }

  selectWorkflow (selector, workflow) {
    this.setState({ workflow });
  }

  applyWorkflow (granuleId) {
    return applyWorkflowToGranule(granuleId, this.state.workflow);
  }

  applyRecoveryWorkflow (granuleId) {
    return applyRecoveryWorkflowToGranule(granuleId);
  }

  getExecuteOptions () {
    return [
      simpleDropdownOption({
        handler: this.selectWorkflow,
        label: 'workflow',
        value: this.state.workflow,
        options: this.props.workflowOptions
      })
    ];
  }

  downloadGranuleCSV () {
    const { dispatch } = this.props;
    dispatch(getGranuleCSV()).then(() => {
      const { granuleCSV } = this.props;
      const { data } = granuleCSV;
      const csvData = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(csvData);
      downloadFile(url, 'granules.csv');
    });
  }

  render () {
    const { collections, dispatch, granules } = this.props;
    const { list } = granules;
    const { dropdowns } = collections;
    const { count, queriedAt } = list.meta;
    return (
      <div className='page__component'>
        <Helmet>
          <title> Granules Overview </title>
        </Helmet>
        <section className='page__section page__section__controls'>
          <Breadcrumbs config={breadcrumbConfig} />
        </section>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description '>{strings.granule_overview}</h1>
            {lastUpdated(queriedAt)}
            <Overview type='granules' inflight={false} />
          </div>
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>{strings.granules} <span className='num-title'>{count ? ` ${tally(count)}` : 0}</span></h2>
            <a className='csv__download button button--small button--download button--green form-group__element--right'
              id='download_link'
              onClick={this.downloadGranuleCSV}
            >Download Granule List</a>
          </div>
          <List
            list={list}
            action={listGranules}
            tableColumns={tableColumns}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId='granuleId'
            sortId='timestamp'
          >
            <ListFilters>
              <Dropdown
                getOptions={getOptionsCollectionName}
                options={get(dropdowns, ['collectionName', 'options']) || []}
                action={filterGranules}
                clear={clearGranulesFilter}
                paramKey='collectionId'
                label={strings.collection}
                inputProps={{
                  placeholder: 'All'
                }}
              />
              <Dropdown
                options={statusOptions}
                action={filterGranules}
                clear={clearGranulesFilter}
                paramKey='status'
                label='Status'
                inputProps={{
                  placeholder: 'All'
                }}
              />
              <Search
                dispatch={dispatch}
                action={searchGranules}
                clear={clearGranulesSearch}
                label='Search'
                placeholder='Granule ID'
              />
              <Dropdown
                options={pageSizeOptions}
                action={filterGranules}
                clear={clearGranulesFilter}
                paramKey='limit'
                label='Results Per Page'
                inputProps={{
                  placeholder: 'Results Per Page'
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
  granuleCSV: PropTypes.object,
  granules: PropTypes.object,
  queryParams: PropTypes.object,
  workflowOptions: PropTypes.array,
};

export { GranulesOverview };

export default withRouter(withQueryParams()(connect(state => ({
  collections: state.collections,
  config: state.config,
  granuleCSV: state.granuleCSV,
  granules: state.granules,
  workflowOptions: workflowOptionNames(state),
}))(GranulesOverview)));
