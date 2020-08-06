import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
  page,
  onNewPage,
}) => {
  const [selectedValues, setSelectedValues] = useState([{
    id: limit,
    label: limit.toString(),
  }]);

  function handleLimitChange({ selections, updateSelection }) {
    if (selections.length === 0) {
      setSelectedValues([]);
    } else {
      const { id: value } = selections[0];
      setSelectedValues([{
        id: value,
        label: value,
      }]);
    }
    updateSelection();
  }

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
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onNewPage: PropTypes.func,
  page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default TableHeader;
