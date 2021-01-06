import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip as BootstrapTooltip } from 'react-bootstrap';

const Tooltip = ({
  className = 'tooltip',
  id = 'tooltip-id',
  placement,
  target,
  tip,
}) => (
  <OverlayTrigger
    placement={placement}
    overlay={
      <BootstrapTooltip className={className} id={id}>
        {tip}
      </BootstrapTooltip>
    }
  >
    {target}
  </OverlayTrigger>
);

Tooltip.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  placement: PropTypes.string,
  target: PropTypes.node,
  tip: PropTypes.node,
};

export default Tooltip;
