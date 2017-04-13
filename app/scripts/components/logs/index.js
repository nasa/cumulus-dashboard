'use strict';
import React from 'react';
import { connect } from 'react-redux';
import LogViewer from './viewer';

var Logs = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func,
    logs: React.PropTypes.object
  },

  render: function () {
    return (
      <div className='page__logs'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>Logs</h1>
          </div>
        </div>
        <div className='page__content page__content__nosidebar'>
          <div className='row'>
            <LogViewer dispatch={this.props.dispatch} logs={this.props.logs}/>
          </div>
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Logs);
