'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { getResources } from '../../actions';

var Resources = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func,
    stats: React.PropTypes.object
  },

  componentWillMount: function () {
    this.queryResources();
  },

  queryResources: function () {
    this.props.dispatch(getResources());
  },

  render: function () {
    const { resources } = this.props.stats;
    console.log(resources);
    return (
      <div className='page__logs'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>Resources</h1>
          </div>
        </div>
        <div className='page__content page__content__nosidebar'>
          <div className='row'>
          </div>
        </div>
      </div>
    );
  }
});
export default connect(state => state)(Resources);
