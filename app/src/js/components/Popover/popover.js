import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Overlay, Popover as BootstrapPopover } from 'react-bootstrap';

const Popover = ({
  className,
  id,
  onMouseEnter,
  onMouseLeave,
  placement,
  popoverContent,
  popoverTitle,
  target,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const targetRef = useRef(null);

  function handleMouseEnter() {
    setShowPopover(true);
    if (typeof onMouseEnter === 'function') {
      onMouseEnter();
    }
  }

  function handleMouseLeave() {
    setShowPopover(false);
    if (typeof onMouseLeave === 'function') {
      onMouseLeave();
    }
  }

  return (
    <div
      className="hover-wrap"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span ref={targetRef}>{target}</span>
      <Overlay target={targetRef.current} show={showPopover} placement={placement}>
        <BootstrapPopover id={id} className={className}>
          {popoverTitle && <BootstrapPopover.Title>{popoverTitle}</BootstrapPopover.Title>}
          <BootstrapPopover.Content>
            {popoverContent}
          </BootstrapPopover.Content>
        </BootstrapPopover>
      </Overlay>
    </div>
  );
};

Popover.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  placement: PropTypes.string,
  popoverContent: PropTypes.node,
  popoverTitle: PropTypes.node,
  target: PropTypes.node,
};

export default Popover;
