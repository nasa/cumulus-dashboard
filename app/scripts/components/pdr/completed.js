'use strict';
import React from 'react';
import { connect } from 'react-redux';

class PdrCompleted extends React.Component {
  render () {
    return (
      <div className='page__component'>
        <h1>This is a completed PDR!</h1>
      </div>
    );
  }
}

export default connect(state => state)(PdrCompleted);
