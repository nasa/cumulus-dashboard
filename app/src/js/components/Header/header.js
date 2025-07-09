import React, { useEffect, useCallback, useRef } from 'react';
import c from 'classnames';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import {
  logout,
  getApiVersion,
  getCMRInfo,
  getCumulusInstanceMetadata,
} from '../../actions';
import { graphicsPath, nav } from '../../config';
import { window } from '../../utils/browser';
import { strings } from '../locale';
import linkToKibana from '../../utils/kibana';
import { getPersistentQueryParams } from '../../utils/url-helper';
import SessionTimeoutModal from '../SessionTimeoutModal/session-timeout-modal';
import InactivityModal from '../InactivtyModal/inactivity-modal';

const paths = [
  [strings.collections, '/collections/all'],
  ['Providers', '/providers'],
  [strings.granules, '/granules'],
  ['Workflows', '/workflows'],
  ['Executions', '/executions'],
  ['Operations', '/operations'],
  ['Rules', '/rules'],
  ['PDRs', '/pdrs'],
  ['Logs', 'logs'],
  ['Reconciliation Reports', '/reconciliation-reports'],
];

const Header = ({
  api,
  dispatch,
  location,
  minimal,
  locationQueryParams,
}) => {
  const mounted = useRef(true);

  const handleLogout = useCallback(() => {
    dispatch(logout()).then(() => {
      if (get(window, 'location.reload')) {
        window.location.reload();
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (api.authenticated && mounted.current) {
      dispatch(getApiVersion());
      dispatch(getCMRInfo());
      dispatch(getCumulusInstanceMetadata());
    }
    return () => {
      mounted.current = false;
    };
  }, [api.authenticated, dispatch]);

  const className = (path) => {
    const active = location.pathname?.slice(0, path.length) === path; // nav issue with router
    const menuItem = path.replace('/', '');
    const order = `nav__order-${!nav.order.includes(menuItem) ? 2 : nav.order.indexOf(menuItem)}`;
    return c({
      active,
      [order]: true,
    });
  };

  const linkTo = (path, search) => {
    if (path[0] === 'Logs') {
      const kibanaLink = linkToKibana();
      return (
        <a href={kibanaLink} target="_blank">
          {path[0]}
        </a>
      );
    }

    return <Link to={{ pathname: path[1], search }}>{path[0]}</Link>;
  };

  const locationSearch = getPersistentQueryParams(location);
  const activePaths = paths.filter((path) => !nav.exclude[path[0]]);
  const logoPath =
    graphicsPath.substr(-1) === ('/')
      ? `${graphicsPath}${strings.logo}`
      : `${graphicsPath}/${strings.logo}`;

  return (
      <div className="header" role='banner'>
        <div className="row">
          <h1 className="logo">
            <Link to={{ pathname: '/', search: locationSearch }}>
              <img alt="Logo" src={logoPath} />
            </Link>
          </h1>
          <nav>
            {!minimal
              ? (
              <ul>
                {activePaths.map((path) => (
                  <li key={path[0]} className={className(path[1])}>
                    {linkTo(path, locationQueryParams.search[path[1]] || locationSearch)}
                  </li>
                ))}
                <li className="rightalign nav__order-8">
                  {api.authenticated
                    ? (
                    <button onClick={handleLogout}>
                      <span className="log-icon"></span>Log out
                    </button>
                      )
                    : (
                    <Link to={'/login'}>Log in</Link>
                      )}
                </li>
              </ul>
                )
              : (
              <li>&nbsp;</li>
                )}
          </nav>
        </div>
        <div className="session-timeout-modal"><SessionTimeoutModal/></div>
        <div className="inactivity-modal"><InactivityModal/></div>
      </div>
  );
};

Header.propTypes = {
  api: PropTypes.object,
  dispatch: PropTypes.func,
  location: PropTypes.object,
  minimal: PropTypes.bool,
  cumulusInstance: PropTypes.object,
  datepicker: PropTypes.object,
  locationQueryParams: PropTypes.object,
};

export { Header };

export default withRouter(connect((state) => ({
  locationQueryParams: state.locationQueryParams,
  api: state.api
}))(Header));
