'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Sidebar from '../app/sidebar';

var Collections = React.createClass({
  displayName: 'Collections',

  propTypes: {
    children: React.PropTypes.object,
    location: React.PropTypes.object,
    params: React.PropTypes.object
  },

  render: function () {
    return (
      <div className='page__collections'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge heading--shared-content'>Collections</h1>
            <Link className='button button--large button--white button__addcollections button__arrow button__animation' to='/collections/add'>Add a Collection</Link>
          </div>
        </div>
        <div className='page__content'>
          <div className='row wrapper__sidebar'>
            <Sidebar currentPath={this.props.location.pathname} params={this.props.params} />
            <div className='page__content--shortened'>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Collections);
