'use strict';
import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { get } from 'object-path';
import { getSchema } from '../../actions';
import Schema from '../form/schema';
import Loading from '../app/loading-indicator';
import { updateDelay } from '../../config';

var AddCollection = React.createClass({
  getInitialState: function () {
    return {
      pk: null
    };
  },

  propTypes: {
    schema: PropTypes.object,
    schemaKey: PropTypes.string,
    primaryProperty: PropTypes.string,
    title: PropTypes.string,

    dispatch: PropTypes.func,
    state: PropTypes.object,

    router: PropTypes.object,
    baseRoute: PropTypes.string,
    attachMeta: PropTypes.bool,

    createRecord: PropTypes.func,
    validate: PropTypes.func
  },

  componentWillMount: function () {
    this.props.dispatch(getSchema(this.props.schemaKey));
  },

  componentWillReceiveProps: function ({ state }) {
    const { pk } = this.state;
    const { router, baseRoute } = this.props;
    const status = get(state, ['created', pk, 'status']);
    if (status === 'success') {
      return setTimeout(() => {
        router.push(path.join(baseRoute, pk));
      }, updateDelay);
    }
  },

  navigateBack: function () {
    this.props.router.push(this.props.baseRoute.split('/')[1]);
  },

  post: function (id, payload) {
    const {
      primaryProperty,
      dispatch,
      attachMeta,
      validate,
      createRecord
    } = this.props;
    if (attachMeta) {
      payload.createdAt = new Date().getTime();
      payload.updatedAt = new Date().getTime();
      payload.changedBy = 'Cumulus Dashboard';
    }
    if (!validate || validate(payload)) {
      const pk = get(payload, primaryProperty);
      this.setState({ pk }, () => dispatch(createRecord(pk, payload)));
    }
  },

  render: function () {
    const { title, state, schemaKey } = this.props;
    const { pk } = this.state;
    const record = pk ? get(state.created, pk, {}) : {};
    const schema = this.props.schema[schemaKey];
    return (
      <div className='page__component page__content--shortened--centered'>
        <section className='page__section page__section--fullpage-form'>
          <div className='page__section__header'>
            <h1 className='heading--large'>{title}</h1>
          </div>
          {schema ? <Schema
            schema={schema}
            pk={'new-collection'}
            onSubmit={this.post}
            onCancel={this.navigateBack}
            status={record.status}
            error={record.status === 'inflight' ? null : record.error}
          /> : <Loading />}
        </section>
      </div>
    );
  }
});

export default withRouter(connect(state => ({
  schema: state.schema
}))(AddCollection));
