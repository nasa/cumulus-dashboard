'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const TableFilters = ({
  columns,
  onChange,
  hiddenColumns
}) => {
  function handleChange (id) {
    if (typeof onChange === 'function') {
      onChange(id);
    }
  }

  return (
    <div className='table__filters--wrapper'>
      {columns.map((column, index) => {
        const { Header, id, accessor } = column;
        const columnId = id || accessor;
        const isChecked = !hiddenColumns.includes(columnId);
        return (
          <div className='table__filters--filter' key={index}>
            <input type="checkbox" checked={isChecked} onChange={() => handleChange(columnId)} />
            <label>{Header}</label>
          </div>
        );
      })}
    </div>
  );
};

TableFilters.propTypes = {
  columns: PropTypes.array,
  onChange: PropTypes.func,
  hiddenColumns: PropTypes.array
};

export default TableFilters;
