import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class NotFound extends React.Component {
  constructor () {
    super();
    this.displayName = '404';
  }

  render () {
    return (
      <div className='page__404'>
        <h1>404</h1>
        <p>Sorry page not found.</p>
      </div>
    );
  }
}

export default withRouter(connect((state) => state)(NotFound));
