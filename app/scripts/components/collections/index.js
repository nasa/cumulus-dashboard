'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Sidebar from '../app/sidebar';

var Collections = React.createClass({
  displayName: 'Collections',

  propTypes: {
    children: React.PropTypes.object
  },

  render: function () {
    return (
      <div className='page__collections'>
        <div className='content__header'>
          <h1>Collections</h1>
          <Link to='/collections/add'>Add a Collection</Link>
        </div>
        <Sidebar />
        <div className='page__content--shortened'>
          {this.props.children}
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Collections);
