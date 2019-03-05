'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { resolve } from 'path';
import sections from '../../paths';

const currentPathClass = 'sidebar__nav--selected';

class Sidebar extends React.Component {
  constructor () {
    super();
    this.displayName = 'Sidebar';
    this.resolvePath = this.resolvePath.bind(this);
    this.renderNavSection = this.renderNavSection.bind(this);
  }

  resolvePath (base, path) {
    if (!path) { return resolve(base); }
    return resolve(base, path);
  }

  renderNavSection (section) {
    const { base, routes } = section;
    const { currentPath, params, count } = this.props;
    return (
      <div key={base}>
        <ul>
          {routes(currentPath, params, count).map((d, i) => {
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
  }

  render () {
    return (
      <div className='sidebar'>
        <div className='sidebar__row'>
          {sections.map(this.renderNavSection)}
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  currentPath: PropTypes.string,
  params: PropTypes.object,
  count: PropTypes.array
};

export default Sidebar;
