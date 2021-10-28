import React, { useState } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import SimplePagination from '../Pagination/simple-pagination';
import Pagination from '../Pagination/pagination';
import Dropdown from '../DropDown/dropdown';
import pageSizeOptions from '../../utils/page-size';
import _config from '../../config';

const { defaultPageLimit } = _config;

/**
 * TableHeader
 * @description Component for rendering table header section that allows for page and number of results selection.
 */

const TableHeader = ({
  action,
  clear,
  count,
  limit = defaultPageLimit,
  onNewPage,
  page,
  selected = [],
  simplePaginationOptions = {},
}) => {
  const useSimplePagination = !isEmpty(simplePaginationOptions);
  const [selectedValues, setSelectedValues] = useState([
    {
      id: limit,
      label: limit.toString(),
    },
  ]);

  const numberChecked = selected.length;

  function handleLimitChange({ selections, updateSelection }) {
    if (selections.length === 0) {
      setSelectedValues([]);
    } else {
      const { label: value } = selections[0];
      setSelectedValues([
        {
          id: value,
          label: value,
        },
      ]);
    }
    updateSelection();
  }

  return (
    <div className="table__header">
      <div className="records-wrapper">
        <span>
          <b>{count}</b> total records{' '}
          {numberChecked > 0 && (
            <>
              (<b>{numberChecked}</b> selected)
            </>
          )}
        </span>
      </div>
      {useSimplePagination && <SimplePagination {...simplePaginationOptions} />}
      {!useSimplePagination && (
        <>
          <Pagination
            action={action}
            clear={clear}
            count={count}
            displayAsInput={true}
            limit={limit}
            page={page}
            onNewPage={onNewPage}
            showPages={true}
          />
          <div className="dropdown-wrapper">
            <span>Show </span>
            <Dropdown
              action={action}
              clear={clear}
              clearButton={false}
              inputProps={{ 'aria-label': 'Limit' }}
              label={<span className="sr-only">Limit</span>}
              onChange={handleLimitChange}
              options={pageSizeOptions}
              paramKey="limit"
              selectedValues={selectedValues}
            />
            <span>per page</span>
          </div>
        </>
      )}
    </div>
  );
};

TableHeader.propTypes = {
  action: PropTypes.func,
  clear: PropTypes.func,
  count: PropTypes.number,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onNewPage: PropTypes.func,
  page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  selected: PropTypes.array,
  simplePaginationOptions: PropTypes.object,
};

export default TableHeader;
