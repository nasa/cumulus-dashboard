import React from 'react';
import PropTypes from 'prop-types';
const pckg = require('../../../../../package.json');

class Footer extends React.Component {
  constructor () {
    super();
    this.displayName = 'Footer';
  }

  render () {
    const DASH_VERSION = pckg.version;
    const { authenticated } = this.props.api;
    const { warning, versionNumber } = this.props.apiVersion;

    let versionWarning;
    if (warning) { versionWarning = <h5 className='api__warning'><span className="warning-icon"></span>Warning: { warning }</h5>; }

    return (
      <div className='footer'>
        <div className='api__summary'>
          { authenticated &&
            <div>
              <h5 className='dashboard_version'> Cumulus Dashboard Version: { DASH_VERSION } </h5>
              <h5 className='api__version'> Cumulus API Version: { versionNumber } </h5>
            </div>
          }
          { versionWarning }
        </div>
      </div>
    );
  }
}

Footer.propTypes = {
  api: PropTypes.object,
  apiVersion: PropTypes.object
};

export default Footer;
