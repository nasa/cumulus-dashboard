'use strict';
import React from 'react';
import { Link } from 'react-router';
import { resolve } from 'path';
import sections from '../../paths';

const currentPathClass = 'sidebar__nav--selected';

var Sidebar = React.createClass({
  displayName: 'Sidebar',

  propTypes: {
    currentPath: React.PropTypes.string,
    params: React.PropTypes.object
  },

  resolvePath: function (base, path) {
    if (!path) { return resolve(base); }
    return resolve(base, path);
  },

  renderNavSection: function (section) {
    const { base, routes } = section;
    const { currentPath, params } = this.props;
    return (
      <div key={base}>
        <ul>
          {routes(currentPath, params).map((d, i) => {
            let path = this.resolvePath(base, d[1]);
            let className = d[2] || '';
            if (path === currentPath) {
              className = className ? [className, currentPathClass].join(' ')
                : currentPathClass;
            }
            return (
              <li key={base + i}>
                <Link className={className} to={path}>{d[0]}</Link>
              </li>
            );
          })}
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
