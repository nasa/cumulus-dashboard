'use strict';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
// import withQueryParams from 'react-router-query-params';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import _config from '../../config';

const { updateDelay } = _config;

import TextArea from '../TextAreaForm/text-area';

const defaultState = {
  data: '',
  pk: null,
  error: null
};

const AddRaw = ({
  defaultValue = '',
  history,
  state,
  dispatch,
  createRecord,
  getPk,
  getBaseRoute,
  title
}) => {
  const [record, setRecord] = useState({ ...defaultState, data: JSON.stringify(defaultValue, null, 2) });
  const { data, pk, error } = record;

  useEffect(() => {
    setRecord(record => {
      const data = JSON.stringify(defaultValue, null, 2);
      return {
        ...record,
        data
      };
    });
  }, [defaultValue]);

  useEffect(() => {
    if (!pk) {
      return;
    }
    const status = get(state.created, [pk, 'status']);
    if (status === 'success') {
      const baseRoute = getBaseRoute(pk);
      setTimeout(() => {
        history.push(baseRoute);
      }, updateDelay);
    } else if (status === 'error' && !error) {
      setRecord({ ...record, error: get(state.created, [pk, 'error']) });
    }
  });

  function handleCancel (e) {
    history.push(getBaseRoute());
  }

  function handleSubmit (e) {
    e.preventDefault();
    // prevent duplicate submits while the first is inflight.
    if (!pk || get(state.created, [pk, 'status']) !== 'inflight') {
      try {
        var json = JSON.parse(data);
      } catch (e) {
        return setRecord({ ...record, error: 'Syntax error in JSON' });
      }
      setRecord({ ...record, error: null, pk: getPk(json) });
      dispatch(createRecord(json));
    }
  }

  function handleChange (id, value) {
    setRecord({ ...record, data: value });
  }

  const status = get(state.created, [pk, 'status']);
  const buttonText = status === 'inflight' ? 'loading...'
    : status === 'success' ? 'Success!' : 'Submit';
  return (
    <div className='page__component page__content--shortened--centered'>
      <section className='page__section page__section--fullpage-form'>
        <div className='page__section__header'>
          <h1 className='heading--large'>{title}</h1>
          <form>
            <TextArea
              value={data}
              id={'create-new-record'}
              error={error}
              onChange={handleChange}
              mode={'json'}
              minLines={30}
              maxLines={200}
            />
            <button
              className={'button button--submit button__animation--md button__arrow button__arrow--md button__animation button__arrow--white form-group__element--right' + (status === 'inflight' ? ' button--disabled' : '')}
              onClick={handleSubmit}
              readOnly={true}
            >{buttonText}</button>
            <button
              className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--right'
              onClick={handleCancel}
              readOnly={true}
            >Cancel</button>
          </form>
        </div>
      </section>
    </div>
  );
};

AddRaw.propTypes = {
  dispatch: PropTypes.func,
  state: PropTypes.object,
  defaultValue: PropTypes.object,
  title: PropTypes.string,
  getPk: PropTypes.func,
  getBaseRoute: PropTypes.func,
  history: PropTypes.object,
  createRecord: PropTypes.func
};

export default withRouter(connect()(AddRaw));
