'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { getResources, interval } from '../../actions';
import { nullValue, tally, storage, lastUpdated } from '../../utils/format';
import * as queueConfig from '../../utils/table-config/queues';
import * as serviceConfig from '../../utils/table-config/services';
import * as instanceConfig from '../../utils/table-config/instances';
import SortableTable from '../table/sortable';
import LoadingEllipsis from '../app/loading-ellipsis';

// slower 20 second update interval here
const UPDATE = 20000;

var Resources = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func,
    stats: React.PropTypes.object
  },

  componentWillMount: function () {
    this.query();
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) this.cancelInterval();
  },

  query: function () {
    const { dispatch } = this.props;
    if (this.cancelInterval) this.cancelInterval();
    this.cancelInterval = interval(() => dispatch(getResources()), UPDATE, true);
  },

  render: function () {
    const { resources } = this.props.stats;
    const { inflight, data } = resources;
    const queues = get(data, 'queues', []);
    const services = get(data, 'services', []);
    const instances = get(data, 'instances', []);
    const overview = [
      [tally(queues.length) || nullValue, 'SQS Queues'],
      [tally(services.length) || nullValue, 'Services'],
      [tally(instances.length) || nullValue, 'EC2 Instances'],
      [tally(get(data, 'tasks.pendingTasks')), 'Tasks Pending'],
      [tally(get(data, 'tasks.runningTasks')), 'Tasks Running'],
      [storage(get(data, 's3', []).reduce((a, b) => a + get(b, 'Sum', 0), 0)), 'Data Used']
    ];

    return (
      <div className='page__logs'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>Resources</h1>
          </div>
        </div>

        <div className='page__content page__content__nosidebar'>
          <section className='page__section'>
            <div className='row'>
              {lastUpdated(data.updatedAt)}
              <ul>
                {overview.map(d => (
                  <li key={d[1]}>
                    <span className='overview-num'><span className='num--large'>{inflight && !data.timestamp ? <LoadingEllipsis /> : d[0]}</span> {d[1]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className='page__section' id='queues'>
            <div className='row'>
              <div className='heading__wrapper--border'>
                <h2 className='heading--medium heading--shared-content with-description'>SQS Queues {inflight ? <LoadingEllipsis /> : null}</h2>
              </div>
            </div>
            <div className='row'>
              <SortableTable
                data={queues}
                header={queueConfig.tableHeader}
                row={queueConfig.tableRow}
                props={['name', 'messagesAvailable', 'messagesInFlight']}
                />
            </div>
          </section>

          <section className='page__section' id='services'>
            <div className='row'>
              <div className='heading__wrapper--border'>
                <h2 className='heading--medium heading--shared-content with-description'>Services {inflight ? <LoadingEllipsis /> : null}</h2>
              </div>
            </div>
            <div className='row'>
              <SortableTable
                data={services}
                header={serviceConfig.tableHeader}
                row={serviceConfig.tableRow}
                props={['name', 'status', 'desiredCount', 'pendingCount', 'runningCount']}
                />
            </div>
          </section>

          <section className='page__section' id='instances'>
            <div className='row'>
              <div className='heading__wrapper--border'>
                <h2 className='heading--medium heading--shared-content with-description'>EC2 Instances {inflight ? <LoadingEllipsis /> : null}</h2>
              </div>
            </div>
            <div className='row'>
              <SortableTable
                data={instances}
                header={instanceConfig.tableHeader}
                row={instanceConfig.tableRow}
                props={['id', 'status', 'pendingTasks', 'runningTasks', 'availableCpu', 'availableMemory']}
                />
            </div>
          </section>
        </div>
      </div>
    );
  }
});
export default connect(state => state)(Resources);
