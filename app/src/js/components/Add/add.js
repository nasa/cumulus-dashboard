import path from 'path';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get } from 'object-path';
import { getSchema } from '../../actions';
import Schema from '../FormSchema/schema';
import Loading from '../LoadingIndicator/loading-indicator';
import _config from '../../config';
import { strings } from '../locale';
import { window } from '../../utils/browser';
import { historyPushWithQueryParams } from '../../utils/url-helper';

const { updateDelay } = _config;

const AddRecord = ({
  attachMeta,
  baseRoute,
  createRecord,
  data,
  dispatch,
  enums,
  exclude,
  include,
  handleInputChange,
  primaryProperty,
  schemaKey,
  schemaState,
  state,
  title,
  validate,
  validationError,
}) => {
  const [pk, setPk] = useState(null);
  const [error, setError] = useState(null);
  const record = pk ? get(state.created, pk, {}) : {};
  const schema = schemaState[schemaKey];

  useEffect(() => {
    if (!schema) {
      dispatch(getSchema(schemaKey));
    }
  }, [dispatch, schema, schemaKey]);

  useEffect(() => {
    const status = get(state, ['created', pk, 'status']);
    if (status === 'success') {
      setTimeout(() => {
        historyPushWithQueryParams(path.join(baseRoute, pk));
        if (window) {
          window.scrollTo(0, 0);
        }
      }, updateDelay);
    }
  }, [baseRoute, pk, state]);

  function navigateBack() {
    historyPushWithQueryParams(`/${baseRoute.split('/')[1]}`);
  }

  function post(_id, payload) {
    if (attachMeta) {
      payload.createdAt = new Date().getTime();
      payload.updatedAt = payload.createdAt;
      payload.changedBy = strings.dashboard;
    }

    if (!validate || validate(payload)) {
      const newPk = get(payload, primaryProperty);
      dispatch(createRecord(newPk, payload));
      setPk(newPk);
    } else {
      const errorMessage = validationError || 'Payload failed validation';
      console.log(errorMessage);
      setError(errorMessage);
    }
  }

  return (
    <div className="page__component page__content--shortened--centered">
      <section className="page__section page__section--fullpage-form">
        <div className="page__section__header">
          <h1 className="heading--large">{title}</h1>
        </div>
        {schema
          ? (
            <Schema
              data={data}
              schema={schema}
              handleInputChange={handleInputChange}
              onSubmit={post}
              onCancel={navigateBack}
              status={record.status}
              error={
                error || (record.status === 'inflight' ? null : record.error)
              }
              include={include}
              exclude={exclude}
              enums={enums}
            />
            )
          : (
            <Loading />
            )}
      </section>
    </div>
  );
};

AddRecord.propTypes = {
  data: PropTypes.object,
  schemaState: PropTypes.object,
  schemaKey: PropTypes.string,
  primaryProperty: PropTypes.string,
  title: PropTypes.string,
  enums: PropTypes.objectOf(PropTypes.array),

  dispatch: PropTypes.func,
  state: PropTypes.object,

  baseRoute: PropTypes.string,
  attachMeta: PropTypes.bool,

  createRecord: PropTypes.func,
  validate: PropTypes.func,
  validationError: PropTypes.string,

  // Specifies schema properties to include on the form.  Each element in this
  // array may be either a string that specifies the full path of the property
  // within the schema (e.g., "collection.name" and "collection.version") or a
  // regular expression (e.g., /^collection/).
  include: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)])
  ),
  // Specifies schema properties to exclude from the form.  Elements in this
  // array are specified the same was as in the "include" array.  However,
  // exclusions are applied after inclusions, so a property that is included
  // via the "include" array may be excluded by this array, preventing it from
  // appearing on the form.
  exclude: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)])
  ),
  handleInputChange: PropTypes.objectOf(PropTypes.func),
};

Schema.defaultProps = {
  // Exclude no schema properties
  exclude: [],
  // Include all schema properties
  include: [/.+/],
};

export default withRouter(
  connect((state) => ({
    schemaState: state.schema,
  }))(AddRecord)
);
