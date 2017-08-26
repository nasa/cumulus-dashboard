'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import TextArea from '../form/text-area';
import { get } from 'object-path';
import Loading from '../app/loading-indicator';
import { updateDelay } from '../../config';

const EditRaw = React.createClass({
  propTypes: {
    dispatch: PropTypes.func,
    pk: PropTypes.string,
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
    this.props.dispatch(this.props.updateRecord(json));
  },

  componentWillMount: function () {
    this.queryRecord(this.props.pk);
  },

  componentWillReceiveProps: function ({ pk, state }) {
    const { dispatch, router, clearRecordUpdate, backRoute } = this.props;
    if (get(state.updated, [pk, 'status']) === 'success') {
      return setTimeout(() => {
        dispatch(clearRecordUpdate(pk));
        router.push(backRoute);
      }, updateDelay);
    }
    if (this.state.pk === pk) { return; }
    const newRecord = state.map[pk] || {};
    if (newRecord.error) {
      this.setState({
        pk,
        data: '',
        error: newRecord.error
      });
    } else if (newRecord.data) {
      try {
        var text = JSON.stringify(newRecord.data, null, '\t');
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
          { data ? (
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
              <span className={'button button__animation--md button__arrow button__arrow--md button__animation button__arrow--white' + (updateStatus === 'inflight' ? ' button--disabled' : '')}>
                <input
                  type='submit'
                  value={buttonText}
                  onClick={this.submit}
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

export default withRouter(connect()(EditRaw));
