'use strict';
import React from 'react';
import { connect } from 'react-redux';
import Sidebar from '../app/sidebar';

var Pdrs = React.createClass({
  displayName: 'Pdrs',

  propTypes: {
    children: React.PropTypes.object,
    location: React.PropTypes.object
  },

  render: function () {
    return (
      <div className='page__pdrs'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>PDR's</h1>
          </div>
        </div>
        <div className='page__content'>
          <div className='row'>
            <Sidebar currentPath={this.props.location.pathname}/>
            <div className='page__content--shortened'>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Pdrs);
