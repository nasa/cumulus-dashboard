'use strict';
import React from 'react';
import { Link } from 'react-router';

var Sidebar = React.createClass({
  displayName: 'Sidebar',

  render: function () {
    return (
      <div className='header'>
        <ul>
          <li><Link to='/'></Link></li>
        </ul>
      </div>
    );
  }
});

export default Sidebar;
