'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Home = React.createClass({
  displayName: 'Home',

  render: function () {
    return (
      <div className='page__home'>
        <h1>Home</h1>
      </div>
    );
  }
});

export default connect(state => state)(Home);
