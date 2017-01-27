'use strict';
import React from 'react';
import { Link } from 'react-router';

var Header = React.createClass({
  displayName: 'Header',

  render: function () {
    return (
      <div className='header'>
        <h1>Cumulus</h1>
        <nav>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/collections'>Collections</Link></li>
            <li><Link to='/granules'>Granules</Link></li>
            <li><Link to='/pdr'>PDR's</Link></li>
            <li><Link to='/errors'>Errors</Link></li>
            <li><Link to='/logs'>Logs</Link></li>
            <li><Link to='/contact'>Contact</Link></li>
          </ul>
        </nav>
      </div>
    );
  }
});

export default Header;
