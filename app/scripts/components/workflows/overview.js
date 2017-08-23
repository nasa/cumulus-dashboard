'use strict';
import React from 'react';
import PropTypes from 'prop-types';

var WorkflowOverview = React.createClass({
  propTypes: {
    dispatch: PropTypes.func
  },

  render: function () {
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>Workflows Overview</h1>
        </section>
      </div>
    );
  }
});

export default WorkflowOverview;
