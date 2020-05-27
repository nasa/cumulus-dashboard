'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { lastUpdated } from '../../utils/format';
import LogViewer from '../Logs/viewer';
import { strings } from '../locale';

class CollectionLogs extends React.Component {
  constructor() {
    super();
    this.displayName = strings.collection_logs;
  }

  render() {
    const collectionName = this.props.match.params.name;
    const { queriedAt } = this.props.logs;
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
            to={`/collections/edit/${collectionName}`}
          >
            Edit
          </Link>
          {lastUpdated(queriedAt)}
        </section>
        <LogViewer
          query={{ q: collectionName }}
          dispatch={this.props.dispatch}
          logs={this.props.logs}
        />
      </div>
    );
  }
}

CollectionLogs.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.object,
  logs: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    logs: state.logs,
  }))(CollectionLogs)
);
