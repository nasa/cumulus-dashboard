'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import TextArea from '../form/text-area';
import { get } from 'object-path';
import { updateDelay } from '../../config';

const AddRaw = createReactClass({
  propTypes: {
    dispatch: PropTypes.func,
    state: PropTypes.object,
    defaultValue: PropTypes.object,
    title: PropTypes.string,
    getPk: PropTypes.func,
    getBaseRoute: PropTypes.func,
    router: PropTypes.object,

    createRecord: PropTypes.func
  },

  getInitialState: function () {
    return {
      data: '',
      pk: null,
      error: null
    };
  },

  cancel: function (e) {
    this.props.router.push(this.props.getBaseRoute().split('/')[1]);
  },

  submit: function (e) {
    e.preventDefault();
    const { state, dispatch, createRecord, getPk } = this.props;
    let { pk, data } = this.state;
    // prevent duplicate submits while the first is inflight.
    if (!pk || get(state.created, [pk, 'status']) !== 'inflight') {
      try {
        var json = JSON.parse(data);
      } catch (e) {
        return this.setState({ error: 'Syntax error in JSON' });
      }
      this.setState({ error: null, pk: getPk(json) });
      dispatch(createRecord(json));
    }
  },

  componentWillMount: function () {
    if (this.props.defaultValue) {
      this.setState({ data: JSON.stringify(this.props.defaultValue, null, 2) });
    }
  },

  componentWillReceiveProps: function ({ state }) {
    const { router, getBaseRoute } = this.props;
    const { pk, error } = this.state;
    if (!pk) {
      return;
    }

    const status = get(state.created, [pk, 'status']);
    if (status === 'success') {
      const baseRoute = getBaseRoute(pk);
      return setTimeout(() => {
        router.push(baseRoute);
      }, updateDelay);
    } else if (status === 'error' && !error) {
      this.setState({ error: get(state.created, [pk, 'error']) });
    }
  },

  onChange: function (id, value) {
    this.setState({ data: value });
  },

  render: function () {
    const { pk, error, data } = this.state;
    const status = get(this.props.state.created, [pk, 'status']);
    const buttonText = status === 'inflight' ? 'loading...'
      : status === 'success' ? 'Success!' : 'Submit';
    return (
      <div className='page__component page__content--shortened--centered'>
        <section className='page__section page__section--fullpage-form'>
          <div className='page__section__header'>
            <h1 className='heading--large'>{this.props.title}</h1>
            <form>
              <TextArea
                value={data}
                id={'create-new-record'}
                error={error}
                onChange={this.onChange}
                mode={'json'}
                minLines={30}
                maxLines={200}
              />
              <br />
                <button
                  className={'button button__animation--md button__arrow button__arrow--md button__animation button__arrow--white' + (status === 'inflight' ? ' button--disabled' : '')}
                  onClick={this.submit}
                  readOnly={true}
                  >{buttonText}</button>
                <button
                  className='button button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left button__cancel'
                  onClick={this.cancel}
                  readOnly={true}
                >Cancel</button>
            </form>
          </div>
        </section>
      </div>
    );
  }
});

export default withRouter(connect()(AddRaw));
