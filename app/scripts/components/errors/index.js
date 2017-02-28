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
          <div className='row'>
            <h1 className='heading--xlarge'>Errors</h1>
          </div>
        </div>
        <div className='page__content page__content'>
          <div className='row'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Errors);
