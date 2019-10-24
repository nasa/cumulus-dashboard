'use strict';
import React from 'react';
import { connect } from 'react-redux';
import LogViewer from './viewer';
import PropTypes from 'prop-types';

class Logs extends React.Component {
  render () {
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
}

Logs.propTypes = {
  dispatch: PropTypes.func,
  logs: PropTypes.object
};

export default connect(state => state)(Logs);
