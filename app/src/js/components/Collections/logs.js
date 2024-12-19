import React from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import LogViewer from '../Logs/viewer';
import { strings } from '../locale';
import CollectionHeader from './collection-header';
import { withRouter } from '../../withRouter';

const breadcrumbConfig = [
  {
    label: 'Logs',
    active: true,
  }
];

const CollectionLogs = ({ logs, router }) => {
  const dispatch = useDispatch();
  const { params } = router;
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
  logs: PropTypes.object,
  router: PropTypes.shape({
    params: PropTypes.object
  }),
};

const mapStateToProps = (state) => ({
  logs: state.logs
});

export default withRouter(connect(mapStateToProps)(CollectionLogs));
