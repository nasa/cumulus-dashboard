'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Resources = React.createClass({
  render: function () {
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
