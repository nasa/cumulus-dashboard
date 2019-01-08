'use strict';

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

var Footer = createReactClass({
  displayName: 'Footer',
  propTypes: {
    api: PropTypes.object,
    apiVersion: PropTypes.object
  },

  render: function () {
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
});

export default Footer;
