'use strict';
import React from 'react';
import { Link } from 'react-router';
import Sidebar from '../app/sidebar';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

var Providers = createReactClass({
  displayName: 'Providers',

  propTypes: {
    children: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.object
  },

  render: function () {
    const { pathname } = this.props.location;
    const showSidebar = pathname !== '/providers/add';
    return (
      <div className='page__providers'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge heading--shared-content'>Providers</h1>
            {showSidebar ? <Link className='button button--large button--white button__addcollections button__arrow button__animation' to='/providers/add'>Add a Provider</Link> : null}
          </div>
        </div>
        <div className='page__content'>
          <div className='row wrapper__sidebar'>
            {showSidebar ? <Sidebar
              currentPath={this.props.location.pathname}
              params={this.props.params}
            /> : null}
            <div className={ showSidebar ? 'page__content--shortened' : 'page__content' }>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default Providers;
