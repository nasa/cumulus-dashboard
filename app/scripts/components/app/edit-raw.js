'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import TextArea from '../form/text-area';
import { get } from 'object-path';
import { getSchema } from '../../actions';
import Loading from '../app/loading-indicator';
import { removeReadOnly } from '../form/schema';
import { updateDelay } from '../../config';

const EditRaw = React.createClass({
  propTypes: {
    dispatch: PropTypes.func,
    pk: PropTypes.string,
    schema: PropTypes.object,
    schemaKey: PropTypes.string,
    state: PropTypes.object,
    backRoute: PropTypes.string,
    router: PropTypes.object,

    getRecord: PropTypes.func,
    updateRecord: PropTypes.func,
    clearRecordUpdate: PropTypes.func
  },

  getInitialState: function () {
    return {
      pk: null,
      data: '',
      error: null
    };
  },

  queryRecord: function (pk) {
    if (!this.props.state.map[pk]) {
      this.props.dispatch(this.props.getRecord(pk));
    }
  },

  submit: function (e) {
    e.preventDefault();
    const { state, pk } = this.props;
    const updateStatus = get(state.updated, [pk, 'status']);
    if (updateStatus === 'inflight') { return; }
    try {
      var json = JSON.parse(this.state.data);
    } catch (e) {
      return this.setState({ error: 'Syntax error in JSON' });
    }
    this.setState({ error: null });
    console.log('About to update', json);
    this.props.dispatch(this.props.updateRecord(json));
  },

  cancel: function () {
    this.props.router.push(this.props.backRoute);
  },

  componentWillMount: function () {
    this.queryRecord(this.props.pk);
    this.props.dispatch(getSchema(this.props.schemaKey));
  },

  componentWillReceiveProps: function ({ pk, state, schema, schemaKey }) {
    const { dispatch, router, clearRecordUpdate, backRoute } = this.props;
    const recordSchema = schema[schemaKey];
    // successfully updated, navigate away
    if (get(state.updated, [pk, 'status']) === 'success') {
      return setTimeout(() => {
        dispatch(clearRecordUpdate(pk));
        router.push(backRoute);
      }, updateDelay);
    }
    if (this.state.pk === pk || !schema[schemaKey]) { return; }
    const newRecord = state.map[pk] || {};
    if (newRecord.error) {
      this.setState({
        pk,
        data: '',
        error: newRecord.error
      });
    } else if (newRecord.data) {
      let data = removeReadOnly(newRecord.data, recordSchema);
      try {
        var text = JSON.stringify(data, null, '\t');
      } catch (error) {
        return this.setState({ error, pk });
      }
      this.setState({
        pk,
        data: text,
        error: null
      });
    } else if (!newRecord.inflight) {
      this.queryRecord(pk);
    }
  },

  onChange: function (id, value) {
    this.setState({ data: value });
  },

  render: function () {
    const { data, pk } = this.state;
    const updateStatus = get(this.props.state.updated, [pk, 'status']);
    const buttonText = updateStatus === 'inflight' ? 'loading...'
      : updateStatus === 'success' ? 'Success!' : 'Submit';
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large'>Edit {pk}</h1>
          { data || data === '' ? (
            <form>
              <TextArea
                value={data}
                id={`edit-${pk}`}
                error={this.state.error}
                onChange={this.onChange}
                mode={'json'}
                minLines={1}
                maxLines={200}
              />
              <br />
              <span onClick={this.submit} className={'button button__animation--md button__arrow button__arrow--md button__animation button__arrow--white' + (updateStatus === 'inflight' ? ' button--disabled' : '')}>
                <input
                  type='submit'
                  value={buttonText}
                  readOnly={true}
                />
              </span>

              <span onClick={this.cancel} className='button button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left button__cancel'>
                <input
                  type='submit'
                  value='Cancel'
                  readOnly={true}
                />
              </span>

            </form>
          ) : <Loading /> }
        </section>
      </div>
    );
  }
});

export default withRouter(connect(state => ({
  schema: state.schema
}))(EditRaw));
