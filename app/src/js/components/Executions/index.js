'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../Sidebar/sidebar';

class Executions extends React.Component {
  render () {
    return (
      <div className='page__workflows'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>Executions</h1>
          </div>
        </div>
        <div className='page__content'>
          <div className='wrapper__sidebar'>
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
}

Executions.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object
};

export default Executions;
