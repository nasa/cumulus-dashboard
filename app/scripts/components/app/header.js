'use strict';
import React from 'react';
import c from 'classnames';
import { Link } from 'react-router';
import { logout, checkApiVersion } from '../../actions';
import { graphicsPath, nav, compatibleApiVersions } from '../../config';
import { window } from '../../utils/browser';
import { strings } from '../locale';

const paths = [
  ['PDRs', '/pdrs'],
  ['Providers', '/providers'],
  [strings.collections, '/collections'],
  [strings.granules, '/granules'],
  ['Workflows', '/workflows'],
  ['Executions', '/executions'],
  ['Rules', '/rules'],
  ['Logs', '/logs'],
  ['Reconciliation Reports', 'reconciliation-reports']
];

var Header = React.createClass({
  displayName: 'Header',
  propTypes: {
    api: React.PropTypes.object,
    apiVersion: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    location: React.PropTypes.object,
    minimal: React.PropTypes.bool
  },

  componentWillMount: function () {
    const { dispatch, api } = this.props;
    if (api.authenticated) dispatch(checkApiVersion(compatibleApiVersions));
  },

  logout: function () {
    this.props.dispatch(logout());
    if (window.location && window.location.reload) {
      setTimeout(() => window.location.reload(), 50);
    }
  },

  className: function (path) {
    const active = this.props.location.pathname.slice(0, path.length) === path;
    const menuItem = path.replace('/', '');
    const order = 'nav__order-' + (nav.order.indexOf(menuItem) === -1 ? 2 : nav.order.indexOf(menuItem));
    return c({
      'active': active,
      [order]: true
    });
  },

  render: function () {
    const { authenticated } = this.props.api;
    const { warning, versionNumber } = this.props.apiVersion;
    const activePaths = paths.filter(pathObj => nav.exclude[pathObj[1].replace('/', '')] !== true);
    return (
      <div className='header'>
        <div className='row'>
          <h1 className='logo'><Link to='/'><img alt="Logo" src={graphicsPath + strings.logo} /></Link></h1>
          <h5 className='apiVersion'>{ versionNumber }</h5>
          { warning ? <h5 className='apiWarning'>{ warning }</h5> : <li>&nbsp;</li> }
          <nav>
            { !this.props.minimal ? <ul>
              {activePaths.map(path => <li
                key={path[0]}
                className={this.className(path[1])}><Link to={path[1]}>{path[0]}</Link></li>)}
              <li className='rightalign nav__order-8'>{ authenticated ? <a onClick={this.logout}>Log out</a> : <Link to={'/login'}>Log in</Link> }</li>
            </ul> : <li>&nbsp;</li> }
          </nav>
        </div>
      </div>
    );
  }
});

export default Header;
