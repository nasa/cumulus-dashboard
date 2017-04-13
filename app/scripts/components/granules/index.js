import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import Sidebar from '../app/sidebar';
import { interval, getCount } from '../../actions';
import { updateInterval } from '../../config';

var Granules = React.createClass({
  displayName: 'Granules',

  propTypes: {
    children: React.PropTypes.object,
    location: React.PropTypes.object,
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    stats: React.PropTypes.object
  },

  componentWillMount: function () {
    this.cancelInterval = interval(() => this.query(), updateInterval, true);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  query: function () {
    this.props.dispatch(getCount({
      type: 'granules',
      field: 'status'
    }));
  },

  render: function () {
    const count = get(this.props.stats, 'count.data.granules.count');
    return (
      <div className='page__granules'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>Granules</h1>
          </div>
        </div>
        <div className='page__content'>
          <div className='row wrapper__sidebar'>
            <Sidebar
              currentPath={this.props.location.pathname}
              params={this.props.params}
              count={count}
            />
            <div className='page__content--shortened'>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Granules);
