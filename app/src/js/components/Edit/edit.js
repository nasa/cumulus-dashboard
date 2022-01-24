import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { withRouter } from 'react-router-dom';
import { getSchema } from '../../actions';
import Loading from '../LoadingIndicator/loading-indicator';
import Schema from '../FormSchema/schema';
import merge from '../../utils/merge';
import _config from '../../config';
import { strings } from '../locale';
import { historyPushWithQueryParams } from '../../utils/url-helper';

const { updateDelay } = _config;

const EditRecord = ({
  attachMeta,
  backRoute,
  clearRecordUpdate,
  dispatch,
  getRecord,
  includedForms,
  merge: shouldMerge,
  pk,
  schemaKey,
  schemaState,
  state,
  updateRecord,
  validate,
  validationError,
}) => {
  const record = get(state.map, pk, {});
  const meta = get(state.updated, pk, {});
  const schema = schemaState[schemaKey];
  const [error, setError] = useState(record.error || meta.error);
  const [pkState, setPkState] = useState(pk);

  useEffect(() => {
    dispatch(getRecord(pk));
    dispatch(getSchema(schemaKey));
  }, [dispatch, getRecord, pk, schemaKey]);

  useEffect(
    () => {
      const updateStatus = get(state.updated, [pk, 'status']);
      if (updateStatus === 'success') {
        setTimeout(() => {
          dispatch(clearRecordUpdate(pk));
          historyPushWithQueryParams(backRoute);
        }, updateDelay);
      }

      if (pkState !== pk) {
        // record has hit an API error
        if (record.error) {
          setError(record.error);
          setPkState(pk);
        } else if (record.data) {
          setError(null);
          setPkState(pk);
        } else if (!record.inflight) {
        // we've not yet fetched the record, request it
          dispatch(getRecord(pk));
        }
      }
    },
    [backRoute, clearRecordUpdate, dispatch, getRecord, pk, pkState, record, state.updated]
  );

  function navigateBack () {
    historyPushWithQueryParams(backRoute);
  }

  function onSubmit (_id, payload) {
    const json = shouldMerge ? merge(record.data, payload) : payload;
    if (attachMeta) {
      json.updatedAt = new Date().getTime();
      json.changedBy = strings.dashboard;
    }
    if (!validate || validate(payload)) {
      setError(null);
      console.log('About to update', json);
      dispatch(updateRecord(pk, json));
    } else {
      const errorMessage = validationError || 'Payload failed validation';
      console.log(errorMessage);
      setError(errorMessage);
    }
  }

  return (
    <div className='page__component'>
      <section className='page__section'>
        <h1 className='heading--large'>Edit {schemaKey}: {pk}</h1>
        {schema && record.data
          ? (
          <Schema
            schema={schema}
            data={record.data}
            pk={pk}
            onSubmit={onSubmit}
            onCancel={navigateBack}
            status={meta.status}
            include={includedForms}
            error={meta.status === 'inflight' ? null : error}
          />
            )
          : <Loading />}
      </section>
    </div>
  );
};

EditRecord.propTypes = {
  pk: PropTypes.string,
  schemaState: PropTypes.object,
  schemaKey: PropTypes.string,
  dispatch: PropTypes.func,
  state: PropTypes.object,
  backRoute: PropTypes.string,

  includedForms: PropTypes.array,
  merge: PropTypes.bool,
  attachMeta: PropTypes.bool,

  getRecord: PropTypes.func,
  updateRecord: PropTypes.func,
  clearRecordUpdate: PropTypes.func,
  validate: PropTypes.func,
  validationError: PropTypes.string,
};

export { EditRecord };
export default withRouter(connect((state) => ({
  schemaState: state.schema
}))(EditRecord));
