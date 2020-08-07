import React from 'react';
import Paginator from 'paginator';
import PropTypes from 'prop-types';
import Dropdown from '../DropDown/dropdown';

const noop = (e) => e.preventDefault();
const disabled = ' pagination__link--disabled';

const Pagination = ({
  action,
  clear,
  count,
  displayAsInput = false,
  limit,
  onNewPage,
  page,
}) => {
  function onPageClick(e) {
    e.preventDefault();
    const newPage = +e.currentTarget.getAttribute('data-value');
    setPage(newPage);
  }

  function setPage(newPage, callback) {
    if (
      +page !== newPage &&
      newPage >= 1 &&
      newPage <= Math.ceil(count / limit)
    ) {
      onNewPage(newPage);
      if (typeof callback === 'function') callback();
    }
  }

  function handleDropdownChange({ selections, updateSelection }) {
    if (selections && selections.length > 0) {
      const { id: selectedValue } = selections[0];
      setPage(selectedValue, updateSelection);
    } else {
      updateSelection();
    }
  }

  if (Number.isNaN(count) && Number.isNaN(limit) && Number.isNaN(page)) return null;

  const currentPage = +page;
  const paginator = new Paginator(limit, 7);
  const meta = paginator.build(count, currentPage);
  const pages = [];
  for (let i = meta.first_page; i <= meta.last_page; ++i) {
    pages.push(i);
  }
  const jumpToFirst = meta.first_page > 1 && (
    <li>
      <a href="#" data-value={1} onClick={onPageClick}>
        1
      </a>{' '}
      ...{' '}
    </li>
  );
  const jumpToLast = meta.last_page < meta.total_pages && (
    <li>
      {' '}
      ...{' '}
      <a href="#" data-value={meta.total_pages} onClick={onPageClick}>
        {meta.total_pages}
      </a>{' '}
    </li>
  );

  return (
    <div className={`pagination ${displayAsInput ? 'pagination-dropdown' : 'pagination-list'}`}>
      <ol>
        <li>
          <a
            className={`previous${meta.has_previous_page ? '' : disabled}`}
            data-value={meta.previous_page}
            onClick={meta.has_previous_page ? onPageClick : noop}
          >
            Previous
          </a>
        </li>
        {displayAsInput && (
          <Dropdown
            action={action}
            clear={clear}
            clearButton={false}
            onChange={handleDropdownChange}
            options={[
              {
                id: meta.total_pages,
                label: meta.total_pages.toString(),
              },
            ]}
            paramKey="page"
            selectedValues={[
              {
                id: currentPage,
                label: `${currentPage}`
              }]}
          />
        )}
        {!displayAsInput && (
          <>
            {jumpToFirst}
            {pages.map((d) => (
              <li
                key={d}
                className={d === currentPage ? 'pagination__link--active' : ''}
              >
                <a href="#" data-value={d} onClick={onPageClick}>
                  {d}
                </a>
              </li>
            ))}
            {jumpToLast}
          </>
        )}
        <li>
          <a
            className={`next${meta.has_next_page ? '' : disabled}`}
            data-value={meta.next_page}
            onClick={meta.has_next_page ? onPageClick : noop}
          >
            Next
          </a>
        </li>
      </ol>
    </div>
  );
};

Pagination.propTypes = {
  action: PropTypes.func,
  clear: PropTypes.func,
  count: PropTypes.number,
  displayAsInput: PropTypes.bool,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onNewPage: PropTypes.func,
  page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Pagination;
