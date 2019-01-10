import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { target, environment } from '../../config';
import { displayCase } from '../../utils/format';

import Header from './header';

class App extends React.Component {
  constructor () {
    super();
    this.displayName = 'App';
  }

  render () {
    return (
      <div className='app'>
        { target !== 'cumulus' ? (
          <div className='app__target--container'>
            <h4 className='app__target'>{displayCase(target)} ({displayCase(environment)})</h4>
          </div>
        ) : null }
        <Header dispatch={this.props.dispatch} api={this.props.api} apiVersion={this.props.apiVersion} location={this.props.location}/>
        <main className='main' role='main'>
          {this.props.children}
        </main>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object,
  dispatch: PropTypes.func,
  location: PropTypes.object,
  api: PropTypes.object,
  apiVersion: PropTypes.object
};

export default connect(state => state)(App);
