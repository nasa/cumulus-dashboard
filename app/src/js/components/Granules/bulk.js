'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bulkGranule } from '../../actions';
import { getCollectionId, collectionHref } from '../../utils/format';
import AddRaw from '../AddRaw/add-raw';
import { kibanaRoot } from '../../config';

const getBaseRoute = function (collectionId) {
  if (collectionId) {
    return collectionHref(collectionId);
  } else {
    return '/collections/collection';
  }
};

class BulkGranule extends React.Component {
  render () {
    const prefill = '{/nqueueName: expectedQueueName,/n workflowName: expectedWorkflowName,/n index: expectedIndex,/n query: expectedQuery/n}';
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description '>Bulk Granules</h1>
          </div>
        </section>
        <section>
          <h4>To run and complete your bulk granule task:</h4>
          1. In the box below, enter your queueName and the workflowName. <br/>
          2. Then add either an array of granule Ids or an elasticsearch query and index. <br/>
          To construct a query, go to Kibana and run a search. Then place the elasticsearch query in the operation input. <br/>
          <a href={kibanaRoot}>Open Kibana</a> <br/>
        </section>
        <section>
          <AddRaw
            pk={'new-operation'}
            primaryProperty={'name'}
            title={'Operation Input'}
            state={this.props.collections}
            prefill={prefill}
            createRecord={bulkGranule}
            getBaseRoute={getBaseRoute}
            getPk={getCollectionId}
          />
        </section>
      </div>
    );
  }
}

BulkGranule.propTypes = {
  collections: PropTypes.object
};

export default connect(state => ({
  collections: state.collections
}))(BulkGranule);
