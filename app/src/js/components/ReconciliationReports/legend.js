import React from 'react';

const Legend = () => (
  <div className='legend'>
    <h3 className='legend--title'>Legend</h3>
    <p>When reviewing the reports, you may see the following indicators:</p>
    <ul className='legend-items'>
      <li className='legend-items--item'><span className='status-indicator status-indicator--failed'></span>Granule not found</li>
      <li className='legend-items--item'><span className='status-indicator status-indicator--orange'></span>Missing image file</li>
      <li className='legend-items--item'><span className='status-indicator status-indicator--success'></span>No issues/conflicts</li>
    </ul>
  </div>
);

export default Legend;
