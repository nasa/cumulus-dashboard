'use strict';
import React from 'react';
import { Link } from 'react-router';
import { resolve } from 'path';
import sections from '../../paths';

var Sidebar = React.createClass({
  displayName: 'Sidebar',

  propTypes: {
    currentPath: React.PropTypes.string
  },

  resolvePath: function (base, path) {
    if (!path) { return base; }
    return resolve(base, path);
  },

  renderNavSection: function (section) {
    const { base, heading, routes } = section;
    return (
      <div key={base}>
        <h3>{heading}</h3>
        <ul>
          {routes(this.props.currentPath).map((d, i) => (
            <li key={base + i}><Link to={this.resolvePath(base, d[1])}>{d[0]}</Link></li>
          ))}
        </ul>
      </div>
    );
  },

  render: function () {
    return (
      <div className='sidebar'>
        <div className='sidebar__row'>
          {sections.map(this.renderNavSection)}
        </div>
      </div>
    );
  }
});

export default Sidebar;
