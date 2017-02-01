'use strict';
import React from 'react';
import { Link } from 'react-router';

var Sidebar = React.createClass({
  displayName: 'Sidebar',

  render: function () {
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
            <li><Link to='/collections/collection'>Overview</Link></li>
            <li><Link to='/collections/collection-granules'>Granules</Link></li>
            <li><Link to='/collections/collection-errors'>Errors</Link></li>
            <li><Link to='/collections/collection-ingest'>Ingest & Recipe</Link></li>
            <li><Link to='/collections/collection-logs'>Logs</Link></li>
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
