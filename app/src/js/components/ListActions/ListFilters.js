import React from 'react';
import PropTypes from 'prop-types';

const ListFilters = ({
  children,
  className = ''
}) => {
  return (
    <div className={`filters ${className}`} >
      {children}
    </div>
  );
};

ListFilters.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default ListFilters;
