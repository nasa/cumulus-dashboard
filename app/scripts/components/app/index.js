import React from 'react';
import { connect } from 'react-redux';
import { target, environment } from '../../config';
import { displayCase } from '../../utils/format';
import { getApiVersion, validateApiVersion } from '../../actions';

import Header from './header';

var App = React.createClass({
  displayName: 'App',

  propTypes: {
    children: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    location: React.PropTypes.object,
    api: React.PropTypes.object,
    apiVersion: React.PropTypes.object
  },

  componentWillMount: () => {
    const { dispatch } = this.props;
    dispatch(getApiVersion);
    dispatch(validateApiVersion);
  },

  render: function () {
    const { isCompatible, versionNumber } = this.props.apiVersion;
    return (
      <div className='app'>
        { target !== 'cumulus' ? (
          <div className='app__target--container'>
            <h4 className='app__target'>{displayCase(target)} ({displayCase(environment)})</h4>
            <h5 className='app__api_version'>
              {`API Version: ${versionNumber}`}
              { isCompatible ? 'INCOMPATIBLE CUMULUS API - PLEASE CHECK' : '' }
            </h5>
          </div>
        ) : null }
        <Header dispatch={this.props.dispatch} api={this.props.api} location={this.props.location}/>
        <main className='main' role='main'>
          {this.props.children}
        </main>
      </div>
    );
  }
});

export default connect(state => state)(App);
