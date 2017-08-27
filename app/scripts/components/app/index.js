import React from 'react';
import { connect } from 'react-redux';
import { target } from '../../config';
import { displayCase } from '../../utils/format';

import Header from './header';

var App = React.createClass({
  displayName: 'App',

  propTypes: {
    children: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    location: React.PropTypes.object,
    api: React.PropTypes.object
  },

  render: function () {
    return (
      <div className='app'>
        { target !== 'cumulus' ? (
          <div className='app__target--container'>
            <h4 className='app__target'>{displayCase(target)}</h4>
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
