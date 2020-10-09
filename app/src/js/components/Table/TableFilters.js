import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';

const TableFilters = ({
  columns,
  onChange,
  hiddenColumns = []
}) => {
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  function handleChange (id) {
    if (typeof onChange === 'function') {
      onChange(id);
    }
  }

  return (
    <div className='table__filters'>
      <button
        aria-expanded={filtersExpanded}
        aria-controls="table__filters--collapse"
        className='button button--small button__filter'
        onClick={() => setFiltersExpanded(!filtersExpanded)}
      >
        {`${filtersExpanded ? 'Hide' : 'Show'} Column Filters`}
      </button>
      <Collapse in={filtersExpanded}>
        <div className='table__filters--collapse'>
          <h3>Table Column Filters</h3>
          <div className='table__filters--wrapper'>
            {columns.map((column, index) => {
              const { Header, id, accessor } = column;
              const columnId = id || accessor;
              const isChecked = !hiddenColumns.includes(columnId);
              return (
                <div className='table__filters--filter' key={index}>
                  <input id={columnId} type='checkbox' checked={isChecked} onChange={() => handleChange(columnId)} />
                  <label htmlFor={columnId}>{Header}</label>
                </div>
              );
            })}
          </div>
        </div>
      </Collapse>
    </div>
  );
};

TableFilters.propTypes = {
  columns: PropTypes.array,
  onChange: PropTypes.func,
  hiddenColumns: PropTypes.array
};

export default TableFilters;
