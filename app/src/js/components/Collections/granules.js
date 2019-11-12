'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getCollectionId, lastUpdated } from '../../utils/format';
import {
  listGranules,
  filterGranules,
  clearGranulesFilter
} from '../../actions';
import {
  tableHeader,
  tableRow,
  tableSortProps,
  bulkActions
} from '../../utils/table-config/granules';
import List from '../Table/Table';
import Dropdown from '../DropDown/dropdown';
import statusOptions from '../../utils/status';
import {strings} from '../locale';

class CollectionGranules extends React.Component {
  constructor () {
    super();
    this.displayName = strings.collection_granules;
    this.generateBulkActions = this.generateBulkActions.bind(this);
    this.generateQuery = this.generateQuery.bind(this);
  }

  generateQuery () {
    const collectionId = getCollectionId(this.props.params);
    return { collectionId };
  }

  generateBulkActions () {
    const { granules } = this.props;
    return bulkActions(granules);
  }

  render () {
    const collectionName = this.props.params.name;
    const collectionVersion = this.props.params.version;
    const { list } = this.props.granules;
    const { meta } = list;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description '>{collectionName} / {collectionVersion}</h1>
          <Link className='button button--small form-group__element--right button--green' to={`/collections/edit/${collectionName}/${collectionVersion}`}>Edit</Link>
          <dl className="metadata__updated">
            <dd>{lastUpdated(meta.queriedAt)}</dd>
          </dl>
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>{strings.granules} <span className='num--title'>{meta.count ? ` (${meta.count})` : null}</span></h2>
          </div>
          <div className='filters filters__wlabels'>
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
        </section>

      </div>
    );
  }
}

CollectionGranules.propTypes = {
  granules: PropTypes.object,
  dispatch: PropTypes.func,
  params: PropTypes.object
};

export default connect(state => state)(CollectionGranules);
