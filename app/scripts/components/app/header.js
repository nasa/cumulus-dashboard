'use strict';
import React from 'react';
import { Link } from 'react-router';
import { logout } from '../../actions';
import { graphicsPath } from '../../config';
import { window } from '../../utils/browser';

var Header = React.createClass({
  displayName: 'Header',
  propTypes: {
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

  render: function () {
    const { authenticated } = this.props.api;
    return (
      <div className='header'>
        <div className='row'>
          <h1 className='logo'><Link to='/'><img alt="Cumulus Logo" src={graphicsPath + 'layout/cumulus-logo.png'} /></Link></h1>
          <nav>
            { !this.props.minimal ? <ul>
              <li><Link to='/collections'>Collections</Link></li>
              <li><Link to='/granules'>Granules</Link></li>
              <li><Link to='/pdrs'>PDRs</Link></li>
              <li><Link to='/providers'>Providers</Link></li>
              <li><Link to='/logs'>Logs</Link></li>
              <li><Link to='/contact'>Contact</Link></li>
              <li className='rightalign'>{ authenticated ? <a onClick={this.logout}>Log out</a> : <Link to={'/login'}>Log in</Link> }</li>
            </ul> : <li>&nbsp;</li> }
          </nav>
        </div>
      </div>
    );
  }
});

export default Header;
