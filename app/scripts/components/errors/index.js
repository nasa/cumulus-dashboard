'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Errors = React.createClass({
  displayName: 'Errors',

  propTypes: {
    children: React.PropTypes.object
  },

  render: function () {
    return (
      <div className='page__errors'>
        <div className='content__header'>
	      	<h1>Errors</h1>
	      </div>
        <div className='page__content--shortened'>
          {this.props.children}
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Errors);
