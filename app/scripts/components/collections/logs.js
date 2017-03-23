'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { lastUpdated } from '../../utils/format';
import LogViewer from '../logs/viewer';

var CollectionLogs = React.createClass({
  displayName: 'CollectionLogs',

  propTypes: {
    dispatch: React.PropTypes.func,
    params: React.PropTypes.object,
    logs: React.PropTypes.object
  },

  render: function () {
    const collectionName = this.props.params.collectionName;
    const logsQuery = { 'meta.collectionName__exists': 'true' };
    const { queriedAt } = this.props.logs;
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>{collectionName}</h1>
          <Link className='button button--small form-group__element--right button--disabled button--green' to={`/collections/edit/${collectionName}`}>Edit</Link>
          {lastUpdated(queriedAt)}
        </section>
        <LogViewer query={logsQuery} dispatch={this.props.dispatch} logs={this.props.logs}/>
      </div>
    );
  }
});

export default connect(state => state)(CollectionLogs);
