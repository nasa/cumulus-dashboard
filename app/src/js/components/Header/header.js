import React from 'react';
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

class Header extends React.Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.className = this.className.bind(this);
    this.linkTo = this.linkTo.bind(this);
  }

  componentDidMount() {
    const { dispatch, api } = this.props;
    if (api.authenticated) {
      dispatch(getApiVersion());
      dispatch(getCMRInfo());
      dispatch(getCumulusInstanceMetadata());
    }
  }

  logout() {
    const { dispatch } = this.props;
    dispatch(logout()).then(() => {
      if (get(window, 'location.reload')) {
        window.location.reload();
      }
    });
  }

  className(path) {
    const active = this.props.location.pathname?.slice(0, path.length) === path; // nav issue with router
    const menuItem = path.replace('/', '');
    const order = `nav__order-${!nav.order.includes(menuItem) ? 2 : nav.order.indexOf(menuItem)}`;
    return c({
      active,
      [order]: true,
    });
  }

  linkTo(path, search) {
    if (path[0] === 'Logs') {
      const kibanaLink = linkToKibana();
      return (
        <a href={kibanaLink} target="_blank">
          {path[0]}
        </a>
      );
    }

    return <Link to={{ pathname: path[1], search }}>{path[0]}</Link>;
  }

  render() {
    const { api, location, minimal, locationQueryParams } = this.props;
    const { authenticated } = api;
    const locationSearch = getPersistentQueryParams(location);
    const activePaths = paths.filter((path) => !nav.exclude[path[0]]);
    const logoPath =
      graphicsPath.substr(-1) === '/'
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
                  <li key={path[0]} className={this.className(path[1])}>
                    {this.linkTo(path, locationQueryParams.search[path[1]] || locationSearch)}
                  </li>
                ))}
                <li className="rightalign nav__order-8">
                  {authenticated
                    ? (
                    <button onClick={this.logout}>
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
      </div>
    );
  }
}

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
  locationQueryParams: state.locationQueryParams
}))(Header));
