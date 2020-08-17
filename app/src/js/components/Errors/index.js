import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Errors extends React.Component {
  constructor () {
    super();
    this.displayName = 'Errors';
  }

  render () {
    return (
      <div className='page__errors'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>Errors</h1>
          </div>
        </div>
        <div className='page__content page__content'>
          <div className='row'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Errors.propTypes = {
  children: PropTypes.object
};

export default connect((state) => state)(Errors);
