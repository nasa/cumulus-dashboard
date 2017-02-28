'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Contact = React.createClass({
  displayName: 'Contact',

  render: function () {
    return (
      <div className='page__contact'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>Contact</h1>
          </div>
        </div>
        <div className='page__content'>
          <div className='row'>

          </div>
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Contact);
