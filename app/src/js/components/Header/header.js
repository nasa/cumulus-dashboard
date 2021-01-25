import React from 'react';
import c from 'classnames';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import {
  logout,
  getApiVersion,
  getCumulusInstanceMetadata,
} from '../../actions';
import { graphicsPath, nav } from '../../config';
import { window } from '../../utils/browser';
import { strings } from '../locale';
import { kibanaAllLogsLink } from '../../utils/kibana';
import { getPersistentQueryParams } from '../../utils/url-helper';

const paths = [
  ['PDRs', '/pdrs'],
  ['Providers', '/providers'],
  [strings.collections, '/collections'],
  [strings.granules, '/granules'],
  ['Workflows', '/workflows'],
  ['Executions', '/executions'],
  ['Operations', '/operations'],
  ['Rules', '/rules'],
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
    const active = this.props.location.pathname.slice(0, path.length) === path; // nav issue with router
    const menuItem = path.replace('/', '');
    const order = `nav__order-${!nav.order.includes(menuItem) ? 2 : nav.order.indexOf(menuItem)}`;
    return c({
      active,
      [order]: true,
    });
  }

  linkTo(path, search) {
    if (path[0] === 'Logs') {
      const kibanaLink = kibanaAllLogsLink(this.props.cumulusInstance, this.props.datepicker);
      return (
        <a href={kibanaLink} target="_blank">
          {path[0]}
        </a>
      );
    }

    return <Link to={{ pathname: path[1], search }}>{path[0]}</Link>;
  }

  render() {
    const { api, location, minimal } = this.props;
    const { authenticated } = api;
    const locationSearch = getPersistentQueryParams(location);
    const activePaths = paths.filter((path) => nav.exclude[path[0]] !== true);
    const logoPath =
      graphicsPath.substr(-1) === '/'
        ? `${graphicsPath}${strings.logo}`
        : `${graphicsPath}/${strings.logo}`;
    return (
      <div className="header">
        <div className="row">
          <h1 className="logo">
            <Link to={{ pathname: '/', search: locationSearch }}>
              <img alt="Logo" src={logoPath} />
            </Link>
          </h1>
          <nav>
            {!minimal ? (
              <ul>
                {activePaths.map((path) => (
                  <li key={path[0]} className={this.className(path[1])}>
                    {this.linkTo(path, locationSearch)}
                  </li>
                ))}
                <li className="rightalign nav__order-8">
                  {authenticated ? (
                    <button onClick={this.logout}>
                      <span className="log-icon"></span>Log out
                    </button>
                  ) : (
                    <Link to={'/login'}>Log in</Link>
                  )}
                </li>
              </ul>
            ) : (
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
};

export { Header };

export default withRouter(connect((state) => state)(Header));
