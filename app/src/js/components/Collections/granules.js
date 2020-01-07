'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { getCollectionId, lastUpdated } from '../../utils/format';
import {
  listGranules,
  filterGranules,
  clearGranulesFilter,
  applyWorkflowToGranule,
  searchGranules,
  clearGranulesSearch
} from '../../actions';
import {
  tableHeader,
  tableRow,
  tableSortProps,
  simpleDropdownOption,
  bulkActions
} from '../../utils/table-config/granules';
import List from '../Table/Table';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import statusOptions from '../../utils/status';
import {strings} from '../locale';
import { workflowOptionNames } from '../../selectors';

class CollectionGranules extends React.Component {
  constructor () {
    super();
    this.displayName = strings.collection_granules;
    this.applyWorkflow = this.applyWorkflow.bind(this);
    this.generateBulkActions = this.generateBulkActions.bind(this);
    this.selectWorkflow = this.selectWorkflow.bind(this);
    this.getExecuteOptions = this.getExecuteOptions.bind(this);
    this.generateQuery = this.generateQuery.bind(this);
    this.getView = this.getView.bind(this);
    this.state = {};
  }

  generateQuery () {
    const collectionId = getCollectionId(this.props.params);
    const options = { collectionId };
    const view = this.getView();
    if (view === 'completed') options.status = 'completed';
    else if (view === 'processing') options.status = 'running';
    else if (view === 'failed') options.status = 'failed';
    return options;
  }

  getView () {
    const { pathname } = this.props.location;
    if (pathname.includes('/granules/completed')) return 'completed';
    else if (pathname.includes('/granules/processing')) return 'processing';
    else if (pathname.includes('/granules/failed')) return 'failed';
    else return 'all';
  }

  generateBulkActions () {
    const actionConfig = {
      execute: {
        options: this.getExecuteOptions(),
        action: this.applyWorkflow
      }
    };
    const { granules } = this.props;
    let actions = bulkActions(granules, actionConfig);
    return actions;
  }

  selectWorkflow (selector, workflow) {
    this.setState({ workflow });
  }

  applyWorkflow (granuleId) {
    return applyWorkflowToGranule(granuleId, this.state.workflow);
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

  render () {
    const collectionName = this.props.params.name;
    const collectionVersion = this.props.params.version;
    const { list } = this.props.granules;
    const { meta } = list;
    const view = this.getView();
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description '>{collectionName} / {collectionVersion}</h1>
          <Link className='button button--edit button--small form-group__element--right button--green' to={`/collections/edit/${collectionName}/${collectionVersion}`}>Edit</Link>
          <dl className="metadata__updated">
            <dd>{lastUpdated(meta.queriedAt)}</dd>
          </dl>
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>{strings.granules} <span className='num--title'>{meta.count ? ` ${meta.count}` : null}</span></h2>
          </div>
          <div className='filters filters__wlabels'>
            {(view === 'all') ? <Dropdown
              options={statusOptions}
              action={filterGranules}
              clear={clearGranulesFilter}
              paramKey={'status'}
              label={'Status'}
            />
              : <Search
                dispatch={this.props.dispatch}
                action={searchGranules}
                clear={clearGranulesSearch}
              />
            }
          </div>

          <List
            list={list}
            action={listGranules}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId={'granuleId'}
            sortIdx={6}
          />
        </section>

      </div>
    );
  }
}

CollectionGranules.propTypes = {
  granules: PropTypes.object,
  dispatch: PropTypes.func,
  location: PropTypes.object,
  config: PropTypes.object,
  workflowOptions: PropTypes.array,
  params: PropTypes.object
};

export default withRouter(connect(state => ({
  workflowOptions: workflowOptionNames(state),
  granules: state.granules,
  config: state.config
}))(CollectionGranules));
