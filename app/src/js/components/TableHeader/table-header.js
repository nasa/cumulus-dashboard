import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import withQueryParams from 'react-router-query-params';
import Pagination from '../Pagination/pagination';
import Dropdown from '../DropDown/dropdown';
import pageSizeOptions from '../../utils/page-size';

/**
 * TableHeader
 * @description Component for rendering table header section that allows for page and number of results selection.
 */

const TableHeader = ({
  action,
  clear,
  count,
  limit,
  page,
  onNewPage,
  setQueryParams,
}) => {
  const selectedValues = limit
    ? [{
      id: limit,
      label: limit.toString(),
    }]
    : [];

  const [updatedLimit, setUpdatedLimit] = useState(limit);
  const [updatedPage, setUpdatedPage] = useState(page);

  function handleLimitChange({ value: newLimit }) {
    setUpdatedLimit(newLimit);
  }

  function handlePageChange(newPage) {
    setUpdatedPage(newPage);
  }

  useEffect(() => {
    setQueryParams({ limit: updatedLimit || limit, page: updatedPage || page });
  }, [limit, page, setQueryParams, updatedLimit, updatedPage]);

  return (
    <div className="table__header">
      <span>
        Showing <b>{count}</b> records
      </span>
      <Pagination
        action={action}
        clear={clear}
        count={count}
        displayAsInput={true}
        limit={limit}
        page={page}
        onDropdownChange={handlePageChange}
        onNewPage={onNewPage}
        showPages={true}
      />
      <div className="dropdown-wrapper">
        <span>Show </span>
        <Dropdown
          action={action}
          clear={clear}
          clearButton={false}
          onChange={handleLimitChange}
          options={pageSizeOptions}
          paramKey="limit"
          selectedValues={selectedValues}
        />
        <span>per page</span>
      </div>
    </div>
  );
};

TableHeader.propTypes = {
  action: PropTypes.func,
  clear: PropTypes.func,
  count: PropTypes.number,
  limit: PropTypes.number,
  onNewPage: PropTypes.func,
  page: PropTypes.number,
  setQueryParams: PropTypes.func,
};

export default withQueryParams()(TableHeader);
