import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import { displayCase } from '../../utils/format';
import _config from '../../config';

import TextArea from '../TextAreaForm/text-area';
import DefaultModal from '../Modal/modal';
import { historyPushWithQueryParams } from '../../withUrlHelper';
import withRouter from '../../withRouter';

const { updateDelay } = _config;

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
  requireConfirmation,
  title,
  type = '',
  ModalBody,
  router
}) => {
  const [record, setRecord] = useState({ ...defaultState, data: JSON.stringify(defaultValue, null, 2) });
  const [showModal, setShowModal] = useState(false);
  const { data, pk, error } = record;
  const status = get(state.created, [pk, 'status']);
  const handleOnClick = requireConfirmation ? handleModalOpen : handleSubmit;
  const { navigate, location } = router;

  useEffect(() => {
    setRecord((currRecord) => {
      const defaultData = JSON.stringify(defaultValue, null, 2);
      console.log(`DATA: ${defaultData}`);
      return {
        ...currRecord,
        data: defaultData,
      };
    });
  }, [defaultValue]);

  useEffect(() => {
    if (!pk) {
      return;
    }
    if (status === 'success') {
      const baseRoute = getBaseRoute(pk);
      setTimeout(() => {
        historyPushWithQueryParams(navigate, location, baseRoute);
      }, updateDelay);
    } else if (status === 'error' && !error) {
      setRecord({ ...record, error: get(state.created, [pk, 'error']) });
    }
  }, [navigate, location, pk, status, error, getBaseRoute, history, record, state.created]);

  function handleCancel (e) {
    historyPushWithQueryParams(navigate, location, getBaseRoute());
  }

  function handleSubmit (e) {
    e.preventDefault();
    let json;
    // prevent duplicate submits while the first is inflight.
    if (!pk || get(state.created, [pk, 'status']) !== 'inflight') {
      try {
        json = JSON.parse(data);
      } catch (jsonError) {
        return setRecord({ ...record, error: 'Syntax error in JSON' });
      }
      setRecord({ ...record, error: null, pk: getPk(json) });
      dispatch(createRecord(json));
    }
  }

  function handleChange (id, value) {
    setRecord({ ...record, data: value });
  }

  function handleModalOpen (e) {
    e.preventDefault();
    setShowModal(true);
  }

  function handleModalClose () {
    setShowModal(false);
  }

  function handleModalConfirm (e) {
    setShowModal(false);
    handleSubmit(e);
  }

  let buttonText;

  if (status === 'inflight') {
    buttonText = 'loading...';
  } else if (status === 'success') {
    buttonText = 'Success!';
  } else {
    buttonText = 'Submit';
  }

  const displayCaseType = displayCase(type);
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
              className={`button button--submit button__animation--md button__arrow button__arrow--md button__animation button__arrow--white form-group__element--right${status === 'inflight' ? ' button--disabled' : ''}`}
              onClick={handleOnClick}
              readOnly={true}
            >{buttonText}</button>
            <button
              className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--right'
              onClick={handleCancel}
              readOnly={true}
            >Cancel</button>
          </form>
          {requireConfirmation &&
            <DefaultModal
              title={`Add ${displayCaseType}`}
              className={`add-${type}`}
              showModal={showModal}
              cancelButtonText='Cancel Edit'
              confirmButtonText={`Confirm ${displayCaseType}`}
              onConfirm={handleModalConfirm}
              onCloseModal={handleModalClose}>
              <ModalBody record={record} className="center" />
            </DefaultModal>}
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
  createRecord: PropTypes.func,
  requireConfirmation: PropTypes.bool,
  type: PropTypes.string,
  ModalBody: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  router: PropTypes.object
};

export default withRouter(connect()(AddRaw));
