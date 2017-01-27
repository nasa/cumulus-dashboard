'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Contact = React.createClass({
  displayName: 'Contact',

  render: function () {
    return (
      <div className='page__component'>
        <h1>This is a contact page!</h1>
      </div>
    );
  }
});

export default connect(state => state)(Contact);
