'use strict';
import React from 'react';
import { connect } from 'react-redux';
import Sidebar from '../app/sidebar';

var Pdrs = React.createClass({
  displayName: 'Pdrs',

  propTypes: {
    children: React.PropTypes.object
  },

  render: function () {
    return (
      <div className='page__pdrs'>
        <div className='content__header'>
	      	<h1>PDR's</h1>
	      </div>
	      <Sidebar />
        <div className='page__content--shortened'>
          {this.props.children}
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Pdrs);
