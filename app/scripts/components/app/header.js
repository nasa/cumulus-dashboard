'use strict';
import React from 'react';
import { Link } from 'react-router';

var Header = React.createClass({
  displayName: 'Header',

  render: function () {
    return (
      <div className='header'>
        <h1>Header</h1>
        <Link to='/'>Home</Link>
        <Link to='/collections'>Collections</Link>
        <Link to='/granules'>Granules</Link>
      </div>
    );
  }
});

export default Header;
