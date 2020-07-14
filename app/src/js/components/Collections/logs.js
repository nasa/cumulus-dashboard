'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { lastUpdated } from '../../utils/format';
import LogViewer from '../Logs/viewer';
import { strings } from '../locale';
import { getPersistentQueryParams } from '../../utils/url-helper';

const CollectionLogs = ({ dispatch, logs, match }) => {
  const collectionName = match.params.name;
  const { queriedAt } = logs;
  return (
    <div className="page__component">
      <section className="page__section">
        <div className="heading__wrapper--border">
          <h1 className="heading--large heading--shared-content with-description">
            {collectionName}
          </h1>
        </div>
        <Link
          className="button button--edit button--small form-group__element--right button--green"
          to={(location) => ({
            pathname: `/collections/edit/${collectionName}`,
            search: getPersistentQueryParams(location),
          })}
        >
          Edit
        </Link>
        {lastUpdated(queriedAt)}
      </section>
      <LogViewer
        query={{ q: collectionName }}
        dispatch={dispatch}
        logs={logs}
      />
    </div>
  );
};

CollectionLogs.displayName = strings.collection_logs;

CollectionLogs.propTypes = {
  dispatch: PropTypes.func,
  logs: PropTypes.object,
  match: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    logs: state.logs,
  }))(CollectionLogs)
);
