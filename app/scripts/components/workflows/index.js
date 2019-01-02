'use strict';
import React from 'react';
import Sidebar from '../app/sidebar';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

var Workflows = createReactClass({
  displayName: 'Workflows',

  propTypes: {
    children: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.object
  },

  render: function () {
    return (
      <div className='page__workflows'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>Workflows</h1>
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

export default Workflows;
