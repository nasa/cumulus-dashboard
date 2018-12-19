'use strict';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { withRouter } from 'react-router';
import { getSchema } from '../../actions';
import Loading from '../app/loading-indicator';
import Schema from '../form/schema';
import merge from '../../utils/merge';
import { updateDelay } from '../../config';
import {strings} from '../locale';

var EditRecord = createReactClass({
  propTypes: {
    pk: PropTypes.string,
    schema: PropTypes.object,
    schemaKey: PropTypes.string,
    dispatch: PropTypes.func,
    state: PropTypes.object,
    router: PropTypes.object,
    backRoute: PropTypes.string,

    includedForms: PropTypes.array,
    merge: PropTypes.bool,
    attachMeta: PropTypes.bool,

    getRecord: PropTypes.func,
    updateRecord: PropTypes.func,
    clearRecordUpdate: PropTypes.func
  },

  getInitialState: function () {
    return {
      pk: null,
      error: null
    };
  },

  get: function (pk) {
    const record = this.props.state.map[pk];
    if (!record) {
      this.props.dispatch(this.props.getRecord(pk));
    }
  },

  UNSAFE_componentWillMount: function () {
    const { pk } = this.props;
    this.get(pk);
    this.props.dispatch(getSchema(this.props.schemaKey));
  },

  UNSAFE_componentWillReceiveProps: function ({ pk }) {
    const { dispatch, router, clearRecordUpdate, backRoute, state } = this.props;
    const updateStatus = get(state.updated, [pk, 'status']);
    if (updateStatus === 'success') {
      return setTimeout(() => {
        dispatch(clearRecordUpdate(pk));
        router.push(backRoute);
      }, updateDelay);
    } else if (this.state.pk === pk) { return; }

    const record = get(this.props.state.map, pk, {});

    // record has hit an API error
    if (record.error) {
      this.setState({
        pk,
        error: record.error
      });
    } else if (record.data) {
      // record has hit an API success; update the UI
      this.setState({
        pk,
        error: null
      });
    } else if (!record.inflight) {
      // we've not yet fetched the record, request it
      this.get(pk);
    }
  },

  navigateBack: function () {
    this.props.router.push(this.props.backRoute);
  },

  onSubmit: function (id, payload) {
    const { pk, state, dispatch, updateRecord, attachMeta } = this.props;
    const record = state.map[pk];
    const json = this.props.merge ? merge(record.data, payload) : payload;
    if (attachMeta) {
      json.updatedAt = new Date().getTime();
      json.changedBy = strings.dashboard;
    }
    this.setState({ error: null });
    console.log('About to update', json);
    dispatch(updateRecord(pk, json));
  },

  render: function () {
    const { pk, state, schemaKey, includedForms } = this.props;
    const record = get(state.map, pk, {});
    const meta = get(state.updated, pk, {});
    const error = this.state.error || record.error || meta.error;
    const schema = this.props.schema[schemaKey];
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large'>Edit {pk}</h1>
          {schema && record.data ? (
            <Schema
              schema={schema}
              data={record.data}
              pk={pk}
              onSubmit={this.onSubmit}
              onCancel={this.navigateBack}
              status={meta.status}
              include={includedForms}
              error={meta.status === 'inflight' ? null : error}
            />
          ) : <Loading />}
        </section>
      </div>
    );
  }
});

export default withRouter(connect(state => ({
  schema: state.schema
}))(EditRecord));
