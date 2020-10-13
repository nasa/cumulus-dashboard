import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip as TOOLTIP } from 'react-bootstrap';

const Tooltip = ({
  placement,
  tip,
  id,
  target,
  className = 'tooltip',
}) => (
  <OverlayTrigger
    placement={placement}
    overlay={
      <TOOLTIP id={id} className={className}>
        {tip}
      </TOOLTIP>
    }
  >
    {target}
  </OverlayTrigger>
);

Tooltip.propTypes = {
  tip: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  placement: PropTypes.string,
  id: PropTypes.string,
  target: PropTypes.node,
  className: PropTypes.string,
};

export default Tooltip;
