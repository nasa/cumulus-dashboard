import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';

const TableFilters = ({ columns = [], setHiddenColumns, hiddenColumns = [], initialHiddenColumns }) => {
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [localHiddenColumns, setLocalHiddenColumns] = useState(hiddenColumns);

  function handleChange(id) {
    if (localHiddenColumns.includes(id)) {
      setLocalHiddenColumns(localHiddenColumns.filter((item) => item !== id));
    } else {
      setLocalHiddenColumns(localHiddenColumns.concat(id));
    }
  }

  function handleResetHiddenColumns() {
    setHiddenColumns(initialHiddenColumns);
    setLocalHiddenColumns(initialHiddenColumns);
  }

  function handleApplyHiddenColumns() {
    setHiddenColumns(localHiddenColumns);
  }

  return (
    <div className="table__filters form-group__element">
      <div className="label">Columns Filter</div>
      <button
        aria-expanded={filtersExpanded}
        aria-controls="table__filters--collapse"
        className={`button button--small button__filter ${filtersExpanded ? 'button__filter__expanded' : ''}`}
        onClick={() => setFiltersExpanded(!filtersExpanded)}
      >
        Show/Hide Columns
      </button>
      <Collapse in={filtersExpanded}>
        <div className="table__filters--collapse">
          <div className="table__filters--wrapper">
            <div className="table__filters--header">
              <div className="table__filters--header-title">
                <div className="table__filters--header-title-text">Columns Filter</div>
                <div role="button"
                  tabIndex={0}
                  className="table__filters--header-title-close"
                  onClick={() => setFiltersExpanded(!filtersExpanded)}>
                </div>
              </div>
              <div className="table__filters--header-subtitle">Select which columns you would like to show or hide in your table results.</div>
            </div>
            <div className="table__filters--checkboxes">
              {columns.map((column, index) => {
                const { Header, id, accessor } = column;
                const columnId = id || accessor;
                const isChecked = !localHiddenColumns.includes(columnId);
                return (
                  <div className="table__filters--filter" key={index}>
                    <label htmlFor={`chk_${columnId}`}
                      className="checkmark--wrapper">{Header}
                      <input
                        id={`chk_${columnId}`}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleChange(columnId)}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="table__filters--footer">
              <div>
                <div className="caption">* Sets back to default</div>
              </div>
              <div>
                {initialHiddenColumns &&
                  <button className="button button--small button__reset-filter"
                    onClick={() => handleResetHiddenColumns()}>
                    Reset <span className="caption">*</span>
                  </button>
                }
                <button
                  className="button button--small button__apply-filter"
                  onClick={() => handleApplyHiddenColumns()}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

TableFilters.propTypes = {
  columns: PropTypes.array,
  setHiddenColumns: PropTypes.func,
  hiddenColumns: PropTypes.array,
  initialHiddenColumns: PropTypes.array
};

export default TableFilters;
