import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';

const Legend = () => {
  const [legendExpanded, setLegendExpanded] = useState(false);
  return (
    <div className="table__legend">
      <div className="label">Table Legend</div>
      <button
        aria-expanded={legendExpanded}
        aria-controls="table__legend--collapse"
        className="button button--small button--no-left-padding button__legend"
        onClick={() => setLegendExpanded(!legendExpanded)}
      >
        {`${legendExpanded ? 'Hide' : 'Show'} Table Legend`}
      </button>
      <Collapse in={legendExpanded}>
        <div className="legend">
          <p>
            When reviewing the reports, you may see the following indicators:
          </p>
          <ul className="legend-items">
            <li className="legend-items--item">
              <span className="status-indicator status-indicator--failed"></span>
              Granule not found
            </li>
            <li className="legend-items--item">
              <span className="status-indicator status-indicator--orange"></span>
              Missing image file
            </li>
            <li className="legend-items--item">
              <span className="status-indicator status-indicator--success"></span>
              No issues/conflicts
            </li>
          </ul>
        </div>
      </Collapse>
    </div>
  );
};

export default Legend;
