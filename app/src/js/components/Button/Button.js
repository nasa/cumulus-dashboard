import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Button as Btn,
  Badge,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';

// This causes a ParseError
// import './Button.scss';

export const Button = ({
  badge,
  badgeVariant,
  bootstrapVariant,
  bootstrapSize,
  className,
  children,
  disabled,
  href,
  icon,
  label,
  onClick,
  overlayClass,
  spinner,
  style,
  target,
  title,
  tooltip,
  tooltipPlacement,
  tooltipId,
  type,
  variant
}) => {
  const buttonClasses = classNames(
    'button',
    {
      [`button--${variant}`]: !!variant,
      'button--icon': !!icon,
      'button--icon-only': !!icon && children === null,
      'button--badge': !!badge
    },
    className
  );

  let iconClasses;

  const buildIconClass = (buttonIcon) => {
    if (buttonIcon.includes('edsc')) {
      return buttonIcon;
    }
    return `fa fa-${buttonIcon}`;
  };

  if (icon) {
    iconClasses = classNames(
      'button__icon',
      children ? 'button__icon--push' : null,
      icon ? buildIconClass(icon) : null
    );
  }

  let badgeClasses;

  if (badge) {
    badgeClasses = classNames(
      'button__badge'
    );
  }

  let rel;
  if (target && target === '_blank') {
    rel = 'noopener nofollow';
  }

  const button = (
    <Btn
      className={buttonClasses}
      variant={bootstrapVariant}
      size={bootstrapSize}
      onClick={onClick}
      href={href}
      title={title || label}
      role="button"
      label={label}
      aria-label={label}
      type={type}
      disabled={disabled}
      target={target}
      rel={rel}
      style={style}
    >
      {<i className={iconClasses} /> }
      <span className="button__contents">
        { spinner
          ? (
            <span>
            </span>
            )
          : children
        }
      </span>
      {badge && (
        <span>
          <Badge
            className={badgeClasses}
            variant={badgeVariant === null ? 'secondary' : badgeVariant}
          >
            {badge}
          </Badge>
        </span>
      )}
    </Btn>
  );

  if (tooltip && tooltipId) {
    return (
      <OverlayTrigger
        placement={tooltipPlacement || 'top'}
        overlay={(
          <Tooltip id={tooltipId} className={overlayClass}>{tooltip}</Tooltip>
        )}
      >
        {button}
      </OverlayTrigger>
    );
  }

  return button;
};

Button.defaultProps = {
  badge: null,
  badgeVariant: null,
  bootstrapSize: null,
  bootstrapVariant: null,
  disabled: false,
  children: null,
  className: null,
  href: null,
  icon: null,
  onClick: null,
  overlayClass: null,
  popover: null,
  popoverId: null,
  spinner: false,
  style: null,
  title: null,
  tooltip: null,
  tooltipId: null,
  tooltipPlacement: null,
  type: 'button',
  variant: null
};

Button.propTypes = {
  badge: PropTypes.string,
  badgeVariant: PropTypes.string,
  bootstrapSize: PropTypes.string,
  bootstrapVariant: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  href: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  overlayClass: PropTypes.string,
  style: PropTypes.shape({}),
  target: PropTypes.string,
  title: PropTypes.string,
  tooltip: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  tooltipPlacement: PropTypes.string,
  tooltipId: PropTypes.string,
  type: PropTypes.string,
  variant: PropTypes.string,
  spinner: PropTypes.bool
};

export default Button;
