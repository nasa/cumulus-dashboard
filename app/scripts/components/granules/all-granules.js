'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { searchGranules, clearGranuleSearch } from '../../actions';
import { fullDate, seconds, granuleSearchResult } from '../../utils/format';
import GranulesList from './list';
import LogViewer from '../logs/viewer';
import Search from '../form/search';
import { isUndefined as undef } from '../../utils/validate';

const tableHeader = [
  'Name',
  'Status',
  'PDR',
  'Collection',
  'Duration',
  'Updated'
];

const tableRow = [
  (d) => <Link to={`/granules/granule/${d.granuleId}/overview`}>{d.granuleId}</Link>,
  'status',
  'pdrName',
  'collectionName',
  (d) => seconds(d.duration),
  (d) => fullDate(d.updatedAt)
];

const tableSortProps = [
  'granuleId.keyword',
  'statusId',
  'pdrName.keyword',
  'collectionName.keyword',
  'duration',
  'updatedAt'
];

var AllGranules = React.createClass({
  displayName: 'AllGranules',

  propTypes: {
    granules: React.PropTypes.object,
    logs: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    params: React.PropTypes.object
  },

  generateQuery: function () {
    const pdrName = this.props.params.pdrName;
    const options = {};
    if (!undef(pdrName)) { options.pdrName = pdrName; }
    return options;
  },

  render: function () {
    const { pdrName } = this.props.params;
    const { list, search } = this.props.granules;
    const { count } = list.meta;
    const logsQuery = { q: 'granuleId' };
    return (
      <div className='page__component'>
        <section className='page__section'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content'>
              {pdrName || 'All'} Granules <span style={{color: 'gray'}}>{ count ? `(${count})` : null }</span>
            </h1>
            <dl className='metadata__updated'>
              <dt>Last Updated:</dt>
              <dd>Sept. 23, 2016</dd>
              <dd className='metadata__updated__time'>2:00pm EST</dd>
            </dl>
          </div>
          <div className='filters filters__wlabels'>
            <div className='filter__item'>
              <label htmlFor='collectionFilter'>Collection</label>
              <div className='dropdown__wrapper form-group__element'>
                <select id='collectionFilter'>
                  <option value='ASTER_1A_versionId_1'>ASTER_1A_versionId_1</option>
                  <option value='TODO'>TODO</option>
                </select>
              </div>
            </div>
            <div className='filter__item'>
              <Search dispatch={this.props.dispatch}
                action={searchGranules}
                results={search}
                format={granuleSearchResult}
                clear={clearGranuleSearch}
              />
            </div>
          </div>

          <GranulesList
            granules={this.props.granules}
            dispatch={this.props.dispatch}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            query={this.generateQuery()}
          />
        </section>
        <LogViewer query={logsQuery} dispatch={this.props.dispatch} logs={this.props.logs}/>
      </div>
    );
  }
});

export default connect(state => state)(AllGranules);
