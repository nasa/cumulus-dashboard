import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { resolve } from 'path';
import sections from '../../paths';
import { getPersistentQueryParams } from '../../utils/url-helper';
import { toggleSidebar } from '../../actions';

const currentPathClass = 'sidebar__nav--selected';

const Sidebar = ({
  count,
  currentPath,
  dispatch,
  location,
  match,
  params,
  sidebar,
}) => {
  const { open: sidebarOpen } = sidebar;

  function handleToggleClick() {
    dispatch(toggleSidebar());
  }

  function resolvePath(base, path) {
    return path ? resolve(base, path) : resolve(base);
  }

  function renderNavSection(section) {
    const { base, routes } = section;
    const navPath = currentPath || location.pathname;
    const navParams = {
      ...(params || {}),
      ...(match ? match.params : {}),
    };

    return (
      <div key={base}>
        <ul>
          {routes(navPath, navParams, count).map((d, i) => {
            const path = resolvePath(base, d[1]);
            const classes = [
              // d[2] might be a function; use it only when it's a string
              typeof d[2] === 'string' ? d[2] : '',
              path === currentPath ? currentPathClass : '',
            ].join(' ');

            return (
              <Fragment key={base + i}>
                {d[0] && <li>
                  <Link
                    className={classes}
                    to={(routeLocation) => ({
                      pathname: path,
                      search: getPersistentQueryParams(routeLocation),
                    })}
                  >
                    {d[0]}
                  </Link>
                </li>}
              </Fragment>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className={`sidebar-toggle--wrapper${sidebarOpen ? ' active' : ''}`}>
      <button
        aria-label={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
        className={`sidebar-toggle button--round button--${
          sidebarOpen ? 'close' : 'open'
        }-sidebar`}
        onClick={handleToggleClick}
        title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
      />
      <div className="sidebar">
        <div className="sidebar__row">{sections.map(renderNavSection)}</div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  count: PropTypes.array,
  currentPath: PropTypes.string,
  dispatch: PropTypes.func,
  location: PropTypes.object,
  match: PropTypes.object,
  params: PropTypes.object,
  sidebar: PropTypes.shape({
    open: PropTypes.bool,
  }),
};

export default connect((state) => ({
  sidebar: state.sidebar,
}))(Sidebar);
