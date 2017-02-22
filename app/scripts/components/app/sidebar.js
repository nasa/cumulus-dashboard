'use strict';
import React from 'react';
import { Link } from 'react-router';

// TODO figure out a better way to programmatically generate sections
export const sections = [
  { section: 'collections', display: 'Overview', path: 'collection' },
  { section: 'collections', display: 'Granules', path: 'collection-granules' },
  { section: 'collections', display: 'Errors', path: 'collection-errors' },
  { section: 'collections', display: 'Ingest & Recipe', path: 'collection-ingest' },
  { section: 'collections', display: 'Logs', path: 'collection-logs' },

  { section: 'collections', display: 'Back to Collections', path: '../#', className: 'sidebar__nav--back', child: true },
  { section: 'collections', display: 'Active', path: '', child: true },
  { section: 'collections', display: 'Inactive', path: 'inactive', child: true },

  { section: 'granules', display: 'Overview', path: '' },
  { section: 'granules', display: 'All Granules', path: 'all-granules' },
  { section: 'granules', display: 'Errors', path: 'errors' },
  { section: 'granules', display: 'Marked for Deletion', path: 'marked-deletion' },
  { section: 'granules', display: 'Restricted', path: 'restricted' }
];

var Sidebar = React.createClass({
  displayName: 'Sidebar',

  propTypes: {
    currentPath: React.PropTypes.string
  },

  render: function () {
    console.log(this.props.currentPath);
    return (
      <div className='sidebar'>
        <div className='sidebar__row'>
          <h3>Collections Nav</h3>
          <ul>
            <li><Link className='sidebar__nav--back' to='#'>Back to Collections</Link></li>
            <li><Link to='/collections'>Active</Link></li>
            <li><Link to='/collections/inactive'>In-Active</Link></li>
          </ul>

          <h3>Collection Nav</h3>
          <ul>
            <li><Link to='/collections'>Overview</Link></li>
            <li><Link to='/collections/granules'>Granules</Link></li>
            <li><Link to='/collections/errors'>Errors</Link></li>
            <li><Link to='/collections/ingest'>Ingest & Recipe</Link></li>
            <li><Link to='/collections/logs'>Logs</Link></li>
          </ul>

          <h3>Granules Nav</h3>
          <ul>
            <li><Link to='/granules'>Overview</Link></li>
            <li><Link to='/granules/all-granules'>All Granules</Link></li>
            <li><Link to='/granules/errors'>Errors</Link></li>
            <li><Link to='/granules/marked-deletion'>Marked for Deletion</Link></li>
            <li><Link to='/granules/restricted'>Restricted</Link></li>
          </ul>

          <h3>Granule Nav</h3>
          <ul>
            <li><Link to='/granules/granule'>Granule</Link></li>
            <li><Link to='/granules/granule-ingest'>Granule Ingest</Link></li>
          </ul>

          <h3>PDRs Nav</h3>
          <ul>
            <li><Link to='/pdr'>Overview</Link></li>
            <li><Link to='/pdr/active'>Active</Link></li>
            <li><Link to='/pdr/errors'>Errors</Link></li>
            <li><Link to='/pdr/completed'>Completed</Link></li>
            <li><Link to='/pdr/pdr'>PDR</Link></li>
          </ul>

          <h3>Errors</h3>
          <ul>
            <li><Link to='/errors/error'>Error</Link></li>
          </ul>
        </div>
      </div>
    );
  }
});

export default Sidebar;
