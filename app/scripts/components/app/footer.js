'use strict';

import React from 'react';
import PropTypes from 'prop-types';

class Footer extends React.Component {
  constructor () {
    super();
    this.displayName = 'Footer';
  }

  render () {
    const { authenticated } = this.props.api;
    const { warning, versionNumber } = this.props.apiVersion;

    let versionWarning;
    if (warning) { versionWarning = <h5 className='apiVersionWarning'>Warning: { warning }</h5>; }
    return (
      <div className='footer'>
        { authenticated &&
            <h5 className='apiVersion'>Cumulus API Version: { versionNumber }</h5>
        }
        { versionWarning }
      </div>
    );
  }
}

Footer.propTypes = {
  api: PropTypes.object,
  apiVersion: PropTypes.object
};

export default Footer;
