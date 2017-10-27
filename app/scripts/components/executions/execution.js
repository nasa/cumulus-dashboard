'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { displayCase } from '../../utils/format';
import { updateInterval } from '../../config';

import ErrorReport from '../errors/report';

var Execution = React.createClass({
  displayName: 'Execution',

  propTypes: {
    execution: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func,
    router: PropTypes.object
  },

  componentWillMount: function () {
    const { execution } = this.props;
    console.log('execution', execution);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  reload: function (immediate, timeout) {
    timeout = timeout || updateInterval;
    const { execution } = this.props;
    // const { dispatch } = this.props;
    console.log('execution', execution);
    if (this.cancelInterval) { this.cancelInterval(); }
    // TODO: restore this when we have access to execution info
    // this.cancelInterval = interval(() => dispatch(getExecution(executionArn)), timeout, immediate);
  },

  fastReload: function () {
    // decrease timeout to better see updates
    this.reload(true, updateInterval / 2);
  },

  navigateBack: function () {
    const { router } = this.props;
    router.push('/executions');
  },

  errors: function () {
    return [].filter(Boolean);
  },

  render: function () {
    const { execution } = this.props;

    const errors = this.errors();

    return (
      <div className='page__component'>
      <section className='page__section page__section__header-wrapper'>
        <h1 className='heading--large heading--shared-content with-description width--three-quarters'>
          Execution {execution.arn}
        </h1>

        <dl className='status--process'>
          <dt>Status:</dt>
          <dd className={execution.status.toLowerCase()}>{displayCase(execution.status)}</dd>
        </dl>
      </section>

      <section className='page__section'>
        {errors.length ? <ErrorReport report={errors} /> : null}
        <div className='heading__wrapper--border'>
          <h2 className='heading--medium with-description'>Granule Overview</h2>
        </div>
      </section>

      <section className='page__section'>
        tbd
      </section>
      </div>
    );
  }
});

export default connect(state => ({}))(Execution);
