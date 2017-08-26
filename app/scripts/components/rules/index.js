'use strict';
import React from 'react';
import { Link } from 'react-router';
import Sidebar from '../app/sidebar';

var Rules = React.createClass({
  propTypes: {
    children: React.PropTypes.object,
    location: React.PropTypes.object,
    params: React.PropTypes.object
  },

  render: function () {
    const { pathname } = this.props.location;
    const showSidebar = pathname !== '/rules/add';
    return (
      <div className='page__rules'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge heading--shared-content'>Rules</h1>
            { showSidebar ? <Link className='button button--large button--white button__addcollections button__arrow button__animation' to='/rules/add'>Add a rule</Link> : null }
          </div>
        </div>
        <div className='page__content'>
          <div className='row wrapper__sidebar'>
            { showSidebar ? (
              <Sidebar
                currentPath={this.props.location.pathname}
                params={this.props.params}
              />
            ) : null }
            <div className={ showSidebar ? 'page__content--shortened' : 'page__content' }>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default Rules;
