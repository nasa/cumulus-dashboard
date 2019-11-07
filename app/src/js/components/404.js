'use strict';
import React from 'react';
import { connect } from 'react-redux';

class NotFound extends React.Component {
  constructor () {
    super();
    this.displayName = '404';
  }

  render () {
    return (
      <div className='page__404'>
        <h1>404</h1>
      </div>
    );
  }
}

export default connect(state => state)(NotFound);
