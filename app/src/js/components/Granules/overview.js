'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  interval,
  getCount,
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
import { lastUpdated, tally, displayCase } from '../../utils/format';
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
import Bulk from './bulk';
import _config from '../../config';
import { strings } from '../locale';
import { workflowOptionNames } from '../../selectors';
import { window } from '../../utils/browser';

const { updateInterval } = _config;

class GranulesOverview extends React.Component {
  constructor () {
    super();
    this.renderOverview = this.renderOverview.bind(this);
    this.generateQuery = this.generateQuery.bind(this);
    this.generateBulkActions = this.generateBulkActions.bind(this);
    this.queryMeta = this.queryMeta.bind(this);
    this.selectWorkflow = this.selectWorkflow.bind(this);
    this.applyWorkflow = this.applyWorkflow.bind(this);
    this.getExecuteOptions = this.getExecuteOptions.bind(this);
    this.csvDownloadSection = this.csvDownloadSection.bind(this);
    this.applyRecoveryWorkflow = this.applyRecoveryWorkflow.bind(this);
    this.runBulkGranules = this.runBulkGranules.bind(this);
    this.state = {};
  }

  componentDidMount () {
    this.cancelInterval = interval(this.queryMeta, updateInterval, true);
  }

  componentWillUnmount () {
    if (this.cancelInterval) { this.cancelInterval(); }
  }

  queryMeta () {
    const { dispatch } = this.props;
    dispatch(listWorkflows());
    dispatch(getCount({
      type: 'granules',
      field: 'status'
    }));
    dispatch(getGranuleCSV());
  }

  generateQuery () {
    return {};
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

  runBulkGranules () {
    return (
      <Bulk
        element='a'
        className={'button button__bulkgranules button--green button__animation--md button__arrow button__arrow--md button__animation form-group__element--right link--no-underline'}
        confirmAction={true}
        state={this.props.granules}
      />
    );
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

  renderOverview (count) {
    const overview = count.map(d => [tally(d.count), displayCase(d.key)]);
    return <Overview items={overview} inflight={false} />;
  }

  csvDownloadSection (fileData) {
    if (!fileData) return;

    const data = new Blob([fileData], {type: 'text/csv'});
    const url = window.URL.createObjectURL(data);

    return (<a className='csv__download' id='download_link' download='granules.csv' href={url}>Download Granule List</a>);
  }

  render () {
    const { stats, granules, granuleCSV, dispatch } = this.props;
    const { list, dropdowns } = granules;
    const { count, queriedAt } = list.meta;
    const { data } = granuleCSV;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description '>{strings.granule_overview}</h1>
            {lastUpdated(queriedAt)}
            {this.renderOverview(get(stats, 'count.data.granules.count', []))}
          </div>
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>{strings.granules} <span className='num--title'>{count ? ` ${tally(count)}` : null}</span></h2>
            {this.csvDownloadSection(data)}
          </div>
          <div className='filters filters__wlabels'>
            <ul>
              <li>
                <Dropdown
                  getOptions={getOptionsCollectionName}
                  options={get(dropdowns, ['collectionName', 'options'])}
                  action={filterGranules}
                  clear={clearGranulesFilter}
                  paramKey={'collectionId'}
                  label={strings.collection}
                />
              </li>
              <li>
                <Dropdown
                  options={statusOptions}
                  action={filterGranules}
                  clear={clearGranulesFilter}
                  paramKey={'status'}
                  label={'Status'}
                />
              </li>
              <li>
                <Search dispatch={dispatch}
                  action={searchGranules}
                  clear={clearGranulesSearch}
                />
              </li>
              <li className="run_bulk">
                {this.runBulkGranules()}
              </li>
            </ul>
          </div>

          <List
            list={list}
            action={listGranules}
            tableColumns={tableColumns}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId='granuleId'
            sortIdx='timestamp'
          />
        </section>
      </div>
    );
  }
}

GranulesOverview.propTypes = {
  granules: PropTypes.object,
  stats: PropTypes.object,
  dispatch: PropTypes.func,
  workflowOptions: PropTypes.array,
  location: PropTypes.object,
  config: PropTypes.object,
  granuleCSV: PropTypes.object
};

export { GranulesOverview };

export default withRouter(connect(state => ({
  stats: state.stats,
  workflowOptions: workflowOptionNames(state),
  granules: state.granules,
  config: state.config,
  granuleCSV: state.granuleCSV
}))(GranulesOverview));
