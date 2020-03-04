import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ config }) => {
  return (
    <Breadcrumb>
      {config.map((item, index) => {
        const { href, label, active } = item || {};
        return (
          <li
            key={index}
            className={`breadcrumb-item ${active ? 'active' : ''}`}
          >
            {active ? <span>{label}</span> : <Link to={href}>{label}</Link>}
          </li>
        );
      })}
    </Breadcrumb>
  );
};

Breadcrumbs.propTypes = {
  config: PropTypes.arrayOf(PropTypes.object)
};

export default Breadcrumbs;
