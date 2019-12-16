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
    console.log('sections', section);
    const { currentPath, params, count } = this.props;
    return (
      <div key={base}>
        <ul>
          {
            routes(currentPath, params, count).map((d, i) => {
              const path = this.resolvePath(base, d[1]);
              const classes = [
                // d[2] might be a function; use it only when it's a string
                typeof d[2] === 'string' ? d[2] : '',
                path === currentPath ? currentPathClass : ''
              ].join(' ');

              return (
                <li key={base + i}>
                  <Link className={classes} to={path} onlyActiveOnIndex>
                    {d[0]}
                  </Link>
                </li>
              );
            })
          }
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
