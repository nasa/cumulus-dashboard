import React from 'react';
import { connect } from 'react-redux';

class Error extends React.Component {
  constructor () {
    super();
    this.displayName = 'Error';
  }

  render () {
    return (
      <div className='page__component'>
        <h1>This is an error page</h1>
      </div>
    );
  }
}

export default connect((state) => state)(Error);
