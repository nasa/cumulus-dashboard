import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import LogViewer from '../Logs/viewer';
import { strings } from '../locale';
import CollectionHeader from './collection-header';

const breadcrumbConfig = [
  {
    label: 'Logs',
    active: true,
  }
];

const CollectionLogs = ({ dispatch, logs, match }) => {
  const { params } = match;
  const { name: collectionName, version: collectionVersion } = params;
  const decodedVersion = decodeURIComponent(collectionVersion);
  const { queriedAt } = logs;

  return (
    <div className="page__component">
      <CollectionHeader
        breadcrumbConfig={breadcrumbConfig}
        name={collectionName}
        queriedAt={queriedAt}
        version={decodedVersion}
      />
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
