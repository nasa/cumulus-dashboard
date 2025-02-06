import React, { Fragment } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { resolve } from 'path';
import sections from '../../paths';
import { toggleSidebar } from '../../actions';
import Tooltip from '../Tooltip/tooltip';
import { withUrlHelper } from '../../withUrlHelper';

const currentPathClass = 'sidebar__nav--selected';

const Sidebar = ({
  count,
  currentPath,
  match,
  urlHelper
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { getPersistentQueryParams } = urlHelper;
  const { logs, sidebar, locationQueryParams } = useSelector((state) => ({
    logs: state.logs,
    sidebar: state.sidebar,
    locationQueryParams: state.locationQueryParams
  }));
  const { open: sidebarOpen } = sidebar;
  const { metricsNotConfigured } = logs;

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
            let baseComplete = base;
            if (base === 'collections' && !d[1]) { baseComplete = 'collections/all'; }
            const path = resolvePath(baseComplete, d[1]);
            if (d[1] && d[1].includes('logs') && metricsNotConfigured) return null;
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
                    to={location}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate({
                        pathname: path,
                        search: locationQueryParams.search[path] || getPersistentQueryParams(location),
                      });
                    }}
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
      <Tooltip
        className="tooltip--light"
        id = "card-sidebar-tooltip"
        placement = "right"
        target = {
          <button
            aria-label={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            className={`sidebar-toggle button--round button--${
          sidebarOpen ? 'close' : 'open'
        }-sidebar`}
            onClick={handleToggleClick}
          />
        }
        tip={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
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
  logs: PropTypes.object,
  match: PropTypes.object,
  sidebar: PropTypes.shape({
    open: PropTypes.bool,
  }),
  locationQueryParams: PropTypes.object,
  urlHelper: PropTypes.shape({
    getPersistentQueryParams: PropTypes.func
  }),
};

export default withUrlHelper(Sidebar);
