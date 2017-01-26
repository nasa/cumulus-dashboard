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
      	<div>
	      	<h1>Collections</h1>
	      	<Link to='/collections/add'>Add a Collection</Link>
	      </div>
	      <Sidebar />
        {this.props.children}
      </div>
    );
  }
});

export default connect(state => state)(Collections);
