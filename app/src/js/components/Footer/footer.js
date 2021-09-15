import React from 'react';
import PropTypes from 'prop-types';
import Popover from '../Popover/popover';
import cmrInfo from '../../reducers/cmr-info';
const pckg = require('../../../../../package.json');

const Footer = ({
  api,
  apiVersion,
  cmrInfo,
}) => {
  const DASH_VERSION = pckg.version;
  const { authenticated } = api;
  const { warning, versionNumber } = apiVersion;
  const { cmrProvider, cmrEnv } = cmrInfo;

  const leftSideLinks = [
    { text: 'FOIA', url: 'https://www.nasa.gov/FOIA/index.html' },
    { text: 'Privacy', url: 'https://www.nasa.gov/about/highlights/HP_Privacy.html' },
    { text: 'Feedback', url: 'https://github.com/nasa/cumulus-dashboard/issues' }
  ];

  const rightSideLinks = [
    { text: 'Open Cumulus GitHub Docs', url: 'https://nasa.github.io/cumulus/docs/cumulus-docs-readme', iconClassName: 'fab fa-github fa-lg' }
  ];

  let versionWarning;
  if (warning) { versionWarning = <h5 className='api__warning'><span className="warning-icon"></span>Warning: { warning }</h5>; }

  return (
    <div className='footer'>
      <div className='api__summary'>
        {authenticated &&
          <ul className="footer__container">
            <li className="footer__links">
              <div>NASA</div>
              {leftSideLinks.map((linkInfo, id) => (
                <div key = { id }><a href={linkInfo.url} target="_blank">{linkInfo.text}</a></div>
              ))}
            </li>
            <li className="footer__version">
              <div className="version__label">Version</div>
              <div className="dashboard__version">Dashboard v{DASH_VERSION}</div>
              <div className="api__version">
              <Popover
                className="popover--blue"
                id={'api check id'}
                placement="top"
                popover={true}
                target={`API v${versionNumber}`}
                popoverContent={
                  <>
                  <div className="popover-body--header">Cumulus API Configurations</div>
                    <div className="popover-body--main">
                      Below are details about your API Configurations that are associated to your DAAC and individual operator settings.
                    </div>
                    <div className="popover-body--main">{
                      `CMR Environment: ${cmrEnv}
                      CMR Provider: ${cmrProvider}
                      CMR Authentication: idk
                      Distribution Version: idk`}
                    </div>
                  </>
                }
              />
                </div>
            </li>
            <li className="footer__opensource">
              {rightSideLinks.map((linkInfo, id) => (
                <div key = { id } ><a href={linkInfo.url} target="_blank"><i className={linkInfo.iconClassName}></i> {linkInfo.text}</a></div>
              ))}
            </li>
          </ul>
        }
        { versionWarning }
      </div>
    </div>
  );
};

Footer.propTypes = {
  api: PropTypes.object,
  apiVersion: PropTypes.object,
  cmrInfo: PropTypes.object
};

export default Footer;
