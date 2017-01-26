'use strict';
import React from 'react';
import { Link } from 'react-router';

var Header = React.createClass({
  displayName: 'Header',

  render: function () {
    return (
      <div className='header'>
        <h1>Cumulus</h1>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/collections'>Collections</Link></li>
          <li><Link to='/granules'>Granules</Link></li>
          <li><Link to='/pdr'>PDR's</Link></li>
          <li><Link to='/'>Errors</Link></li>
          <li><Link to='/'>Logs</Link></li>
          <li><Link to='/'>Contact</Link></li>
        </ul>
      </div>
    );
  }
});

export default Header;
