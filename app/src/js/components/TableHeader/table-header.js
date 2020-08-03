import React from 'react';
import PropTypes from 'prop-types';
import Pagination from '../Pagination/pagination';
import Dropdown from '../DropDown/dropdown';
import pageSizeOptions from '../../utils/page-size';

/**
 * TableHeader
 * @description Component for rendering table header section that allows for page and number of results selection.
 */

// const disabled = ' pagination__link--disabled';
// const VISIBLE_PAGES = 7;
// const PAGE_LIMIT = 10;

const TableHeader = ({
  canNextPage,
  canPreviousPage,
  dataCount,
  gotoPage,
  nextPage,
  pageCount,
  pageIndex,
  pageOptions,
  previousPage,
  action,
  clear,
  count,
  limit,
  page,
  onNewPage,
}) => {
  const selectedValues = limit
    ? [{
      id: limit.toString(),
      label: limit.toString(),
    }]
    : [];
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
        onNewPage={onNewPage}
        showPages={true}
      />
      <div className="dropdown-wrapper">
        <span>Show </span>
        <Dropdown
          action={action}
          clear={clear}
          clearButton={false}
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
  canNextPage: PropTypes.bool,
  canPreviousPage: PropTypes.bool,
  dataCount: PropTypes.number,
  gotoPage: PropTypes.func,
  limit: PropTypes.number,
  onNewPage: PropTypes.func,
  page: PropTypes.number,
  nextPage: PropTypes.func,
  pageCount: PropTypes.number,
  pageIndex: PropTypes.number,
  pageOptions: PropTypes.array,
  previousPage: PropTypes.func,
};

export default TableHeader;
