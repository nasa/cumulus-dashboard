'use strict';
import React from 'react';
import { Link } from 'react-router';
import { resolve } from 'path';
import paths from '../../paths';

const sections = ['collections', 'granules', 'pdrs', 'errors'];

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
    const meta = paths[section];
    return (
      <div key={meta.base}>
        <h3>{meta.heading}</h3>
        <ul>
          {meta.routes(this.props.currentPath).map((d, i) => (
            <li key={meta.base + i}><Link to={this.resolvePath(meta.base, d[1])}>{d[0]}</Link></li>
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
