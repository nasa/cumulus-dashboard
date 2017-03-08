import React from 'react';
import { connect } from 'react-redux';

import Header from './header';

var App = React.createClass({
  displayName: 'App',

  propTypes: {
    children: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    api: React.PropTypes.object
  },

  render: function () {
    return (
      <div className='app'>
        <Header dispatch={this.props.dispatch} api={this.props.api}/>
        <main className='main' role='main'>
          {this.props.children}
        </main>
      </div>
    );
  }
});

export default connect(state => state)(App);
