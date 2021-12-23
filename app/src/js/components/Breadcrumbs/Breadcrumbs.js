import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getPersistentQueryParams } from '../../utils/url-helper';

const Breadcrumbs = ({ config, locationQueryParams }) => (
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
              to={(toLocation) => (
                {
                  pathname: href,
                  search: locationQueryParams.search[href] || getPersistentQueryParams(toLocation)
                })}>
              {label}
            </Link>}
        </li>
      );
    })}
  </Breadcrumb>
);

Breadcrumbs.propTypes = {
  config: PropTypes.arrayOf(PropTypes.object),
  locationQueryParams: PropTypes.object,
};

export default connect((state) => ({
  locationQueryParams: state.locationQueryParams
}))(Breadcrumbs);
