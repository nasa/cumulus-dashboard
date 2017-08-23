'use strict';
import React from 'react';
import c from 'classnames';
import { Link } from 'react-router';
import { get } from 'object-path';
import { logout } from '../../actions';
import { graphicsPath, exclude, order } from '../../config';
import { window } from '../../utils/browser';

const excludeNav = get(exclude, 'nav', {});
const navOrder = get(order, 'nav', {});

const paths = [
  ['PDRs', '/pdrs'],
  ['Providers', '/providers'],
  ['Collections', '/collections'],
  ['Granules', '/granules'],
  ['Workflows', '/workflows'],
  ['Logs', '/logs']
];

var Header = React.createClass({
  displayName: 'Header',
  propTypes: {
    location: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    api: React.PropTypes.object,
    minimal: React.PropTypes.bool
  },

  logout: function () {
    this.props.dispatch(logout());
    if (window.location && window.location.reload) {
      setTimeout(() => window.location.reload(), 50);
    }
  },

  className: function (path) {
    const active = this.props.location.pathname.slice(0, path.length) === path;
    const order = 'nav__order-' + (typeof navOrder[path] === 'undefined' ? 1 : navOrder[path]);
    return c({
      'active': active,
      [order]: true
    });
  },

  render: function () {
    const { authenticated } = this.props.api;
    const activePaths = paths.filter(pathObj => !excludeNav[pathObj[1]]);
    return (
      <div className='header'>
        <div className='row'>
          <h1 className='logo'><Link to='/'><img alt="Cumulus Logo" src={graphicsPath + 'layout/cumulus-logo.png'} /></Link></h1>
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
