import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Breadcrumb } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { withUrlHelper } from '../../withUrlHelper';

const Breadcrumbs = ({ config, urlHelper }) => {
  const location = useLocation();
  const locationQueryParams = useSelector((state) => state.locationQueryParams);
  const { getPersistentQueryParams } = urlHelper;

  return (
  <Breadcrumb>
    {config.map((item, index) => {
      const { href, label, active } = item || {};
      return (
        <li
          key={index}
          className={`breadcrumb-item ${active ? 'active' : ''}`}
        >
          {active
            ? <span>{label}</span>
            : <Link
              to={{
                pathname: href,
                search: locationQueryParams.search[href] || getPersistentQueryParams(location)
              }}>
              {label}
            </Link>}
        </li>
      );
    })}
  </Breadcrumb>
  );
};

Breadcrumbs.propTypes = {
  config: PropTypes.arrayOf(PropTypes.object),
  urlHelper: PropTypes.shape({
    getPersistentQueryParams: PropTypes.func
  }),
};

export default withUrlHelper(Breadcrumbs);
