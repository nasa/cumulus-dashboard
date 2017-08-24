'use strict';
import React from 'react';
import Sidebar from '../app/sidebar';

var Rules = React.createClass({
  propTypes: {
    children: React.PropTypes.object,
    location: React.PropTypes.object,
    params: React.PropTypes.object
  },

  render: function () {
    return (
      <div className='page__rules'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>Rules</h1>
          </div>
        </div>
        <div className='page__content'>
          <div className='row wrapper__sidebar'>
            <Sidebar
              currentPath={this.props.location.pathname}
              params={this.props.params}
            />
            <div className='page__content--shortened'>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default Rules;
