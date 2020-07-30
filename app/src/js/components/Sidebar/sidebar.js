'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { resolve } from 'path';
import sections from '../../paths';
import { getPersistentQueryParams } from '../../utils/url-helper';

const currentPathClass = 'sidebar__nav--selected';

class Sidebar extends React.Component {
  constructor (props) {
    super(props);
    this.resolvePath = this.resolvePath.bind(this);
    this.renderNavSection = this.renderNavSection.bind(this);
  }

  resolvePath (base, path) {
    return path ? resolve(base, path) : resolve(base);
  }

  renderNavSection (section) {
    const { base, routes } = section;
    const { count } = this.props;
    const currentPath = this.props.currentPath || this.props.location.pathname;
    const params = {
      ...(this.props.params || {}),
      ...(this.props.match ? this.props.match.params : {})
    };

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
                  <Link className={classes} to={location => ({
                    pathname: path,
                    search: getPersistentQueryParams(location)
                  })}>
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
  count: PropTypes.array,
  location: PropTypes.object,
  match: PropTypes.object
};

export default Sidebar;
